"use client";

import { KeyboardEvent, useState, useEffect } from "react";
import { Product, Language } from "../types";

/**
 * INTERFACES (TypeScript)
 * Interfaces define the strict "shape" of the data this component expects to receive.
 * This prevents bugs (e.g., trying to access product.title when it's actually product.name).
 * KEYWORDS TO SEARCH: "TypeScript Interfaces", "React Component Props"
 */
interface FoodCardProps {
  product: Product;
  lang: Language;
  offerText: string;
  fallbackImage: string;
  onSelect: (product: Product) => void;
}

/**
 * REUSABLE COMPONENT
 * By extracting this HTML out of the main page, we keep the main page clean.
 * We pass 'props' (properties) into the function so it knows what to display.
 */
export default function FoodCard({ product, lang, offerText, fallbackImage, onSelect }: FoodCardProps) {
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedSizeId, setSelectedSizeId] = useState<string>(
    product.defaultSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0].id : "")
  );

  useEffect(() => {
    setSelectedSizeId(
      product.defaultSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0].id : "")
    );
  }, [product.id, product.defaultSize]);

  // Helper to extract the correct string based on the current language
  const getText = (textObj: any) => {
    if (!textObj) return "";
    if (typeof textObj === "string") return textObj;
    return textObj[lang] || textObj.en || "";
  };

  const hasMultipleSizes = Boolean(product.sizes && product.sizes.length > 1);
  const activeSize = product.sizes?.find((s) => s.id === selectedSizeId) || product.sizes?.[0];
  const displayedPrice = activeSize 
    ? activeSize.price 
    : (product.price && product.price.trim() ? product.price : offerText);

  const handleCardClick = () => {
    onSelect({
      ...product,
      selectedSizeId: activeSize?.id
    });
  };

  // Accessibility: Allows users navigating with a keyboard to press Enter/Space to open the modal
  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <article
      className={`card ${hasMultipleSizes ? "multi-size-card" : ""}`}
      tabIndex={0} // Makes the card focusable with the Tab key
      role="button"
      aria-label={getText(product.name)}
      onClick={handleCardClick} // Triggers the modal popup with currently selected size
      onKeyDown={handleKeyDown}
    >
      <div className={`card-img-container ${isLoaded ? "loaded" : ""}`}>
        {!isLoaded && <div className="chicken-loader"></div>}
        <img 
          src={product.image || fallbackImage} 
          alt={getText(product.name)} 
          loading="lazy" 
          onLoad={() => setIsLoaded(true)}
        />
      </div>
      <div className="card-info">
        <div className="card-header-line">
          <h3 className="card-title">
            {getText(product.name)}
            {product.isSpicy && <span className="card-spicy-icon" aria-label="Spicy">🌶️</span>}
          </h3>
        </div>

        {/* Interactive selectable size bar directly on the card */}
        {hasMultipleSizes && (
          <div 
            className="card-size-bar" 
            role="group" 
            aria-label="Select size"
          >
            {product.sizes!.map((size) => {
              const isSelected = size.id === (activeSize?.id || product.sizes![0].id);
              return (
                <button
                  key={size.id}
                  type="button"
                  className={`size-bar-btn ${isSelected ? "active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSizeId(size.id);
                  }}
                  aria-pressed={isSelected}
                  title={`${getText(size.name)} ${size.dimension ? `(${size.dimension})` : ""}`}
                >
                  <span className="size-btn-code">{size.id.toUpperCase()}</span>
                </button>
              );
            })}
          </div>
        )}
        
        <div className="card-meta-row">
          <p className="card-price">
            {displayedPrice}
          </p>

          {activeSize?.dimension && hasMultipleSizes && (
            <span className="card-size-dim-badge">
              {activeSize.dimension}
            </span>
          )}

          {product.comboOption && (
            <span className="card-combo-pill">
              {lang === "ar" ? "خيار كومبو" : "Combo Option"}
            </span>
          )}

          {product.badge && (
            <span className="card-badge-pill">
              {getText(product.badge)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
