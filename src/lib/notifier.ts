// ====================================
// PM Follow Trader - 通知系统
// ====================================

import { WhaleTradeEvent, FollowTrade, Notification } from "@/types";

/**
 * 发送 Telegram 通知（模拟）
 */
export async function sendTelegramNotification(
  _botToken: string,
  _chatId: string,
  message: string
): Promise<boolean> {
  console.log("[Notifier] Telegram:", message);
  // 实际实现：
  // const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  // await fetch(url, { method: 'POST', body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }) });
  return true;
}

/**
 * 发送 Discord 通知（模拟）
 */
export async function sendDiscordNotification(
  _webhookUrl: string,
  message: string
): Promise<boolean> {
  console.log("[Notifier] Discord:", message);
  // 实际实现：
  // await fetch(webhookUrl, { method: 'POST', body: JSON.stringify({ content: message }) });
  return true;
}

/**
 * 格式化大户交易通知
 */
export function formatWhaleTradeMessage(trade: WhaleTradeEvent): string {
  const emoji = trade.side === "BUY" ? "🟢" : "🔴";
  return [
    `${emoji} 大户交易检测`,
    `━━━━━━━━━━━━━━━`,
    `👤 ${trade.walletLabel}`,
    `📊 ${trade.marketQuestion}`,
    `💰 ${trade.side} ${trade.outcome} @ $${trade.price}`,
    `📦 数量: $${trade.amount.toLocaleString()}`,
    `🕐 ${new Date(trade.timestamp).toLocaleString()}`,
  ].join("\n");
}

/**
 * 格式化跟单交易通知
 */
export function formatFollowTradeMessage(trade: FollowTrade): string {
  const statusEmoji =
    trade.status === "EXECUTED" ? "✅" :
    trade.status === "FAILED" ? "❌" :
    "⏳";

  return [
    `${statusEmoji} 跟单交易 ${trade.status}`,
    `━━━━━━━━━━━━━━━`,
    `📊 ${trade.marketQuestion}`,
    `👤 跟随: ${trade.walletLabel}`,
    `💰 ${trade.side} ${trade.outcome}`,
    `📦 跟单金额: $${trade.followAmount.toLocaleString()}`,
    `💵 执行价格: $${trade.executedPrice}`,
    `📉 滑点: ${(trade.slippage * 100).toFixed(2)}%`,
    trade.pnl !== 0 ? `📈 PnL: $${trade.pnl.toFixed(2)}` : "",
    trade.error ? `⚠️ 错误: ${trade.error}` : "",
  ].filter(Boolean).join("\n");
}

/**
 * 生成模拟通知列表
 */
export function generateMockNotifications(count: number = 10): Notification[] {
  const notifications: Notification[] = [];
  const now = Date.now();
  const types: Notification["type"][] = [
    "WHALE_TRADE", "FOLLOW_EXECUTED", "FOLLOW_FAILED", "PNL_UPDATE", "SYSTEM"
  ];
  const titles: Record<Notification["type"], string> = {
    WHALE_TRADE: "🐋 大户交易检测",
    FOLLOW_EXECUTED: "✅ 跟单成功",
    FOLLOW_FAILED: "❌ 跟单失败",
    PNL_UPDATE: "📈 收益更新",
    SYSTEM: "⚙️ 系统通知",
  };
  const messages: Record<Notification["type"], string[]> = {
    WHALE_TRADE: [
      "Whale Alpha 买入 BTC $150k 预测 - $5,000",
      "Smart Money Beta 卖出 Fed降息预测 - $3,200",
      "Institutional Delta 买入 ETH翻转预测 - $8,000",
    ],
    FOLLOW_EXECUTED: [
      "跟单 Whale Alpha 成功 - 金额 $500",
      "跟单 Institutional Delta 成功 - 金额 $800",
    ],
    FOLLOW_FAILED: [
      "跟单失败 - 流动性不足",
      "跟单失败 - 超出最大持仓限制",
    ],
    PNL_UPDATE: [
      "今日收益: +$2,340.50",
      "本周收益: +$8,920.30",
    ],
    SYSTEM: [
      "监控服务已重启",
      "检测到新的高胜率钱包",
    ],
  };

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const msgs = messages[type];
    notifications.push({
      id: `n_${i}`,
      type,
      title: titles[type],
      message: msgs[Math.floor(Math.random() * msgs.length)],
      timestamp: new Date(now - i * 600000 - Math.random() * 3600000).toISOString(),
      read: i > 3,
    });
  }

  return notifications.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}
