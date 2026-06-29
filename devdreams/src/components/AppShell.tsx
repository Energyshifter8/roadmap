"use client";

import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen bg-[#0f0f0f]">{children}</main>
      <Footer />
    </>
  );
}
