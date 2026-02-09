import StatsCard from "@/components/StatsCard";
import TradeTable from "@/components/TradeTable";
import { getDashboardStats } from "@/lib/monitor";
import { generateMockFollowTrades } from "@/lib/trader";
import { generateMockNotifications } from "@/lib/notifier";

export default function DashboardPage() {
  const stats = getDashboardStats();
  const recentTrades = generateMockFollowTrades(8);
  const notifications = generateMockNotifications(5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Polymarket 大户跟单系统概览</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-sm font-medium">监控运行中</span>
          </div>
          <span className="text-gray-500 text-sm">运行时间: {stats.uptime}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="总收益"
          value={`$${stats.totalPnl.toLocaleString()}`}
          change="+12.5%"
          changeType="positive"
          subtitle="较上周"
          icon={
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="今日收益"
          value={`$${stats.todayPnl.toLocaleString()}`}
          change="+$340.50"
          changeType="positive"
          subtitle="今日 12 笔交易"
          icon={
            <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <StatsCard
          title="总交易数"
          value={stats.totalTrades.toString()}
          change="+24"
          changeType="positive"
          subtitle="过去 7 天"
          icon={
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <StatsCard
          title="胜率"
          value={`${(stats.winRate * 100).toFixed(1)}%`}
          change="+2.3%"
          changeType="positive"
          subtitle={`${stats.activeWallets} 个活跃钱包`}
          icon={
            <svg className="w-6 h-6 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Trades */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">最近跟单</h2>
            <a href="/trades" className="text-violet-400 text-sm hover:text-violet-300 transition-colors">
              查看全部 →
            </a>
          </div>
          <TradeTable trades={recentTrades} />
        </div>

        {/* Live Feed & Notifications */}
        <div className="space-y-6">
          {/* Notifications */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">实时通知</h2>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl divide-y divide-gray-700/30">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 hover:bg-gray-700/20 transition-colors ${
                    !notif.read ? "border-l-2 border-l-violet-500" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-sm font-medium text-white">{notif.title}</h4>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {new Date(notif.timestamp).toLocaleTimeString("zh-CN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">快速概览</h2>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">最大单笔收益</span>
                <span className="text-emerald-400 font-bold">+$1,240.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">最大单笔亏损</span>
                <span className="text-red-400 font-bold">-$380.50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">平均跟单金额</span>
                <span className="text-white font-bold">$435.20</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">平均滑点</span>
                <span className="text-yellow-400 font-bold">0.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">成功率</span>
                <span className="text-emerald-400 font-bold">89.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
