"use client";

import Link from "next/link";

export default function IGFooter() {
  return (
    <footer className="mt-12 border-t border-gray-100 bg-gradient-to-br from-[#fdfdfe] via-white to-[#f5f7ff] text-gray-600">     <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col items-center gap-3 sm:gap-4 text-center">
        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
          <Link href="https://indiagraphs.com" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <Link href="https://indiagraphs.com/data-stories" className="hover:text-indigo-600 transition-colors">
            Data Stories
          </Link>
          <Link href="https://indiagraphs.com/contact" className="hover:text-indigo-600 transition-colors">
            Contact
          </Link>
        </div>

        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Indiagraphs.com — India’s Data Storytelling Platform
        </p>
      </div>
    </footer>
  );
}