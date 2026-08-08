import type { CompanyPitch } from "./types";

export const injectiveLabs: CompanyPitch = {
  slug: "injective-labs",
  company: "Injective Labs",
  greetName: "Injective",
  role: "Front-End Developer",
  accent: "#4D3DFF",
  accentFrom: "#9A90FF",
  story: [
    "Natively bridging **Ethereum, Cosmos, and Solana** is not a chain problem. It's a UX problem: making three ecosystems' wallets, tokens, and prices feel seamless on one screen.",
    "At Caddi I built that exact seam: a bridge aggregator routing **LiFi, DeBridge, and Stargate across 15 mainnets**, and the extension that put swap and bridge on every page of the web.",
    "I've also built high-performance lending and margin dApps, and a token launch platform on Solana that moved over **$100k an hour** in trades, all in production. Below, your JD mapped to that work.",
  ],
  requirements: [
    {
      label: "DeFi dApp frontends",
      need: "3+ years of professional experience in front-end development",
      proofs: ["keom", "beans", "mudrex"],
      claim:
        "6+ years of production frontends. At Keom I was primary author of the lending and margin dApps, TVL grown from $500k to $10M.",
      stackMatch: ["React", "TypeScript", "Next.js"],
    },
    {
      label: "Modern frontend stack",
      need: "Strong proficiency in Vue.js and its core principles, Nuxt.js and Tailwind CSS",
      proofs: ["vanta-os", "keom", "mudrex"],
      claim:
        "Building with React and React Native: six years in production, across DeFi wallets, extensions, and margin trading dApps.",
      stackMatch: ["React", "React Native", "Next.js 16", "Tailwind"],
    },
    {
      label: "Web3 depth",
      need: "Experience integrating crypto wallets and interacting with blockchain-based applications",
      proofs: ["caddi-lambda", "beans"],
      claim:
        "Caddi connected wallets and enabled bridging across 15 mainnets, from any site. Beans traded over $100k an hour on-chain.",
      stackMatch: ["MetaMask keyring", "Solana web3.js", "Anchor"],
    },
    {
      label: "Frontend testing",
      need: "Experience implementing and maintaining front-end testing frameworks",
      proofs: ["keom", "vanta-os"],
      claim:
        "6+ years of building apps with tests in the loop: Cypress e2e on DeFi dApps, bankrun simulations proving the on-chain program.",
      stackMatch: ["Cypress"],
    },
  ],
  closing: {
    line: "The chain makes bridging native. I'd like to make it feel that way on screen.",
    email: "lksujins@gmail.com",
    github: "https://github.com/sujink1999",
    resumeUrl: "/Sujin-K-Resume.pdf",
    whatsapp: "+91 7299603606",
  },
  unlisted: true,
  evidenceOverrides: {
    "caddi-lambda": {
      what: "Chrome extension that puts swap and bridge on any website: MetaMask keyring and Solana web3.js in one widget, with a route checker quoting 19+ liquidity sources against the host dApp's own price.",
      stack: ["Browser extension", "MetaMask keyring", "Solana web3.js", "LiFi / DeBridge / Stargate"],
      proofPoints: [
        "Bridge aggregator across 15 mainnets",
        "Route checker over 19+ liquidity sources",
      ],
    },
  },
};
