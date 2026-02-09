import { NextResponse } from "next/server";
import { generateMockFollowTrades } from "@/lib/trader";
import { ApiResponse, FollowTrade } from "@/types";

/** GET /api/trades - 获取跟单交易记录 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "30");
  const status = searchParams.get("status");

  let trades = generateMockFollowTrades(limit);

  if (status && status !== "ALL") {
    trades = trades.filter((t) => t.status === status);
  }

  return NextResponse.json<ApiResponse<FollowTrade[]>>({
    success: true,
    data: trades,
  });
}

/** POST /api/trades - 手动执行跟单交易 */
export async function POST(request: Request) {
  const body = await request.json();
  const { whaleTradeId, amount } = body;

  if (!whaleTradeId) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "whaleTradeId is required",
    }, { status: 400 });
  }

  // 模拟执行
  const trade: FollowTrade = {
    id: `ft_manual_${Date.now()}`,
    whaleTradeId,
    walletAddress: "0x1234...abcd",
    walletLabel: "Manual Trade",
    marketId: "m1",
    marketQuestion: "Manual follow trade",
    outcome: "Yes",
    side: "BUY",
    whaleAmount: amount || 1000,
    followAmount: (amount || 1000) * 0.1,
    executedPrice: 0.65,
    whalePrice: 0.64,
    slippage: 0.0156,
    status: "EXECUTED",
    pnl: 0,
    createdAt: new Date().toISOString(),
    executedAt: new Date().toISOString(),
    error: null,
  };

  return NextResponse.json<ApiResponse<FollowTrade>>({
    success: true,
    data: trade,
    message: "Trade executed successfully",
  });
}
