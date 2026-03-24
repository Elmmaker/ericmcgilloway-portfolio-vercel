"use client";

import { type ReactNode } from "react";
import { ContactProvider } from "./ContactContext";
import ContactModal from "./ContactModal";
import Navbar from "./Navbar";

export default function ClientShell({ children }: { children: ReactNode }) {
  return (
    <ContactProvider>
      <Navbar />
      <main className="relative z-2">{children}</main>
      <ContactModal />
    </ContactProvider>
  );
}
