"use client";

import { useEffect } from "react";

export default function FAQScript() {
  useEffect(() => {
    const items = document.querySelectorAll(".faq-accordion");

    items.forEach((acc) => {
      const btn = acc.querySelector(".faq-question");
      if (!btn) return;

      btn.addEventListener("click", () => {
        acc.classList.toggle("active");
      });
    });
  }, []);

  return null; // nothing to render
}