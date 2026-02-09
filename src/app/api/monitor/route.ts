import { NextResponse } from "next/server";
import { getDashboardStats, generateMockTradeHistory } from "@/lib/monitor";
import { ApiResponse, DashboardStats, WhaleTradeEvent } from "@/types";

/** GET /api/monitor - 获取监控状态和大户交易 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "status";

  if (type === "status") {
    const stats = getDashboardStats();
    return NextResponse.json<ApiResponse<DashboardStats>>({
      success: true,
      data: stats,
    });
  }

  if (type === "trades") {
    const limit = parseInt(searchParams.get("limit") || "20");
    const trades = generateMockTradeHistory(limit);
    return NextResponse.json<ApiResponse<WhaleTradeEvent[]>>({
      success: true,
      data: trades,
    });
  }

  return NextResponse.json<ApiResponse>({
    success: false,
    error: "Invalid type parameter. Use 'status' or 'trades'.",
  }, { status: 400 });
}

/** POST /api/monitor - 控制监控（启动/停止） */
export async function POST(request: Request) {
  const body = await request.json();
  const { action } = body;

  if (action === "start") {
    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Monitor started",
    });
  }

  if (action === "stop") {
    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Monitor stopped",
    });
  }

  return NextResponse.json<ApiResponse>({
    success: false,
    error: "Invalid action. Use 'start' or 'stop'.",
  }, { status: 400 });
}
