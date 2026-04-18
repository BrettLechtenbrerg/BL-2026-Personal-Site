"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/utils";

const mastersEdgeDropdown = [
  { name: "The Methodology", href: "/masters-edge" },
  { name: "12-Week Program", href: "/masters-edge-program" },
];

const speakingDropdown = [
  { name: "Speaking Overview", href: "/speaking" },
  { name: "Book Brett", href: "/book-brett" },
  { name: "Media Kit", href: "/media-kit" },
];

const navigation = [
  { name: "The Master's Edge", href: "/masters-edge", hasDropdown: true, dropdownType: "mastersEdge" },
  { name: "Speaking", href: "/speaking", hasDropdown: true, dropdownType: "speaking" },
  { name: "Coaching", href: "/coaching" },
  { name: "AI Advisory", href: "/ai-advisory" },
  { name: "Books & Media", href: "/books" },
  { name: "Testimonials", href: "/testimonials" },
  { name: "About", href: "/about" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);

  const getDropdownItems = (type: string) => {
    if (type === "mastersEdge") return mastersEdgeDropdown;
    if (type === "speaking") return speakingDropdown;
    return [];
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <Image
                src="/logo.jpg"
                alt="Brett Lechtenberg"
                width={48}
                height={48}
                className="rounded-full"
                priority
              />
            </motion.div>
            <motion.span
              className="hidden sm:block text-xl font-bold text-black tracking-tight"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-cranberry">Brett</span> Lechtenberg
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {navigation.map((item) => (
              item.hasDropdown && item.dropdownType ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.dropdownType!)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-cranberry transition-colors"
                  >
                    {item.name}
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.dropdownType ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openDropdown === item.dropdownType && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                      >
                        {getDropdownItems(item.dropdownType).map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-cranberry/5 hover:text-cranberry transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-gray-700 hover:text-cranberry transition-colors"
                >
                  {item.name}
                </Link>
              )
            ))}
            <Button href={links.booking} external size="sm">
              Talk With Brett
            </Button>
          </div>

          {/* Mobile menu button - 48px touch target */}
          <button
            type="button"
            className="lg:hidden p-3 -mr-2 min-w-[48px] min-h-[48px] flex items-center justify-center text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-100"
          >
            <div className="px-4 py-4 space-y-1">
              {navigation.map((item) => (
                item.hasDropdown && item.dropdownType ? (
                  <div key={item.name}>
                    <button
                      onClick={() => setMobileOpenDropdown(mobileOpenDropdown === item.dropdownType ? null : item.dropdownType!)}
                      className="flex items-center justify-between w-full py-3 min-h-[48px] text-base font-medium text-gray-700 hover:text-cranberry transition-colors"
                    >
                      {item.name}
                      <ChevronDown className={`w-5 h-5 transition-transform ${mobileOpenDropdown === item.dropdownType ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {mobileOpenDropdown === item.dropdownType && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-4 space-y-1"
                        >
                          {getDropdownItems(item.dropdownType).map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block py-3 min-h-[44px] text-sm text-gray-600 hover:text-cranberry transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block py-3 min-h-[48px] text-base font-medium text-gray-700 hover:text-cranberry transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              <div className="pt-4">
                <Button href={links.booking} external className="w-full">
                  Talk With Brett
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
