"use client";

import { useState, useEffect } from "react";
import { Language, Product } from "../types";
import { siteText } from "../constants";

interface ItemModalProps {
  product: Product | null;
  lang: Language;
  onClose: () => void;
}

export default function ItemModal({ product, lang, onClose }: ItemModalProps) {
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [isFullImageOpen, setIsFullImageOpen] = useState(false);

  // When product changes, reset loading state, default selected size & full image state
  useEffect(() => {
    setIsImgLoaded(false);
    setIsFullImageOpen(false);
    if (product?.sizes && product.sizes.length > 0) {
      setSelectedSizeId(product.selectedSizeId || product.defaultSize || product.sizes[0].id);
    } else {
      setSelectedSizeId(null);
    }
  }, [product]);

  const getText = (textObj: any) => {
    if (!textObj) return "";
    if (typeof textObj === "string") return textObj;
    return textObj[lang] || textObj.en || "";
  };

  // Handle Escape key to close modal & lock background scrolling
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullImageOpen) {
          setIsFullImageOpen(false);
        } else {
          onClose();
        }
      }
    };
    if (product) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [product, isFullImageOpen, onClose]);

  const activeSize = product?.sizes?.find((s) => s.id === selectedSizeId) || product?.sizes?.[0];
  const displayedPrice = activeSize 
    ? activeSize.price 
    : (product?.price && product.price.trim() ? product.price : siteText[lang].offer);

  return (
    <div 
      id="item-modal" 
      className={`modal ${product ? "active" : ""}`} 
      aria-hidden={!product}
      onClick={onClose}
    >
      <div 
        className="modal-content" 
        role="dialog" 
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" type="button" aria-label="Close modal" onClick={onClose}>×</button>
        
        {product && (
          <div className="modal-scroll-area">
            <div 
              className={`modal-img-container ${isImgLoaded ? "loaded" : ""}`}
              role="button"
              tabIndex={0}
              aria-label={lang === "ar" ? "عرض الصورة بالحجم الكامل" : "View full size image"}
              title={lang === "ar" ? "انقر لعرض الصورة بالحجم الكامل" : "Click to view full size"}
              onClick={() => setIsFullImageOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsFullImageOpen(true);
                }
              }}
            >
              {!isImgLoaded && <div className="chicken-loader"></div>}
              <img 
                src={product.image} 
                alt={getText(product.name)} 
                id="modal-img" 
                onLoad={() => setIsImgLoaded(true)} 
              />
              <div className="img-zoom-hint" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="11" y1="8" x2="11" y2="14"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
                <span>{lang === "ar" ? "تكبير" : "Zoom"}</span>
              </div>
            </div>
            <div className="modal-text">
              <div className="modal-title-wrap">
                <h2 id="modal-title">{getText(product.name)}</h2>
                {product.isSpicy && (
                  <span className="modal-spicy-tag" title={siteText[lang].spicy}>
                    🌶️ {siteText[lang].spicy}
                  </span>
                )}
                {product.badge && (
                  <span className="modal-custom-tag">
                    {getText(product.badge)}
                  </span>
                )}
              </div>

              <p id="modal-price" className="modal-price">
                {displayedPrice}
              </p>

              {product.description && (
                <p id="modal-desc">
                  {getText(product.description)}
                </p>
              )}

              {/* Multi-Size Selection Section for Pizzas */}
              {product.sizes && product.sizes.length > 1 && (
                <div className="modal-sizes-section">
                  <div className="modal-sizes-header">
                    <span className="modal-sizes-title">
                      <i className="fas fa-pizza-slice" style={{ marginInlineEnd: "6px" }}></i>
                      {siteText[lang].selectSize}
                    </span>
                  </div>

                  <div className="modal-sizes-grid">
                    {product.sizes.map((s) => {
                      const isSelected = s.id === (selectedSizeId || product.sizes![0].id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          className={`modal-size-card ${isSelected ? "selected" : ""}`}
                          onClick={() => setSelectedSizeId(s.id)}
                          aria-pressed={isSelected}
                        >
                          <span className="size-code-badge">{s.id.toUpperCase()}</span>
                          <span className="size-info-block">
                            <span className="size-name-text">{getText(s.name)}</span>
                            {s.dimension && <span className="size-dim-text">{s.dimension}</span>}
                          </span>
                          <span className="size-price-text">{s.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pizza Specialty Notes */}
              {product.categoryId === "pizza" && (
                <div className="modal-pizza-notes">
                  <div className="pizza-note-row">
                    <span className="diamond-bullet">✦</span>
                    <span>{siteText[lang].pizzaSaladNote}</span>
                  </div>
                  <div className="pizza-note-row">
                    <span className="diamond-bullet">✦</span>
                    <span>{siteText[lang].mixAndMatch}</span>
                  </div>
                </div>
              )}

              {/* Combo Option Note for Rolls & Burgers */}
              {product.comboOption && (
                <div className="modal-combo-banner">
                  <span className="diamond-bullet">✦</span>
                  <span>{siteText[lang].comboAvailable}</span>
                </div>
              )}

              {/* Appetizers Dips Note */}
              {product.categoryId === "appetizers" && (
                <div className="modal-combo-banner dips">
                  <span className="diamond-bullet">✦</span>
                  <span>{siteText[lang].dipsNote}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Full-Screen Unobstructed Image Lightbox */}
      {isFullImageOpen && product && (
        <div 
          className="lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={getText(product.name)}
          onClick={(e) => {
            e.stopPropagation();
            setIsFullImageOpen(false);
          }}
        >
          <button 
            className="lightbox-close-btn" 
            type="button" 
            aria-label={lang === "ar" ? "إغلاق عرض الصورة" : "Close full size view"} 
            onClick={(e) => {
              e.stopPropagation();
              setIsFullImageOpen(false);
            }}
          >
            ×
          </button>
          <div className="lightbox-img-wrapper" onClick={(e) => e.stopPropagation()}>
            <img 
              src={product.image} 
              alt={getText(product.name)} 
              className="lightbox-img" 
              onClick={() => setIsFullImageOpen(false)}
              title={lang === "ar" ? "انقر للإغلاق" : "Click to close"}
            />
          </div>
        </div>
      )}
    </div>
  );
}
