"use client";

import Link from "next/link";

type BreadcrumbItem = { label: string; href?: string };
type TocItem = { id: string; label: string };

type ToolLayoutProps = {
  title: string;
  updated: string;
  categories?: string[];
  breadcrumb?: BreadcrumbItem[];
  toc?: TocItem[];
  calculator: React.ReactNode;
  children: React.ReactNode;
};

export function ToolLayout({
  title,
  updated,
  categories = [],
  breadcrumb = [],
  toc = [],
  calculator,
  children,
}: ToolLayoutProps) {
  return (
    <div className="tool-detail-page">
      <div className="tool-detail-inner">

        {/* -------------------------------------------------- */}
        {/* Breadcrumb */}
        {/* -------------------------------------------------- */}
        <nav className="tool-detail-breadcrumb">
          {breadcrumb.map((b, i) =>
            b.href ? (
              <Link key={i} href={b.href}>{b.label}</Link>
            ) : (
              <span key={i}>&gt; {b.label}</span>
            )
          )}
        </nav>

        {/* MOBILE TITLE */}
        <div className="tool-detail-mobile-title">
          <p className="tool-detail-updated">Last updated: {updated}</p>
          <h1 className="tool-detail-title">{title}</h1>
        </div>

        {/* -------------------------------------------------- */}
        {/* GRID */}
        {/* -------------------------------------------------- */}
        <div className="tool-detail-grid">
          
          {/* ---------- LEFT SIDE ---------- */}
          <section className="tool-detail-left">

            <div className="tool-detail-header">

              {/* 🌈 PRETTIER CATEGORY CHIPS */}
              <div className="tool-detail-meta-row">
                {categories.map((c, i) => (
                  <span
                    key={i}
                    className={`tool-detail-chip ${
                      i === 0 ? "tool-detail-chip-category" : ""
                    }`}
                  >
                    {c}
                  </span>
                ))}
              </div>

              {/* -------------------------------------------------- */}
              {/* 🚫 REMOVED CREATOR / LIKES / SHARE (commented out) */}
              {/* -------------------------------------------------- */}

              {/*
              <div className="tool-detail-people-row">
                <div className="tool-detail-creator">
                  <div className="tool-avatar-circle">IG</div>
                  <div>
                    <div className="tool-detail-label">Creator</div>
                    <div className="tool-detail-strong">
                      Indiagraphs Tools Team
                    </div>
                  </div>
                </div>

                <div className="tool-detail-helpful">
                  <span className="tool-detail-like-icon">👍</span>
                  <span>
                    <strong>127</strong> people found this helpful
                  </span>
                </div>
              </div>

              <div className="tool-detail-share-row">
                <button className="tool-share-btn">👍 Like</button>

                <button
                  className="tool-share-btn"
                  onClick={() => {
                    navigator?.clipboard?.writeText(window.location.href);
                    alert("Link copied!");
                  }}
                >
                  🔗 Copy link
                </button>

                <button className="tool-share-btn">↗️ Share</button>
              </div>
              */}
            </div>

            {/* TOC */}
            {toc.length > 0 && (
              <nav className="tool-detail-toc">
                <h2>Table of contents</h2>
                <ul>
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`}>{item.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {/* CONTENT */}
            <article className="tool-detail-article">{children}</article>
          </section>

          {/* ---------- RIGHT SIDE (Calculator) ---------- */}
          <aside className="tool-detail-right">
            <div className="tool-detail-card-sticky">
              <div className="tool-detail-card">

                {/* ✔ CALCULATOR SUBTITLE (desktop only) */}
                <div className="tool-calculator-desktop-only">
                  <h2 className="tool-calculator-title">Calculator</h2>
                  <p className="tool-calculator-sub">
                    Adjust the inputs and hit calculate to see a rough income figure.
                  </p>
                </div>

                {calculator}

              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}