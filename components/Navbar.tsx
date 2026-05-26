"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Menu, X, Phone, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand Name */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-accent p-2 rounded-lg text-white group-hover:scale-105 transition-all-300">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <span className="font-bold text-lg sm:text-xl tracking-tight block">أ. أبو الفتيان فهمي</span>
                <span className="text-xs text-accent-light block -mt-1 font-medium">مدرس التاريخ الوطني</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-accent font-medium transition-colors">الرئيسية</Link>
            <Link href="/exams" className="hover:text-accent font-medium transition-colors">الامتحانات المتاحة</Link>
            <Link href="/admin" className="hover:text-accent font-medium flex items-center gap-1 transition-colors">
              <ShieldCheck className="h-4 w-4" />
              لوحة المدرس
            </Link>
          </div>

          {/* Desktop Contact Call-to-action */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href="https://wa.me/201050074058" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg font-semibold transition-all-300 shadow-sm"
            >
              <Phone className="h-4 w-4" />
              <span>تواصل واتساب</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-primary-light focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-primary-dark border-t border-primary-light px-2 pt-2 pb-4 space-y-1">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md hover:bg-primary-light text-base font-medium"
          >
            الرئيسية
          </Link>
          <Link
            href="/exams"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md hover:bg-primary-light text-base font-medium"
          >
            الامتحانات المتاحة
          </Link>
          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md hover:bg-primary-light text-base font-medium flex items-center gap-2"
          >
            <ShieldCheck className="h-5 w-5" />
            لوحة المدرس
          </Link>
          <a
            href="https://wa.me/201050074058"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md bg-accent text-center font-bold text-white hover:bg-accent-dark transition-colors"
          >
            تواصل واتساب
          </a>
        </div>
      )}
    </nav>
  );
}
