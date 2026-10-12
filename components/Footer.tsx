"use client";

import { Language } from "../types";
import { siteText } from "../constants";

interface FooterProps {
  lang: Language;
}

export default function Footer({ lang }: FooterProps) {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-maps-wrapper">
          <div className="footer-map-container">
            <h4>
              <i
                className="fas fa-map-marker-alt"
                style={{ marginInlineEnd: "8px", color: "var(--brand-gold)" }}
              ></i>
              {lang === "en" ? "Saida" : "صيدا"}
            </h4>
            <div className="map-frame">
              <iframe
                title="Loki's swidish pizza - saida"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3324.954493734277!2d35.37088437481988!3d33.55455864384701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ef17b1ea65693%3A0x669f0a8d69530096!2sLoki's%20pizza!5e0!3m2!1sen!2slb!4v1791827230977!5m2!1sen!2slb"
                width="100%"
                height="200"
                style={{ border: 0, display: "block" }}
                allowFullScreen={false}
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="footer-info">
          <h3 id="footer-title">{siteText[lang].visitUs}</h3>
          <p id="footer-location">{siteText[lang].location}</p>

          <div className="social-icons">
            <a
              href="https://www.instagram.com/lokisswedishpizza"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram @lokisswedishpizza"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://wa.me/96181664310"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp 81 664 310"
            >
              <i className="fab fa-whatsapp"></i>
            </a>
            <a href="tel:+96181664310" aria-label="Phone 81 664 310">
              <i className="fas fa-phone-alt"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom" id="footer-bottom">
        {siteText[lang].footerBottom}
      </div>
    </footer>
  );
}
