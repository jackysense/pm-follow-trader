// ====================================
// PM Follow Trader - 配置管理
// ====================================

import { AppConfig, FollowConfig, NotifyConfig, TrackedWallet } from "@/types";

/** 默认跟单配置 */
const defaultFollowConfig: FollowConfig = {
  followRatio: 0.1,
  maxPositionSize: 1000,
  slippageTolerance: 0.02,
  minTradeAmount: 10,
  maxTradeAmount: 500,
  autoExecute: false,
  monitorInterval: 5000,
};

/** 默认通知配置 */
const defaultNotifyConfig: NotifyConfig = {
  telegramEnabled: false,
  telegramBotToken: "",
  telegramChatId: "",
  discordEnabled: false,
  discordWebhookUrl: "",
  events: {
    onWhaleTrade: true,
    onFollowExecuted: true,
    onFollowFailed: true,
    onPnlUpdate: false,
  },
};

/** 示例监控钱包 */
const sampleWallets: TrackedWallet[] = [
  {
    id: "w1",
    address: "0x1234...abcd",
    label: "Whale Alpha",
    status: "ACTIVE",
    totalPnl: 15420.5,
    winRate: 0.72,
    tradeCount: 156,
    addedAt: "2024-12-01T00:00:00Z",
    lastActiveAt: "2025-02-08T18:30:00Z",
    tags: ["high-frequency", "large-cap"],
  },
  {
    id: "w2",
    address: "0x5678...efgh",
    label: "Smart Money Beta",
    status: "ACTIVE",
    totalPnl: 8930.2,
    winRate: 0.68,
    tradeCount: 89,
    addedAt: "2024-12-15T00:00:00Z",
    lastActiveAt: "2025-02-08T16:45:00Z",
    tags: ["political", "sports"],
  },
  {
    id: "w3",
    address: "0x9abc...ijkl",
    label: "Degen Trader Gamma",
    status: "PAUSED",
    totalPnl: -2150.8,
    winRate: 0.45,
    tradeCount: 234,
    addedAt: "2025-01-01T00:00:00Z",
    lastActiveAt: "2025-02-07T22:10:00Z",
    tags: ["degen", "high-risk"],
  },
  {
    id: "w4",
    address: "0xdef0...mnop",
    label: "Institutional Delta",
    status: "ACTIVE",
    totalPnl: 42680.0,
    winRate: 0.81,
    tradeCount: 67,
    addedAt: "2024-11-20T00:00:00Z",
    lastActiveAt: "2025-02-08T20:00:00Z",
    tags: ["institutional", "conservative"],
  },
];

/** 获取应用配置 */
export function getAppConfig(): AppConfig {
  return {
    follow: { ...defaultFollowConfig },
    notify: { ...defaultNotifyConfig },
    wallets: [...sampleWallets],
  };
}

/** 获取跟单配置 */
export function getFollowConfig(): FollowConfig {
  return { ...defaultFollowConfig };
}

/** 获取通知配置 */
export function getNotifyConfig(): NotifyConfig {
  return { ...defaultNotifyConfig };
}

/** 获取监控钱包列表 */
export function getTrackedWallets(): TrackedWallet[] {
  return [...sampleWallets];
}

/** 更新跟单配置 */
export function updateFollowConfig(config: Partial<FollowConfig>): FollowConfig {
  return { ...defaultFollowConfig, ...config };
}

/** 更新通知配置 */
export function updateNotifyConfig(config: Partial<NotifyConfig>): NotifyConfig {
  return { ...defaultNotifyConfig, ...config };
}

/** 添加监控钱包 */
export function addTrackedWallet(wallet: Omit<TrackedWallet, "id" | "addedAt" | "lastActiveAt" | "tradeCount" | "totalPnl" | "winRate">): TrackedWallet {
  return {
    ...wallet,
    id: `w${Date.now()}`,
    totalPnl: 0,
    winRate: 0,
    tradeCount: 0,
    addedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
  };
}
