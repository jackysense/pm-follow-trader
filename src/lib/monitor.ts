// ====================================
// PM Follow Trader - Polymarket 大户监控
// ====================================

import { WhaleTradeEvent, DashboardStats } from "@/types";

/** 模拟市场问题列表 */
const SAMPLE_MARKETS = [
  { id: "m1", question: "Will Bitcoin reach $150k by March 2025?", outcomes: ["Yes", "No"] },
  { id: "m2", question: "Will the Fed cut rates in Q1 2025?", outcomes: ["Yes", "No"] },
  { id: "m3", question: "Will ETH flip BTC market cap by 2026?", outcomes: ["Yes", "No"] },
  { id: "m4", question: "Next US President 2028 - Republican?", outcomes: ["Yes", "No"] },
  { id: "m5", question: "Will SpaceX land on Mars by 2030?", outcomes: ["Yes", "No"] },
  { id: "m6", question: "Super Bowl LIX Winner - Chiefs?", outcomes: ["Yes", "No"] },
  { id: "m7", question: "Will AI replace 50% of jobs by 2030?", outcomes: ["Yes", "No"] },
  { id: "m8", question: "Will gold hit $3000/oz in 2025?", outcomes: ["Yes", "No"] },
];

/** 模拟钱包标签 */
const SAMPLE_WALLETS = [
  { address: "0x1234...abcd", label: "Whale Alpha" },
  { address: "0x5678...efgh", label: "Smart Money Beta" },
  { address: "0xdef0...mnop", label: "Institutional Delta" },
];

/** 生成模拟大户交易 */
export function generateMockWhaleTrade(): WhaleTradeEvent {
  const market = SAMPLE_MARKETS[Math.floor(Math.random() * SAMPLE_MARKETS.length)];
  const wallet = SAMPLE_WALLETS[Math.floor(Math.random() * SAMPLE_WALLETS.length)];
  const side = Math.random() > 0.5 ? "BUY" : "SELL";
  const outcome = market.outcomes[Math.floor(Math.random() * market.outcomes.length)];
  const price = Math.round((0.1 + Math.random() * 0.8) * 100) / 100;
  const amount = Math.round(100 + Math.random() * 9900);

  return {
    id: `wt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    walletAddress: wallet.address,
    walletLabel: wallet.label,
    marketId: market.id,
    marketQuestion: market.question,
    tokenId: `token_${market.id}_${outcome.toLowerCase()}`,
    outcome,
    side: side as "BUY" | "SELL",
    amount,
    price,
    timestamp: new Date().toISOString(),
  };
}

/** 生成模拟交易历史 */
export function generateMockTradeHistory(count: number = 20): WhaleTradeEvent[] {
  const trades: WhaleTradeEvent[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const trade = generateMockWhaleTrade();
    trade.id = `wt_hist_${i}`;
    trade.timestamp = new Date(now - i * 3600000 * Math.random() * 24).toISOString();
    trades.push(trade);
  }

  return trades.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/** 获取 Dashboard 统计数据 */
export function getDashboardStats(): DashboardStats {
  return {
    totalPnl: 64879.9,
    totalTrades: 546,
    winRate: 0.694,
    activeWallets: 3,
    todayTrades: 12,
    todayPnl: 2340.5,
    monitorStatus: "RUNNING",
    uptime: "3d 14h 22m",
  };
}

/**
 * 启动监控（模拟）
 * 实际实现中会连接 Polymarket CLOB API / WebSocket
 */
export function startMonitor(
  _walletAddresses: string[],
  _onTrade: (trade: WhaleTradeEvent) => void,
  _intervalMs: number = 5000
): { stop: () => void } {
  // 实际实现：
  // 1. 连接 Polymarket CLOB API
  // 2. 订阅指定钱包的交易事件
  // 3. 使用 WebSocket 实时获取数据
  // 4. 过滤符合条件的交易
  // 5. 触发回调

  console.log("[Monitor] Started monitoring wallets (mock mode)");

  return {
    stop: () => {
      console.log("[Monitor] Stopped monitoring");
    },
  };
}
