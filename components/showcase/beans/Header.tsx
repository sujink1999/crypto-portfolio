// Ported from beans-ui src/components/Trade/Header.js + BitchyBean.js.
// Left: BitchyBean (HappyBean → AngryBean on hover with a speech board) and a
// "Wtf is beans?" chip. Right: a Connect button. Wallet logic is stubbed.

"use client";

import { useState } from "react";
import { AngryBeanSVG, BoardSVG, HappyBeanSVG } from "./svgs";
import styles from "./beans.module.css";

const BitchyBean = () => {
  const [show, setShow] = useState(false);
  return (
    <div
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      className="relative select-none cursor-pointer"
    >
      {!show ? (
        <HappyBeanSVG className="w-10 h-10" />
      ) : (
        <AngryBeanSVG className="w-10 h-10" />
      )}
      {show && (
        <div className="absolute right-3 translate-x-full bottom-0 translate-y-full w-full min-w-[200px] z-20">
          <BoardSVG className="w-full h-full top-0 left-0 right-0 bottom-0 absolute z-10" />
          <p className={`text-black text-sm text-center px-5 py-3 z-20 relative`}>
            Bro what the fuck, ape some magic beans.
          </p>
        </div>
      )}
    </div>
  );
};

const Header = () => {
  return (
    <div className="justify-between items-center relative flex mb-2 sm:mb-0">
      <div className="flex-1 items-center gap-2 hidden sm:flex">
        <BitchyBean />
        <div className={`bg-white px-2 border-2 border-black text-sm text-black ml-4 cursor-pointer hover:bg-black hover:text-white`}>
          Wtf is beans?
        </div>
      </div>

      <div className="flex-1 sm:hidden" />

      <div className="flex-1 justify-end flex h-[50px] items-center mr-1">
        <div className="text-black cursor-pointer px-3 py-2 bg-white border-2 border-black select-none hover:bg-black hover:text-white">
          <p className={`text-sm`}>Connect</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
