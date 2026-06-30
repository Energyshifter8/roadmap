"use client";

import type { ReactNode } from "react";
import ChatWidget from "./ChatWidget";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen bg-[#0f0f0f]">
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
