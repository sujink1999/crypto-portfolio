export interface ArchNode {
  id: string;
  label: string;
  category: string;
  worked: boolean;
  x: number;
  y: number;
}

export interface ArchEdge {
  from: string;
  to: string;
  label?: string;
}

export interface ProjectArchitecture {
  projectId: string;
  nodes: ArchNode[];
  edges: ArchEdge[];
}

export const BEANS_ARCHITECTURE: ProjectArchitecture = {
  projectId: "beans",
  nodes: [
    { id: "figma", label: "Figma", category: "Design", worked: true, x: 10, y: 38 },
    { id: "react", label: "React", category: "Frontend", worked: true, x: 28, y: 38 },
    { id: "lambda", label: "AWS Lambda", category: "Backend", worked: true, x: 46, y: 38 },
    { id: "helius", label: "Helius", category: "Indexer", worked: true, x: 64, y: 38 },
    { id: "rust", label: "Rust Contracts", category: "On-chain", worked: false, x: 82, y: 38 },
    { id: "solana", label: "Solana", category: "L1 Chain", worked: false, x: 82, y: 72 },
    { id: "dynamodb", label: "DynamoDB", category: "Database", worked: true, x: 46, y: 72 },
  ],
  edges: [
    { from: "figma", to: "react", label: "Designs" },
    { from: "react", to: "lambda", label: "API" },
    { from: "lambda", to: "helius", label: "RPC" },
    { from: "helius", to: "rust", label: "Indexing" },
    { from: "solana", to: "rust", label: "Deployed" },
    { from: "lambda", to: "dynamodb", label: "Read/Write" },
  ],
};

export const CADDI_ARCHITECTURE: ProjectArchitecture = {
  projectId: "caddi",
  nodes: [
    { id: "figma", label: "Figma", category: "Design", worked: true, x: 10, y: 38 },
    { id: "react", label: "React", category: "Extension UI", worked: true, x: 28, y: 38 },
    { id: "background", label: "Service Worker", category: "Background Script", worked: true, x: 46, y: 38 },
    { id: "aggregator", label: "Aggregator", category: "Route Engine", worked: true, x: 64, y: 38 },
    { id: "bridges", label: "Bridge APIs", category: "Stargate / Across / Hop", worked: false, x: 82, y: 38 },
    { id: "lambda", label: "AWS Lambda", category: "Backend", worked: true, x: 46, y: 72 },
    { id: "dynamodb", label: "DynamoDB", category: "Database", worked: true, x: 64, y: 72 },
    { id: "rpc", label: "RPC Nodes", category: "Alchemy / Infura", worked: false, x: 82, y: 72 },
  ],
  edges: [
    { from: "figma", to: "react", label: "Designs" },
    { from: "react", to: "background", label: "Messages" },
    { from: "background", to: "aggregator", label: "Fetch Routes" },
    { from: "aggregator", to: "bridges", label: "Quotes" },
    { from: "background", to: "lambda", label: "API" },
    { from: "lambda", to: "dynamodb", label: "Read/Write" },
    { from: "aggregator", to: "rpc", label: "On-chain" },
  ],
};

export const MUDREX_ARCHITECTURE: ProjectArchitecture = {
  projectId: "mudrex",
  nodes: [
    { id: "figma", label: "Figma", category: "Design", worked: true, x: 10, y: 38 },
    { id: "rn", label: "React Native", category: "Mobile App", worked: true, x: 28, y: 38 },
    { id: "react", label: "React", category: "Web Dashboard", worked: true, x: 28, y: 72 },
    { id: "api", label: "REST API", category: "Backend", worked: false, x: 46, y: 38 },
    { id: "ws", label: "WebSocket", category: "Real-time Feeds", worked: false, x: 46, y: 72 },
    { id: "exchange", label: "Exchanges", category: "Binance / FTX", worked: false, x: 64, y: 38 },
    { id: "db", label: "PostgreSQL", category: "Database", worked: false, x: 64, y: 72 },
    { id: "redis", label: "Redis", category: "Cache", worked: false, x: 82, y: 55 },
  ],
  edges: [
    { from: "figma", to: "rn", label: "Designs" },
    { from: "figma", to: "react", label: "Designs" },
    { from: "rn", to: "api", label: "REST" },
    { from: "react", to: "api", label: "REST" },
    { from: "rn", to: "ws", label: "Prices" },
    { from: "api", to: "exchange", label: "Orders" },
    { from: "api", to: "db", label: "Read/Write" },
    { from: "api", to: "redis", label: "Cache" },
  ],
};

export const KEOM_ARCHITECTURE: ProjectArchitecture = {
  projectId: "keom",
  nodes: [
    { id: "figma", label: "Figma", category: "Design", worked: true, x: 10, y: 38 },
    { id: "react", label: "React", category: "Frontend", worked: true, x: 28, y: 38 },
    { id: "web3", label: "Web3.js", category: "SDK", worked: true, x: 46, y: 38 },
    { id: "solidity", label: "Solidity", category: "Smart Contracts", worked: false, x: 64, y: 38 },
    { id: "polygon", label: "Polygon", category: "L2 Chain", worked: false, x: 82, y: 38 },
    { id: "subgraph", label: "Subgraph", category: "Indexer", worked: false, x: 46, y: 72 },
    { id: "chainlink", label: "Chainlink", category: "Oracle", worked: false, x: 64, y: 72 },
  ],
  edges: [
    { from: "figma", to: "react", label: "Designs" },
    { from: "react", to: "web3", label: "Calls" },
    { from: "web3", to: "solidity", label: "Txns" },
    { from: "solidity", to: "polygon", label: "Deployed" },
    { from: "react", to: "subgraph", label: "Queries" },
    { from: "solidity", to: "chainlink", label: "Price Feeds" },
  ],
};
