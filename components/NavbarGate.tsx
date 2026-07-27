"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

/** The main portfolio navbar only belongs on the home page. */
export default function NavbarGate() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return <Navbar />;
}
