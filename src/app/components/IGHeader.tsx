"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";

type MenuItem = { label: string; url: string; children?: MenuItem[] };

function decodeHTMLEntities(str: string) {
  if (!str) return str;
  const el = document.createElement("textarea");
  el.innerHTML = str;
  return el.value;
}
function decodeMenu(items: MenuItem[]): MenuItem[] {
  return items.map(i => ({
    label: decodeHTMLEntities(i.label),
    url: i.url,
    children: i.children ? decodeMenu(i.children) : undefined,
  }));
}

export default function IGHeader() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [contactUrl, setContactUrl] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // Load menu
  useEffect(() => {
    try {
      const cached = localStorage.getItem("ig_menu");
      if (cached) {
        const data = JSON.parse(cached);
        setMenu(decodeMenu(data.menu || []));
        setContactUrl(data.contactUrl || "");
      }
    } catch {}

    fetch("https://indiagraphs.com/wp-json/indiagraphs/v1/navigation")
      .then(r => r.json())
      .then(data => {
        setMenu(decodeMenu(data.menu || []));
        setContactUrl(data.contactUrl || "");
        localStorage.setItem("ig_menu", JSON.stringify(data));
      })
      .catch(() => {});
  }, []);

  // Close mobile menu when navigating
  const handleNavigate = () => setMobileOpen(false);

  return (
    <header className="fixed top-0 left-0 w-full z-[100] bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3">
        {/* Logo */}
        <Link
  href="https://indiagraphs.com"
  className="flex items-center gap-2 focus:outline-none focus:ring-0"
  onClick={handleNavigate}
>
  <img
    src="/logo.webp"
    alt="Indiagraphs Logo"
    className="h-8 w-auto object-contain"
    style={{
      filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.08))",
    }}
  />
</Link>

        {/* --- Desktop Nav --- */}
        <nav className="hidden md:flex items-center gap-6 relative">
          {menu.map((item, idx) => (
            <div key={idx} className="group relative">
              <Link
                href={item.url}
                className="text-gray-700 font-medium hover:text-indigo-600 transition-colors flex items-center gap-1"
              >
                {item.label}
                {!!item.children?.length && (
                  <ChevronDown size={14} className="text-gray-400 group-hover:text-indigo-500" />
                )}
              </Link>

              {!!item.children?.length && (
                <div className="absolute left-0 mt-2 hidden group-hover:block bg-white/95 backdrop-blur-lg border border-gray-100 rounded-lg shadow-lg py-2 min-w-[220px] z-[9999]">
                  {item.children.map((sub, sidx) => (
                    <Link
                      key={sidx}
                      href={sub.url}
                      className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 text-sm"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Contact (Desktop) */}
        {!!contactUrl && (
          <a
            href={contactUrl}
            className="hidden md:inline-block bg-[#17153B] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors"
          >
            Contact
          </a>
        )}

        {/* --- Mobile Menu Button --- */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* --- Mobile Drawer --- */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-md animate-fadeIn">
          <nav className="flex flex-col py-4 px-5 space-y-2">
            {menu.map((item, idx) => (
              <div key={idx}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
                  className="w-full flex justify-between items-center text-gray-700 font-medium text-base py-2 hover:text-indigo-600"
                >
                  {item.label}
                  {!!item.children?.length && (
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        openDropdown === idx ? "rotate-180 text-indigo-600" : "text-gray-400"
                      }`}
                    />
                  )}
                </button>

                {/* Submenu */}
                {openDropdown === idx && item.children?.length && (
                  <div className="ml-3 border-l border-gray-200 pl-3 space-y-1 animate-fadeIn">
                    {item.children.map((sub, sidx) => (
                      <Link
                        key={sidx}
                        href={sub.url}
                        onClick={handleNavigate}
                        className="block text-sm text-gray-600 py-1 hover:text-indigo-600"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {!!contactUrl && (
              <a
                href={contactUrl}
                className="block mt-4 bg-[#17153B] text-white text-center text-sm font-semibold px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors"
              >
                Contact
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}