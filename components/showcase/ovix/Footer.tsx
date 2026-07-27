"use client";
/* eslint-disable @next/next/no-img-element */

import {
  OVIX_LOGO,
  POWERED_BY,
  TWITTER_ICON,
  DISCORD_ICON,
  TELEGRAM_ICON,
  SOCIALNET_ICON,
} from "./data";

// Ported from src/Components/shared/Footer.tsx.
const navClass = "hover:text-primary-purple cursor-pointer transition-all";

const Footer = () => (
  <div className="w-full flex flex-col gap-5 max-w-1400 px-3 py-4 mt-36">
    <div className="flex flex-col lg:flex-row gap-5 justify-between">
      <div className="flex flex-col gap-5 items-start">
        <img src={OVIX_LOGO} width={80} height={28} alt="" />
        <p className="text-xl">
          The core Polygon
          <br />
          <span className="text-purple">money market protocol</span>
        </p>
      </div>
      <div className="flex gap-8 flex-wrap">
        <div className="flex gap-3 flex-col">
          <p className={navClass}>Governance</p>
          <p className={navClass}>Research</p>
        </div>
        <div className="flex gap-3 flex-col">
          <p className={navClass}>Documentation</p>
          <p className={navClass}>Media Kit</p>
        </div>
        <div className="flex gap-3 flex-col">
          <p className={navClass}>News</p>
          <p className={navClass}>FAQ</p>
          <p className={navClass}>Careers</p>
        </div>
      </div>
    </div>
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2">
      <div className="flex flex-col-reverse lg:flex-row items-start lg:items-center gap-4">
        <img
          src={POWERED_BY}
          width={120}
          height={36}
          alt=""
          className="h-9 cursor-pointer hover:scale-105 transition-all duration-500"
        />
        <div className="flex">
          <span className="text-sm p-4 py-1 hover:text-purple cursor-pointer transition-all">
            Terms of Use
          </span>
          <div className="w-px bg-[#313D49]" />
          <span className="text-sm p-4 py-1 hover:text-purple cursor-pointer transition-all">
            Privacy policy
          </span>
          <div className="w-px bg-[#313D49]" />
          <span className="text-sm p-4 py-1 hover:text-purple cursor-pointer transition-all">
            Cookie policy
          </span>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center">
        <p className="text-sm">© 2023, 0VIX Protocol. All rights reserved</p>
        <div className="flex gap-5">
          <img src={TWITTER_ICON} width={20} height={20} alt="" className="h-5 w-5" />
          <img src={DISCORD_ICON} width={20} height={20} alt="" className="h-5 w-5" />
          <img src={TELEGRAM_ICON} width={20} height={20} alt="" className="h-5 w-5" />
          <img src={SOCIALNET_ICON} width={20} height={20} alt="" className="h-5 w-5" />
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
