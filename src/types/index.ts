// ====================================
// PM Follow Trader - TypeScript 类型定义
// ====================================

/** 交易方向 */
export type TradeSide = "BUY" | "SELL";

/** 交易状态 */
export type TradeStatus = "PENDING" | "EXECUTED" | "FAILED" | "CANCELLED";

/** 监控状态 */
export type MonitorStatus = "RUNNING" | "STOPPED" | "ERROR";

/** 钱包监控状态 */
export type WalletStatus = "ACTIVE" | "PAUSED" | "INACTIVE";

/** 市场信息 */
export interface Market {
  id: string;
  question: string;
  slug: string;
  outcomes: string[];
  active: boolean;
  endDate: string;
  volume: number;
  liquidity: number;
}

/** 大户钱包 */
export interface TrackedWallet {
  id: string;
  address: string;
  label: string;
  status: WalletStatus;
  totalPnl: number;
  winRate: number;
  tradeCount: number;
  addedAt: string;
  lastActiveAt: string;
  tags: string[];
}

/** 大户交易（被监控到的） */
export interface WhaleTradeEvent {
  id: string;
  walletAddress: string;
  walletLabel: string;
  marketId: string;
  marketQuestion: string;
  tokenId: string;
  outcome: string;
  side: TradeSide;
  amount: number;
  price: number;
  timestamp: string;
}

/** 跟单交易记录 */
export interface FollowTrade {
  id: string;
  whaleTradeId: string;
  walletAddress: string;
  walletLabel: string;
  marketId: string;
  marketQuestion: string;
  outcome: string;
  side: TradeSide;
  /** 大户下单金额 */
  whaleAmount: number;
  /** 跟单金额 */
  followAmount: number;
  /** 执行价格 */
  executedPrice: number;
  /** 大户价格 */
  whalePrice: number;
  /** 滑点 */
  slippage: number;
  status: TradeStatus;
  pnl: number;
  createdAt: string;
  executedAt: string | null;
  error: string | null;
}

/** 跟单配置 */
export interface FollowConfig {
  /** 跟单比例 (0-1) */
  followRatio: number;
  /** 最大持仓金额 */
  maxPositionSize: number;
  /** 最大滑点容忍度 */
  slippageTolerance: number;
  /** 最小跟单金额 */
  minTradeAmount: number;
  /** 最大跟单金额 */
  maxTradeAmount: number;
  /** 是否自动执行 */
  autoExecute: boolean;
  /** 监控间隔 (ms) */
  monitorInterval: number;
}

/** 通知配置 */
export interface NotifyConfig {
  telegramEnabled: boolean;
  telegramBotToken: string;
  telegramChatId: string;
  discordEnabled: boolean;
  discordWebhookUrl: string;
  /** 通知事件类型 */
  events: {
    onWhaleTrade: boolean;
    onFollowExecuted: boolean;
    onFollowFailed: boolean;
    onPnlUpdate: boolean;
  };
}

/** 全局应用配置 */
export interface AppConfig {
  follow: FollowConfig;
  notify: NotifyConfig;
  wallets: TrackedWallet[];
}

/** Dashboard 统计数据 */
export interface DashboardStats {
  totalPnl: number;
  totalTrades: number;
  winRate: number;
  activeWallets: number;
  todayTrades: number;
  todayPnl: number;
  monitorStatus: MonitorStatus;
  uptime: string;
}

/** 通知消息 */
export interface Notification {
  id: string;
  type: "WHALE_TRADE" | "FOLLOW_EXECUTED" | "FOLLOW_FAILED" | "PNL_UPDATE" | "SYSTEM";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

/** API 响应 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
