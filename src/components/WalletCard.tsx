import { TrackedWallet } from "@/types";

interface WalletCardProps {
  wallet: TrackedWallet;
  onToggle?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export default function WalletCard({ wallet, onToggle, onRemove }: WalletCardProps) {
  const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
    ACTIVE: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
    PAUSED: { bg: "bg-yellow-500/10", text: "text-yellow-400", dot: "bg-yellow-400" },
    INACTIVE: { bg: "bg-gray-500/10", text: "text-gray-400", dot: "bg-gray-400" },
  };

  const style = statusStyles[wallet.status] || statusStyles.INACTIVE;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-bold text-lg">{wallet.label}</h3>
          <p className="text-gray-500 text-sm font-mono mt-1">{wallet.address}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot} ${wallet.status === "ACTIVE" ? "animate-pulse" : ""}`} />
          {wallet.status === "ACTIVE" ? "活跃" : wallet.status === "PAUSED" ? "已暂停" : "未激活"}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-gray-500 text-xs mb-1">总收益</p>
          <p className={`font-bold text-sm ${wallet.totalPnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {wallet.totalPnl >= 0 ? "+" : ""}${wallet.totalPnl.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-1">胜率</p>
          <p className="text-white font-bold text-sm">{(wallet.winRate * 100).toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-1">交易数</p>
          <p className="text-white font-bold text-sm">{wallet.tradeCount}</p>
        </div>
      </div>

      {/* Tags */}
      {wallet.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {wallet.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-lg bg-gray-700/50 text-gray-400 border border-gray-600/30"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Last Active */}
      <p className="text-gray-600 text-xs mb-4">
        最后活跃: {new Date(wallet.lastActiveAt).toLocaleString("zh-CN")}
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onToggle?.(wallet.id)}
          className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            wallet.status === "ACTIVE"
              ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/20"
              : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
          }`}
        >
          {wallet.status === "ACTIVE" ? "暂停" : "启动"}
        </button>
        <button
          onClick={() => onRemove?.(wallet.id)}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
        >
          移除
        </button>
      </div>
    </div>
  );
}
