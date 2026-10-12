"use client";

import { Language } from "../types";
import { siteText } from "../constants";

interface HeaderProps {
  lang: Language;
  changeLanguage: (newLang: Language) => void;
}

export default function Header({ lang, changeLanguage }: HeaderProps) {
  return (
    <header className="brand-hero">
      <div className="language-toggle" aria-label="Language selector">
        <button
          id="lang-en"
          className={`lang-btn ${lang === "en" ? "active" : ""}`}
          type="button"
          onClick={() => changeLanguage("en")}
        >
          English
        </button>
        <button
          id="lang-ar"
          className={`lang-btn ${lang === "ar" ? "active" : ""}`}
          type="button"
          onClick={() => changeLanguage("ar")}
        >
          عربي
        </button>
      </div>

      <div className="brand-content">
        <div className="logo">
          <img
            src="/data/layout_images/logo_pic.avif"
            alt="Loki's Swedish Pizza & More Menu"
            className="restaurant-logo"
          />
        </div>

        <div className="phone-container">
          <a className="phone-number" href="tel:+96181664310" aria-label="Call Loki's restaurant">
            <span className="phone-val" dir="ltr" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <i className="fas fa-phone-alt" style={{ transform: "scaleX(-1)" }}></i>
              81 / 664 310
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
