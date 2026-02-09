"use client";

import { useState } from "react";
import WalletCard from "@/components/WalletCard";
import { getTrackedWallets, getFollowConfig } from "@/lib/config";
import { TrackedWallet, FollowConfig } from "@/types";

export default function SettingsPage() {
  const [wallets, setWallets] = useState<TrackedWallet[]>(getTrackedWallets());
  const [config, setConfig] = useState<FollowConfig>(getFollowConfig());
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [newWalletLabel, setNewWalletLabel] = useState("");
  const [activeTab, setActiveTab] = useState<"wallets" | "trading" | "notifications">("wallets");

  const handleToggleWallet = (id: string) => {
    setWallets((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, status: w.status === "ACTIVE" ? "PAUSED" : "ACTIVE" }
          : w
      )
    );
  };

  const handleRemoveWallet = (id: string) => {
    setWallets((prev) => prev.filter((w) => w.id !== id));
  };

  const handleAddWallet = () => {
    if (!newWalletAddress || !newWalletLabel) return;
    const newWallet: TrackedWallet = {
      id: `w${Date.now()}`,
      address: newWalletAddress,
      label: newWalletLabel,
      status: "ACTIVE",
      totalPnl: 0,
      winRate: 0,
      tradeCount: 0,
      addedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      tags: [],
    };
    setWallets((prev) => [...prev, newWallet]);
    setNewWalletAddress("");
    setNewWalletLabel("");
    setShowAddWallet(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">设置</h1>
        <p className="text-gray-400 mt-1">管理监控钱包和跟单参数</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800/50 border border-gray-700/50 rounded-xl p-1 w-fit">
        {([
          { key: "wallets", label: "监控钱包" },
          { key: "trading", label: "跟单参数" },
          { key: "notifications", label: "通知设置" },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-violet-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Wallets Tab */}
      {activeTab === "wallets" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">监控钱包 ({wallets.length})</h2>
            <button
              onClick={() => setShowAddWallet(!showAddWallet)}
              className="px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-500 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              添加钱包
            </button>
          </div>

          {/* Add Wallet Form */}
          {showAddWallet && (
            <div className="bg-gray-800/50 border border-violet-500/30 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">添加新钱包</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">钱包地址</label>
                  <input
                    type="text"
                    value={newWalletAddress}
                    onChange={(e) => setNewWalletAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">钱包标签</label>
                  <input
                    type="text"
                    value={newWalletLabel}
                    onChange={(e) => setNewWalletLabel(e.target.value)}
                    placeholder="例如: Whale Alpha"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAddWallet}
                  className="px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-500 transition-colors"
                >
                  确认添加
                </button>
                <button
                  onClick={() => setShowAddWallet(false)}
                  className="px-6 py-2.5 bg-gray-700/50 text-gray-400 rounded-xl text-sm font-medium hover:text-white hover:bg-gray-700 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          )}

          {/* Wallet Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wallets.map((wallet) => (
              <WalletCard
                key={wallet.id}
                wallet={wallet}
                onToggle={handleToggleWallet}
                onRemove={handleRemoveWallet}
              />
            ))}
          </div>
        </div>
      )}

      {/* Trading Config Tab */}
      {activeTab === "trading" && (
        <div className="max-w-2xl space-y-6">
          <h2 className="text-xl font-bold text-white">跟单参数配置</h2>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 space-y-6">
            {/* Follow Ratio */}
            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">跟单比例</span>
                <span className="text-sm text-violet-400 font-mono">{(config.followRatio * 100).toFixed(0)}%</span>
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={config.followRatio * 100}
                onChange={(e) => setConfig({ ...config, followRatio: parseInt(e.target.value) / 100 })}
                className="w-full accent-violet-500"
              />
              <p className="text-xs text-gray-500 mt-1">按大户交易金额的百分比进行跟单</p>
            </div>

            {/* Max Position */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">最大持仓金额 ($)</label>
              <input
                type="number"
                value={config.maxPositionSize}
                onChange={(e) => setConfig({ ...config, maxPositionSize: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
              />
            </div>

            {/* Min/Max Trade Amount */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">最小跟单金额 ($)</label>
                <input
                  type="number"
                  value={config.minTradeAmount}
                  onChange={(e) => setConfig({ ...config, minTradeAmount: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">最大跟单金额 ($)</label>
                <input
                  type="number"
                  value={config.maxTradeAmount}
                  onChange={(e) => setConfig({ ...config, maxTradeAmount: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
                />
              </div>
            </div>

            {/* Slippage */}
            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">最大滑点容忍度</span>
                <span className="text-sm text-violet-400 font-mono">{(config.slippageTolerance * 100).toFixed(1)}%</span>
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={config.slippageTolerance * 1000}
                onChange={(e) => setConfig({ ...config, slippageTolerance: parseInt(e.target.value) / 1000 })}
                className="w-full accent-violet-500"
              />
            </div>

            {/* Auto Execute */}
            <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-xl">
              <div>
                <p className="text-sm text-white font-medium">自动执行跟单</p>
                <p className="text-xs text-gray-500 mt-1">开启后将自动执行跟单交易，关闭则需手动确认</p>
              </div>
              <button
                onClick={() => setConfig({ ...config, autoExecute: !config.autoExecute })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  config.autoExecute ? "bg-violet-600" : "bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    config.autoExecute ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>

            {/* Monitor Interval */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">监控间隔 (毫秒)</label>
              <input
                type="number"
                value={config.monitorInterval}
                onChange={(e) => setConfig({ ...config, monitorInterval: parseInt(e.target.value) || 5000 })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
              />
              <p className="text-xs text-gray-500 mt-1">检查大户交易的时间间隔，建议 3000-10000ms</p>
            </div>

            {/* Save Button */}
            <button className="w-full px-6 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-500 transition-colors">
              保存配置
            </button>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="max-w-2xl space-y-6">
          <h2 className="text-xl font-bold text-white">通知设置</h2>

          {/* Telegram */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <span className="text-xl">✈️</span>
                </div>
                <div>
                  <h3 className="text-white font-medium">Telegram 通知</h3>
                  <p className="text-gray-500 text-xs">通过 Telegram Bot 接收通知</p>
                </div>
              </div>
              <button className="relative w-12 h-6 rounded-full transition-colors bg-gray-600">
                <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Bot Token</label>
                <input
                  type="password"
                  placeholder="输入 Telegram Bot Token"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Chat ID</label>
                <input
                  type="text"
                  placeholder="输入 Chat ID"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50"
                />
              </div>
            </div>
          </div>

          {/* Discord */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🎮</span>
                </div>
                <div>
                  <h3 className="text-white font-medium">Discord 通知</h3>
                  <p className="text-gray-500 text-xs">通过 Discord Webhook 接收通知</p>
                </div>
              </div>
              <button className="relative w-12 h-6 rounded-full transition-colors bg-gray-600">
                <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform" />
              </button>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Webhook URL</label>
              <input
                type="text"
                placeholder="https://discord.com/api/webhooks/..."
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50"
              />
            </div>
          </div>

          {/* Notification Events */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 space-y-4">
            <h3 className="text-white font-medium">通知事件</h3>
            {[
              { label: "大户交易检测", desc: "当监控钱包发生交易时通知", enabled: true },
              { label: "跟单执行成功", desc: "跟单交易成功执行时通知", enabled: true },
              { label: "跟单执行失败", desc: "跟单交易执行失败时通知", enabled: true },
              { label: "收益更新", desc: "定期推送收益统计报告", enabled: false },
            ].map((event) => (
              <div key={event.label} className="flex items-center justify-between p-3 bg-gray-900/30 rounded-xl">
                <div>
                  <p className="text-sm text-white">{event.label}</p>
                  <p className="text-xs text-gray-500">{event.desc}</p>
                </div>
                <button
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    event.enabled ? "bg-violet-600" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      event.enabled ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Save */}
          <button className="w-full px-6 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-500 transition-colors">
            保存通知设置
          </button>
        </div>
      )}
    </div>
  );
}
