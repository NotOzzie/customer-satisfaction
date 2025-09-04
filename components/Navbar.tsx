import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <header className="w-full bg-white sticky top-0 z-50">
      <nav className="mx-auto max-w-6xl px-7 py-4 flex items-center justify-between text-gray-700">
        <div className="flex flex-column items-center gap-3">
          <Link className="flex gap-4 items-center" href="/">
            <Image
              src="/assets/logo-cbn.png"
              alt="Logo"
              width={64}
              height={64}
            />
            <p className="font-semibold text-lg">Customer Satisfaction</p>
          </Link>
        </div>
        {/* Right side reserved for future nav items */}
        <div className="flex items-center gap-4" aria-hidden="true" />
      </nav>
    </header>
  );
}
