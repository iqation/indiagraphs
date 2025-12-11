"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import LoginForm from "../login/LoginForm";
import RegisterForm from "../register/RegisterForm";
import { useRouter } from "next/navigation";
import { cookies } from "next/headers";

export default function IGHeader() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [loginModal, setLoginModal] = useState<any>(false);
  const [registerModal, setRegisterModal] = useState<any>(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUser, setIsUser] = useState<any>("");
  const [userToken, setUserToken] = useState<string | null>(null);

  const toggleMobile = () => setMobileOpen((p) => !p);
  const toggleDropdown = (key: string) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const mobileSections = [
    {
      key: "data",
      label: "Data",
      items: [
        ["All Datasets", "/#all-graphs"],
        ["Economy & Macro", "/category/economy"],
        ["Banking & Credit", "/category/banking"],
        ["Digital Payments", "/category/digital-payments"],
        ["Commodities", "/category/commodities"],
        ["Trade & Exports", "/category/trade"],
        ["Small Savings", "/category/small-savings"],
        ["Foreign Exchange", "/category/forex"],
        ["Social & Demographics", "/category/social"],
      ],
    },
    {
      key: "solutions",
      label: "Solutions",
      items: [
        ["API Access (Coming Soon)", "#"],
        ["Enterprise Data Delivery (Coming Soon)", "#"],
      ],
    },
    {
      key: "about",
      label: "About",
      items: [
        ["About Us", "/about"],
        ["Contact", "/contact"],
      ],
    },
    {
      key: "policy",
      label: "Policy",
      items: [
        ["Disclaimer", "/disclaimer"],
        ["Privacy Policy", "/privacy-policy"],
        ["Terms & Conditions", "/terms-conditions"],
      ],
    },
  ];
  function getCookie(name: any) {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";")[0];
    return null;
  }

  useEffect(() => {
    const token = getCookie("auth_token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    function updateLoginState() {
      const token = getCookie("auth_token");
      setIsLoggedIn(!!token);
    }

    document.addEventListener("user-logged-in", updateLoginState);

    return () =>
      document.removeEventListener("user-logged-in", updateLoginState);
  }, []);

  const openLoginModal = () => {
    setRegisterModal(false);
    setLoginModal(true);
  };

  const openRegisterModal = () => {
    setLoginModal(false); // hide login
    setRegisterModal(true); // show register
  };

  const closeLoginModal = () => setLoginModal(false);
  const closeRegisterModal = () => setRegisterModal(false);

  const handleClickAccount = () => {
    if (isLoggedIn) {
      router.push("/account/dashboard"); // ✅ use correct path
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm z-[100]">
      <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.webp" alt="Indiagraphs Logo" className="h-8 w-auto" />
        </Link>

        {/* ===================== DESKTOP NAV ===================== */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-slate-700">
          {/* Data */}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-indigo-600">
              Data <ChevronDown size={14} className="opacity-60" />
            </button>

            <div className="absolute left-0 top-full hidden group-hover:block bg-white border rounded-lg shadow-lg py-3 w-56">
              <Link
                href="/#all-graphs"
                className="block px-4 py-2 hover:bg-indigo-50 text-sm"
              >
                All Datasets
              </Link>
              <Link
                href="/category/economy"
                className="block px-4 py-2 hover:bg-indigo-50 text-sm"
              >
                Economy & Macro
              </Link>
              <Link
                href="/category/banking"
                className="block px-4 py-2 hover:bg-indigo-50 text-sm"
              >
                Banking & Credit
              </Link>
              <Link
                href="/category/digital-payments"
                className="block px-4 py-2 hover:bg-indigo-50 text-sm"
              >
                Digital Payments
              </Link>
              <Link
                href="/category/commodities"
                className="block px-4 py-2 hover:bg-indigo-50 text-sm"
              >
                Commodities
              </Link>
              <Link
                href="/category/trade"
                className="block px-4 py-2 hover:bg-indigo-50 text-sm"
              >
                Trade & Exports
              </Link>
              <Link
                href="/category/small-savings"
                className="block px-4 py-2 hover:bg-indigo-50 text-sm"
              >
                Small Savings
              </Link>
              <Link
                href="/category/forex"
                className="block px-4 py-2 hover:bg-indigo-50 text-sm"
              >
                Foreign Exchange
              </Link>
              <Link
                href="/category/social"
                className="block px-4 py-2 hover:bg-indigo-50 text-sm"
              >
                Social & Demographics
              </Link>
            </div>
          </div>

          {/* ❌ TOOLS — Removed Completely */}

          {/* Data Stories */}
          <Link href="/data-stories" className="hover:text-indigo-600">
            Data Stories
          </Link>

          {/* Data Tools */}
          <Link href="/tools" className="hover:text-indigo-600">
            Data Tools
          </Link>

          {/* Solutions */}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-indigo-600">
              Solutions <ChevronDown size={14} className="opacity-60" />
            </button>

            <div className="absolute left-0 top-full hidden group-hover:block bg-white border rounded-lg shadow-lg w-56 py-3">
              {/* API Access */}
              <Link
                href="#"
                className="block px-4 py-2 text-sm text-gray-500 cursor-not-allowed"
              >
                API Access (Coming Soon)
              </Link>

              {/* Enterprise Data Delivery — now disabled */}
              <Link
                href="#"
                className="block px-4 py-2 text-sm text-gray-500 cursor-not-allowed"
              >
                Enterprise Data Delivery (Coming Soon)
              </Link>
            </div>
          </div>

          {/* About */}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-indigo-600">
              About <ChevronDown size={14} className="opacity-60" />
            </button>

            <div className="absolute left-0 top-full hidden group-hover:block bg-white border rounded-lg shadow-lg w-48 py-3">
              <Link
                href="/about"
                className="block px-4 py-2 hover:bg-indigo-50 text-sm"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-2 hover:bg-indigo-50 text-sm"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Policy */}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-indigo-600">
              Policy <ChevronDown size={14} className="opacity-60" />
            </button>

            <div className="absolute left-0 top-full hidden group-hover:block bg-white border rounded-lg shadow-lg w-56 py-3">
              <Link
                href="/disclaimer"
                className="block px-4 py-2 hover:bg-indigo-50 text-sm"
              >
                Disclaimer
              </Link>
              <Link
                href="/privacy-policy"
                className="block px-4 py-2 hover:bg-indigo-50 text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-conditions"
                className="block px-4 py-2 hover:bg-indigo-50 text-sm"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
          {!isLoggedIn ? (
            <button onClick={openLoginModal} className="text-indigo-600">
              Login
            </button>
          ) : (
            <button
              onClick={handleClickAccount}
              className="flex items-center gap-2 text-indigo-600 bg-transparent border-0"
            >
              <img
                src="/assets/img/avatars/admin.svg"
                alt="user"
                className="h-7 w-7 rounded-full border"
              />
              Account
            </button>
          )}

          {/* CTA */}
          <Link
            href="/contact"
            className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition"
          >
            Contact Sales
          </Link>
        </nav>

        {/* ========== MOBILE MENU ICON ========== */}
        <button className="md:hidden p-2" onClick={toggleMobile}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {/* ===================== MOBILE MENU ===================== */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow-lg px-5 py-4 space-y-3 text-slate-700">
          {/* Render Data section first */}
          {mobileSections.length > 0 && (
            <>
              {/* Data (first) */}
              <div key={mobileSections[0].key}>
                <button
                  onClick={() => toggleDropdown(mobileSections[0].key)}
                  className="flex justify-between w-full py-2 font-medium"
                >
                  {mobileSections[0].label}
                  <ChevronDown
                    size={18}
                    className={`transition ${
                      openDropdown === mobileSections[0].key ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openDropdown === mobileSections[0].key && (
                  <div className="ml-3 mt-1 space-y-1 border-l border-gray-300 pl-3">
                    {mobileSections[0].items.map(([label, url]) => (
                      <Link
                        key={label}
                        href={url}
                        className="block py-1 text-sm hover:text-indigo-600"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Independent Data Stories link (aligned with other top-level items) */}
              <Link
                href="/data-stories"
                className="block py-2 font-medium hover:text-indigo-600"
              >
                Data Stories
              </Link>

              <Link
                href="/tools"
                className="block py-2 font-medium hover:text-indigo-600"
              >
                Data Tools
              </Link>

              {/* Render remaining sections */}
              {mobileSections.slice(1).map((section) => (
                <div key={section.key}>
                  <button
                    onClick={() => toggleDropdown(section.key)}
                    className="flex justify-between w-full py-2 font-medium"
                  >
                    {section.label}
                    <ChevronDown
                      size={18}
                      className={`transition ${
                        openDropdown === section.key ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openDropdown === section.key && (
                    <div className="ml-3 mt-1 space-y-1 border-l border-gray-300 pl-3">
                      {section.items.map(([label, url]) => (
                        <Link
                          key={label}
                          href={url}
                          className="block py-1 text-sm hover:text-indigo-600"
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {/* CTA */}
          <Link
            href="/contact"
            className="block w-full text-center bg-indigo-600 text-white rounded-full py-2 font-semibold mt-4"
          >
            Contact Sales
          </Link>

          <Link
            href="#"
            className="block w-full text-center bg-indigo-600 text-white rounded-full py-2 font-semibold mt-4"
          >
            Contact
          </Link>
        </div>
      )}
      <LoginForm
        loginModal={loginModal}
        setLoginModal={setLoginModal}
        openRegisterModal={openRegisterModal}
        closeLoginModal={closeLoginModal}
        // registerModal={registerModal}
        // setRegisterModal={setRegisterModal}
      />
      <RegisterForm
        registerModal={registerModal}
        setRegisterModal={setRegisterModal}
        setLoginModal={setLoginModal}
        closeRegisterModal={closeRegisterModal}
      />
    </header>
  );
}
