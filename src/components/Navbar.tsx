"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, siteConfig } from "@/data/site";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScrollY && currentScroll > 60) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setScrolled(currentScroll > 50);
      setLastScrollY(currentScroll <= 0 ? 0 : currentScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Doodle design tokens matching the warm paper theme
  const navBg = "bg-[#FAF8F5]/95 backdrop-blur-md shadow-sm border border-primary-green/20 rounded-[24px_12px_36px_18px]/[18px_36px_12px_24px]";
  const textColor = "text-neutral-dark";
  const logoColor = "text-primary-dark";
  const btnClass = "bg-accent text-white hover:bg-accent-dark border-2 border-accent-dark";

  const isHiddenPage = pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard') || pathname?.startsWith('/portal-belajar');
  if (isHiddenPage) {
    return null;
  }

  // RA Sahabat logo component
  const RASahabatLogo = () => (
    <div className="w-10 h-10 rounded-full border-2 border-primary-green flex-shrink-0 overflow-hidden bg-white shadow-xs">
      <img
        src="/images/logo.jpg"
        alt="Logo RA Sahabat"
        className="w-full h-full object-cover"
      />
    </div>
  );

  return (
    <>
      <header
        className={`fixed top-4 left-4 right-4 md:top-6 md:left-8 md:right-8 z-50 transition-all duration-300 ${
          hidden ? "-translate-y-24 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className={`max-w-7xl mx-auto px-5 md:px-8 py-3 flex items-center justify-between transition-all duration-300 ${navBg}`}>
          {/* Logo G-SEE with asymmetric border */}
          <Link href="/" className="flex items-center space-x-3 group">
            <RASahabatLogo />
            <div className="flex flex-col">
              <span className={`font-baloo text-xl font-bold leading-none tracking-wide ${logoColor} group-hover:text-primary-green transition-colors`}>
                {siteConfig.name}
              </span>
              <span className="text-[9px] text-neutral-gray tracking-wider uppercase font-bold leading-none mt-0.5">
                {siteConfig.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-extrabold transition-colors duration-200 relative ${
                    isActive ? "text-primary-green" : `${textColor} hover:text-primary-green`
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <svg className="absolute -bottom-1.5 left-0 w-full h-1 text-primary-green" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none">
                      <path d="M0,5 Q50,0 100,5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  )}
                </Link>
              );
            })}
            
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/ra_sahabat/"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs px-5 py-2.5 rounded-[15px_35px_15px_40px]/[40px_15px_35px_15px] font-extrabold transition-all duration-200 shadow-sm ${btnClass}`}
              >
                Instagram Kami
              </a>
            </div>
          </nav>

          {/* Hamburger Icon with organic style */}
          <button
            onClick={() => setMobileOpen(true)}
            className={`md:hidden p-2 rounded-[10px_6px_8px_6px] border-2 border-solid border-primary-green/40 text-neutral-dark hover:bg-soft-mint transition-colors`}
            aria-label="Buka menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* MOBILE MENU MODAL */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex md:hidden"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-neutral-dark/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            
            {/* Drawer with paper style background */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-[280px] h-full bg-[#FAF8F5] shadow-2xl z-10 flex flex-col border-r-2 border-dashed border-primary-green/30"
            >
              {/* Header Drawer */}
              <div className="flex items-center justify-between px-5 pt-6 pb-5 border-b-2 border-dashed border-soft-mint bg-soft-mint/10">
                <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center space-x-2">
                  <RASahabatLogo />
                  <div className="flex flex-col">
                    <span className="font-baloo text-lg font-bold leading-none tracking-wide text-primary-dark">
                      {siteConfig.name}
                    </span>
                    <span className="text-[8px] text-neutral-gray tracking-wider uppercase font-bold leading-none mt-0.5">
                      {siteConfig.tagline}
                    </span>
                  </div>
                </Link>
                <button 
                  onClick={() => setMobileOpen(false)}
                  className="p-2 bg-soft-mint/40 hover:bg-soft-mint rounded-full text-neutral-gray hover:text-neutral-dark transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Body Drawer with chalkboard-like grid overlay */}
              <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-1.5 relative">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(24,179,111,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(24,179,111,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none -z-10"></div>
                <p className="text-[9px] font-extrabold text-neutral-gray uppercase tracking-widest mb-3 px-3">Navigasi Utama</p>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-[12px_6px_10px_8px] text-sm font-bold transition-all duration-200 ${
                        isActive
                          ? "bg-primary-green text-white shadow-md border-2 border-primary-dark"
                          : "text-neutral-dark hover:bg-soft-mint hover:text-primary-green border border-transparent"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Footer Drawer */}
              <div className="p-4 mt-auto mb-2 border-t-2 border-dashed border-soft-mint">
                <div className="flex flex-col gap-2.5">
                  <a
                    href="https://www.instagram.com/ra_sahabat/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className={`block w-full text-center px-4 py-2.5 rounded-[15px_35px_15px_40px]/[40px_15px_35px_15px] font-extrabold transition-colors shadow-sm ${btnClass}`}
                  >
                    Instagram Kami
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
