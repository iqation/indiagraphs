"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface TocItem {
  id: string;
  label: string;
}

interface ToolLayoutComparisonProps {
  title: string;
  updated: string;
  categories?: string[];
  breadcrumb?: BreadcrumbItem[];
  toc?: TocItem[];
  calculator: ReactNode;
  fullWidthResults?: ReactNode;
  children: ReactNode;
}

export function ToolLayoutComparison({
  title,
  updated,
  categories = [],
  breadcrumb = [],
  toc = [],
  calculator,
  fullWidthResults,
  children,
}: ToolLayoutComparisonProps) {
  return (
    <main className="tool-detail-page">
      <div className="tool-detail-inner">

        {/* Breadcrumb */}
        <nav className="tool-detail-breadcrumb">
          {breadcrumb.map((b, i) =>
            b.href ? (
              <Link key={i} href={b.href}>{b.label}</Link>
            ) : (
              <span key={i}>› {b.label}</span>
            )
          )}
        </nav>

        {/* Header */}
        <header className="tool-detail-header">
          <p className="tool-detail-updated">Updated: {updated}</p>
          <h1 className="tool-detail-title">{title}</h1>

          <div className="tool-detail-meta-row">
            {categories.map((c) => (
              <span key={c} className="tool-detail-chip">{c}</span>
            ))}
          </div>
        </header>

        {/* ===== TWO COLUMN GRID ===== */}
        <div className="comparison-grid">

          {/* LEFT — TOC */}
          <aside className="comparison-left">
            {toc.length > 0 && (
              <div className="comparison-toc-card">
                <h2>Table of contents</h2>
                <ul>
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`}>{t.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          {/* RIGHT — Calculator + Results + Content */}
          <section className="comparison-right">

            {/* Calculator */}
            <div className="comparison-calculator-card">
              {calculator}
            </div>

            {/* Results Section */}
            {fullWidthResults && (
              <div className="comparison-results">
                {fullWidthResults}
              </div>
            )}

            {/* Article / Explanation */}
            <article className="tool-detail-article">
              {children}
            </article>

          </section>
        </div>
      </div>
    </main>
  );
}