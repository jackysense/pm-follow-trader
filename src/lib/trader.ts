// ====================================
// PM Follow Trader - 跟单交易执行
// ====================================

import { WhaleTradeEvent, FollowTrade, FollowConfig } from "@/types";

/**
 * 计算跟单金额
 */
export function calculateFollowAmount(
  whaleAmount: number,
  config: FollowConfig
): number {
  const rawAmount = whaleAmount * config.followRatio;
  const clampedAmount = Math.min(
    Math.max(rawAmount, config.minTradeAmount),
    config.maxTradeAmount
  );
  return Math.min(clampedAmount, config.maxPositionSize);
}

/**
 * 模拟执行跟单交易
 * 实际实现中会调用 Polymarket CLOB API 下单
 */
export function executeFollowTrade(
  whaleTrade: WhaleTradeEvent,
  config: FollowConfig
): FollowTrade {
  const followAmount = calculateFollowAmount(whaleTrade.amount, config);

  // 模拟滑点 (-1% ~ +2%)
  const slippage = (Math.random() * 0.03 - 0.01);
  const executedPrice = Math.round((whaleTrade.price * (1 + slippage)) * 1000) / 1000;

  // 模拟成功率 (~90%)
  const isSuccess = Math.random() > 0.1;

  // 模拟 PnL
  const pnl = isSuccess
    ? Math.round((Math.random() * 200 - 50) * 100) / 100
    : 0;

  return {
    id: `ft_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    whaleTradeId: whaleTrade.id,
    walletAddress: whaleTrade.walletAddress,
    walletLabel: whaleTrade.walletLabel,
    marketId: whaleTrade.marketId,
    marketQuestion: whaleTrade.marketQuestion,
    outcome: whaleTrade.outcome,
    side: whaleTrade.side,
    whaleAmount: whaleTrade.amount,
    followAmount,
    executedPrice,
    whalePrice: whaleTrade.price,
    slippage: Math.round(slippage * 10000) / 10000,
    status: isSuccess ? "EXECUTED" : "FAILED",
    pnl,
    createdAt: new Date().toISOString(),
    executedAt: isSuccess ? new Date().toISOString() : null,
    error: isSuccess ? null : "Insufficient liquidity",
  };
}

/**
 * 生成模拟跟单交易历史
 */
export function generateMockFollowTrades(count: number = 30): FollowTrade[] {
  const trades: FollowTrade[] = [];
  const markets = [
    "Will Bitcoin reach $150k by March 2025?",
    "Will the Fed cut rates in Q1 2025?",
    "Will ETH flip BTC market cap by 2026?",
    "Next US President 2028 - Republican?",
    "Will SpaceX land on Mars by 2030?",
    "Super Bowl LIX Winner - Chiefs?",
    "Will AI replace 50% of jobs by 2030?",
    "Will gold hit $3000/oz in 2025?",
  ];
  const wallets = [
    { address: "0x1234...abcd", label: "Whale Alpha" },
    { address: "0x5678...efgh", label: "Smart Money Beta" },
    { address: "0xdef0...mnop", label: "Institutional Delta" },
  ];
  const statuses: Array<"EXECUTED" | "FAILED" | "PENDING"> = ["EXECUTED", "EXECUTED", "EXECUTED", "EXECUTED", "FAILED", "PENDING"];

  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const wallet = wallets[Math.floor(Math.random() * wallets.length)];
    const market = markets[Math.floor(Math.random() * markets.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const side = Math.random() > 0.5 ? "BUY" : "SELL";
    const whalePrice = Math.round((0.15 + Math.random() * 0.7) * 100) / 100;
    const slippage = Math.round((Math.random() * 0.04 - 0.01) * 10000) / 10000;
    const whaleAmount = Math.round(500 + Math.random() * 9500);
    const followAmount = Math.round(whaleAmount * 0.1);

    trades.push({
      id: `ft_hist_${i}`,
      whaleTradeId: `wt_hist_${i}`,
      walletAddress: wallet.address,
      walletLabel: wallet.label,
      marketId: `m${Math.floor(Math.random() * 8) + 1}`,
      marketQuestion: market,
      outcome: Math.random() > 0.5 ? "Yes" : "No",
      side: side as "BUY" | "SELL",
      whaleAmount,
      followAmount,
      executedPrice: Math.round(whalePrice * (1 + slippage) * 100) / 100,
      whalePrice,
      slippage,
      status,
      pnl: status === "EXECUTED" ? Math.round((Math.random() * 300 - 80) * 100) / 100 : 0,
      createdAt: new Date(now - i * 1800000 - Math.random() * 3600000).toISOString(),
      executedAt: status === "EXECUTED" ? new Date(now - i * 1800000).toISOString() : null,
      error: status === "FAILED" ? "Insufficient liquidity" : null,
    });
  }

  return trades.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
