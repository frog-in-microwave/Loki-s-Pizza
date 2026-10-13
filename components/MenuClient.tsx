/**
 * "use client"
 * This directive tells Next.js that this component needs to run in the user's browser.
 * We need this because we are using interactive features like click events, state, and scrolling.
 * 
 * KEYWORDS TO SEARCH: "Next.js Client Components", "React Hydration"
 */
"use client";

// We import React Hooks. Hooks are special functions that let you "hook into" React features.
// KEYWORDS TO SEARCH: "React Hooks", "useState", "useEffect", "useMemo"
import { useState, useEffect, useMemo, useRef, MouseEvent } from "react";

// Importing our JSON data directly.
import menuData from "../app/data/products.json";

// Importing our smaller extracted components.
import FoodCard from "./FoodCard";
import Header from "./Header";
import Footer from "./Footer";
import ItemModal from "./ItemModal";

import { Language, Category, Product } from "../types";
import { siteText, FALLBACK_IMAGE } from "../constants";

export default function MenuClient({ initialLang }: { initialLang: Language }) {
  
  /**
   * STATE (useState)
   * State is the "memory" of a component. When state changes, React automatically re-renders 
   * the screen to show the new data.
   */
  // Remembers the current language (starts with what the server told us).
  const [lang, setLang] = useState<Language>(initialLang);
  
  // Remembers which product the user clicked on (so we can show it in the modal).
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  
  // Remembers which category section is currently being viewed on screen.
  const [activeCategory, setActiveCategory] = useState<string>("");

  // Refs to control scrolling state and avoid conflicts between click and scroll spy
  const activeCategoryRef = useRef<string>("");
  const isClickScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Remembers active subcategory filter for pizzas
  const [pizzaSubcategory, setPizzaSubcategory] = useState<string>("all");

  /**
   * MEMOIZATION (useMemo)
   * useMemo remembers the result of a calculation so we don't have to redo the math 
   * every single time the page re-renders (like when the user clicks a button).
   */
  // 1. Sort the categories by their "order" number.
  const categories = useMemo(() => {
    return [...(menuData.categories as Category[])].sort((a, b) => (a.order || 9999) - (b.order || 9999));
  }, []);

  // 2. Group the products by their category, and sort them alphabetically based on the current language.
  const productsByCategory = useMemo(() => {
    const map: Record<string, Product[]> = {};
    (menuData.products as Product[]).forEach((p) => {
      if (p.isAvailable === false) return;
      if (!map[p.categoryId]) map[p.categoryId] = [];
      map[p.categoryId].push(p);
    });

    for (const key in map) {
      map[key].sort((a, b) => {
        const orderDiff = (a.order || 9999) - (b.order || 9999);
        if (orderDiff !== 0) return orderDiff;
        const aName = (a.name as any)[lang] || a.name.en || "";
        const bName = (b.name as any)[lang] || b.name.en || "";
        return aName.localeCompare(bName, lang);
      });
    }
    return map;
  }, [lang]); // The dependency array [lang] means: "Recalculate this math ONLY if 'lang' changes".

  /**
   * SIDE EFFECTS (useEffect)
   * useEffect lets you synchronize a component with an external system (like the browser DOM or window).
   */
  // Run once on load to set the very first category as "active".
  useEffect(() => {
    if (categories.length > 0) {
      setActiveCategory(categories[0].id);
      activeCategoryRef.current = categories[0].id;
    }
  }, [categories]);

  // Update the HTML document instantly when the user clicks the language toggle.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  // Helper function to pull the correct language string out of an object.
  const getText = (textObj: any) => {
    if (!textObj) return "";
    if (typeof textObj === "string") return textObj;
    return textObj[lang] || textObj.en || "";
  };

  /**
   * EVENT HANDLERS
   * Functions that run when a user interacts with the page (clicking a button).
   */
  const changeLanguage = (newLang: Language) => {
    setLang(newLang); // Update React memory
    // Save to browser Cookie so the Next.js Server can read it next time they visit!
    document.cookie = `restaurant-language=${newLang}; path=/; max-age=31536000`;
  };

  // Centers the active category link horizontally in the navbar without disturbing page scroll
  const scrollNavToCategory = (catId: string) => {
    const navWrapper = document.getElementById("nav-links");
    const activeLink = document.querySelector(`.nav-link[data-category-id="${catId}"]`) as HTMLElement;
    if (navWrapper && activeLink) {
      const linkLeft = activeLink.offsetLeft;
      const linkWidth = activeLink.offsetWidth;
      const wrapperWidth = navWrapper.offsetWidth;
      navWrapper.scrollTo({
        left: linkLeft - wrapperWidth / 2 + linkWidth / 2,
        behavior: "smooth"
      });
    }
  };

  // Scrolls smoothly to a category when a navbar link is clicked.
  const handleScrollToCategory = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveCategory(id);
    activeCategoryRef.current = id;
    scrollNavToCategory(id);

    const el = document.getElementById(id);
    if (el) {
      isClickScrollingRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      el.scrollIntoView({ behavior: "smooth", block: "start" });

      scrollTimeoutRef.current = setTimeout(() => {
        isClickScrollingRef.current = false;
      }, 850);
    }
  };

  /**
   * SCROLL SPY LOGIC
   * Listens to the browser's scroll event and updates the active category in the Navbar.
   */
  useEffect(() => {
    const handleScroll = () => {
      // Don't override active category while smooth-scrolling from a user click
      if (isClickScrollingRef.current) return;

      // Check if user has scrolled to the bottom of the page
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        const lastCat = categories[categories.length - 1];
        if (lastCat && lastCat.id !== activeCategoryRef.current) {
          setActiveCategory(lastCat.id);
          activeCategoryRef.current = lastCat.id;
          scrollNavToCategory(lastCat.id);
        }
        return;
      }

      const nav = document.getElementById("category-nav");
      const navBottom = (nav ? nav.getBoundingClientRect().bottom : 60) + 30;

      let currentId = categories[0]?.id || "";
      for (const cat of categories) {
        const el = document.getElementById(cat.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= navBottom) {
            currentId = cat.id;
          }
        }
      }

      if (currentId && currentId !== activeCategoryRef.current) {
        setActiveCategory(currentId);
        activeCategoryRef.current = currentId;
        scrollNavToCategory(currentId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [categories]);

  return (
    <>
      {/* We pass 'lang' as a prop to Header so it knows which language to display */}
      <Header lang={lang} changeLanguage={changeLanguage} />

      <nav id="category-nav" aria-label="Menu categories">
        <div className="nav-scroll-wrapper" id="nav-links">
          {/* We use Array.map() to loop over categories and turn them into HTML links */}
          {categories.map((cat) => (
            <a
              key={cat.id} // React requires a unique 'key' when looping over items
              className={`nav-link ${activeCategory === cat.id ? "active" : ""}`}
              href={`#${cat.id}`}
              data-category-id={cat.id}
              onClick={(e) => handleScrollToCategory(e, cat.id)}
            >
              {getText(cat.name)}
            </a>
          ))}
        </div>
      </nav>

      <main id="menu-container">
        {categories.map((cat, i) => {
          const isPizza = cat.id === "pizza";
          const categoryProducts = productsByCategory[cat.id] || [];
          const displayedProducts = isPizza && pizzaSubcategory !== "all"
            ? categoryProducts.filter((p) => p.subcategoryId === pizzaSubcategory)
            : categoryProducts;

          const pizzaFilters = [
            { id: "all", label: { en: "All", ar: "الكل" } },
            { id: "beef", label: { en: "Beef", ar: "لحوم" } },
            { id: "chicken", label: { en: "Chicken", ar: "دجاج" } },
            { id: "seafood", label: { en: "Seafood", ar: "مأكولات بحرية" } },
            { id: "vegetarian", label: { en: "Vegetarian", ar: "نباتي" } },
            { id: "mixes", label: { en: "Mixes", ar: "تشكيلات خاصة" } },
          ];

          return (
            <section key={cat.id} id={cat.id} className="category-section" data-category-id={cat.id}>
              {/* If it is not the very first category (i !== 0), draw a horizontal line */}
              {i !== 0 && <hr className="category-divider" />}
              
              <div className="category-header-wrap">
                <h2 className="category-title">{getText(cat.name)}</h2>
                {cat.subtitle && (
                  <p className="category-subtitle">
                    <span className="diamond-bullet">✦</span>
                    {getText(cat.subtitle)}
                  </p>
                )}
                {cat.note && (
                  <p className="category-note">
                    {getText(cat.note)}
                  </p>
                )}
              </div>

              {isPizza && (
                <div className="pizza-subfilter-bar" role="tablist" aria-label="Pizza types">
                  {pizzaFilters.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      role="tab"
                      aria-selected={pizzaSubcategory === f.id}
                      className={`pizza-subfilter-btn ${pizzaSubcategory === f.id ? "active" : ""}`}
                      onClick={() => setPizzaSubcategory(f.id)}
                    >
                      {getText(f.label)}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="grid">
                {/* Loop over products specific to THIS category */}
                {displayedProducts.map((product) => (
                  <FoodCard
                    key={product.id}
                    product={product}
                    lang={lang}
                    offerText={siteText[lang].offer}
                    fallbackImage={FALLBACK_IMAGE}
                    onSelect={setActiveProduct} // We pass the state-updating function down!
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <Footer lang={lang} />
      
      {/* The Modal is always rendered, but hidden via CSS unless activeProduct has data */}
      <ItemModal product={activeProduct} lang={lang} onClose={() => setActiveProduct(null)} />
    </>
  );
}
