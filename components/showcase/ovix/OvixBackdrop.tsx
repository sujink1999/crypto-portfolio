"use client";

import Header from "./Header";
import Footer from "./Footer";
import CountDashboard from "./CountDashboard";
import AssetMarketSection from "./AssetMarketSection";

// Ported from src/Home.tsx - sticky header, count/stat row, two-column
// supply/borrow market area, footer. Container classes are verbatim.
const OvixBackdrop = () => (
  <div className="flex flex-col items-center min-h-screen">
    <Header />
    <div className="w-full max-w-7xl flex gap-12 flex-col items-center flex-1 min-h-500 p-3 py-6">
      <CountDashboard />
      <div className="flex flex-col lg:flex-row w-full lg:items-start justify-between gap-4">
        <div className="flex flex-1 flex-col gap-8">
          <AssetMarketSection forBorrow={false} title="Supplied Assets" />
          <AssetMarketSection forBorrow={false} isMarket title="Supply Markets" />
        </div>
        <div className="flex flex-1 flex-col gap-8">
          <AssetMarketSection forBorrow title="Borrowed Assets" />
          <AssetMarketSection forBorrow isMarket title="Borrow Markets" />
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default OvixBackdrop;
