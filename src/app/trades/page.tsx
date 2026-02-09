"use client";

import { useState } from "react";
import TradeTable from "@/components/TradeTable";
import { generateMockFollowTrades } from "@/lib/trader";

type FilterStatus = "ALL" | "EXECUTED" | "FAILED" | "PENDING";

export default function TradesPage() {
  const allTrades = generateMockFollowTrades(30);
  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTrades = allTrades.filter((trade) => {
    const matchesStatus = filter === "ALL" || trade.status === filter;
    const matchesSearch =
      !searchQuery ||
      trade.walletLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trade.marketQuestion.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    ALL: allTrades.length,
    EXECUTED: allTrades.filter((t) => t.status === "EXECUTED").length,
    FAILED: allTrades.filter((t) => t.status === "FAILED").length,
    PENDING: allTrades.filter((t) => t.status === "PENDING").length,
  };

  const totalPnl = allTrades
    .filter((t) => t.status === "EXECUTED")
    .reduce((sum, t) => sum + t.pnl, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">交易记录</h1>
        <p className="text-gray-400 mt-1">查看所有跟单交易详情</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <p className="text-gray-400 text-sm">总交易</p>
          <p className="text-2xl font-bold text-white">{allTrades.length}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <p className="text-gray-400 text-sm">已执行</p>
          <p className="text-2xl font-bold text-emerald-400">{statusCounts.EXECUTED}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <p className="text-gray-400 text-sm">失败</p>
          <p className="text-2xl font-bold text-red-400">{statusCounts.FAILED}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <p className="text-gray-400 text-sm">总 PnL</p>
          <p className={`text-2xl font-bold ${totalPnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          {(["ALL", "EXECUTED", "FAILED", "PENDING"] as FilterStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-violet-600 text-white"
                  : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 border border-gray-700/50"
              }`}
            >
              {status === "ALL" ? "全部" : status} ({statusCounts[status]})
            </button>
          ))}
        </div>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="搜索市场或钱包..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 w-64"
          />
        </div>
      </div>

      {/* Trade Table */}
      <TradeTable trades={filteredTrades} showPagination />
    </div>
  );
}
