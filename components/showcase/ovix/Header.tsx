"use client";
/* eslint-disable @next/next/no-img-element */

import { OVIX_LOGO } from "./data";
import { MenuIcon } from "./icons";

const navClass = "hover:text-primary-purple transition-all cursor-pointer";

// Ported from src/Components/Header/Header.tsx - without the Polygon PoS
// pause banner. Sticky, translucent, backdrop-blurred bar.
const Header = () => (
  <>
    <div className="flex flex-col sticky top-0 z-10">
      <div className="flex justify-center w-screen py-3 bg-mobileHeader lg:bg-black/10 sticky top-0 z-10 lg:backdrop-blur-lg lg:border-b-px border-border/20">
        <div className="flex items-center w-full justify-between max-w-1400 py-1 px-3">
          <div className="flex gap-5">
            <img src={OVIX_LOGO} width={80} height={28} className="w-20" alt="0vix" />
            <div className="hidden lg:flex gap-8 items-center">
              <p className={navClass}>Governance</p>
              <p className={navClass}>Products</p>
            </div>
          </div>
          <div className="flex gap-1 sm:gap-2 lg:gap-3 items-center">
            <div className="bg-chip rounded-lg p-2 flex items-center gap-2 text-sm">
              <span className="h-4 w-4 rounded-full bg-purple" />
              <span className="hidden sm:inline">Polygon</span>
            </div>
            <div className="bg-chip rounded-lg p-[9px] text-sm">0x71C7…9F2b</div>
            <button className="bg-[#191F26] rounded-lg p-2 lg:hidden">
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default Header;
