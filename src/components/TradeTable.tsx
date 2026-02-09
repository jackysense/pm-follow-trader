import { FollowTrade } from "@/types";

interface TradeTableProps {
  trades: FollowTrade[];
  showPagination?: boolean;
}

export default function TradeTable({ trades, showPagination = false }: TradeTableProps) {
  const statusStyles: Record<string, string> = {
    EXECUTED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    FAILED: "bg-red-500/10 text-red-400 border-red-500/20",
    PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    CANCELLED: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700/50">
              <th className="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">时间</th>
              <th className="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">跟随钱包</th>
              <th className="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">市场</th>
              <th className="text-left px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">方向</th>
              <th className="text-right px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">金额</th>
              <th className="text-right px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">价格</th>
              <th className="text-right px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">PnL</th>
              <th className="text-center px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/30">
            {trades.map((trade) => (
              <tr key={trade.id} className="hover:bg-gray-700/20 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                  {new Date(trade.createdAt).toLocaleString("zh-CN", {
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-white font-medium">{trade.walletLabel}</div>
                  <div className="text-xs text-gray-500">{trade.walletAddress}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                  {trade.marketQuestion}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                    trade.side === "BUY" ? "text-emerald-400" : "text-red-400"
                  }`}>
                    {trade.side === "BUY" ? "🟢" : "🔴"}
                    {trade.side} {trade.outcome}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="text-sm text-white font-medium">${trade.followAmount.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">大户: ${trade.whaleAmount.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="text-sm text-white">${trade.executedPrice}</div>
                  <div className="text-xs text-gray-500">
                    滑点: {(trade.slippage * 100).toFixed(2)}%
                  </div>
                </td>
                <td className={`px-6 py-4 text-right text-sm font-medium ${
                  trade.pnl > 0
                    ? "text-emerald-400"
                    : trade.pnl < 0
                    ? "text-red-400"
                    : "text-gray-400"
                }`}>
                  {trade.pnl > 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[trade.status]}`}>
                    {trade.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="px-6 py-4 border-t border-gray-700/50 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            显示 {trades.length} 条记录
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm text-gray-400 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
              上一页
            </button>
            <button className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-500 transition-colors">
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
