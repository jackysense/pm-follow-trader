import { NextResponse } from "next/server";
import { getAppConfig, getFollowConfig, getTrackedWallets } from "@/lib/config";
import { ApiResponse, AppConfig, FollowConfig, TrackedWallet } from "@/types";

/** GET /api/config - 获取配置 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section");

  if (section === "follow") {
    return NextResponse.json<ApiResponse<FollowConfig>>({
      success: true,
      data: getFollowConfig(),
    });
  }

  if (section === "wallets") {
    return NextResponse.json<ApiResponse<TrackedWallet[]>>({
      success: true,
      data: getTrackedWallets(),
    });
  }

  return NextResponse.json<ApiResponse<AppConfig>>({
    success: true,
    data: getAppConfig(),
  });
}

/** PUT /api/config - 更新配置 */
export async function PUT(request: Request) {
  const body = await request.json();
  const { section, data } = body;

  if (!section || !data) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "section and data are required",
    }, { status: 400 });
  }

  // 模拟保存（实际实现中写入文件或数据库）
  return NextResponse.json<ApiResponse>({
    success: true,
    message: `Config section '${section}' updated successfully`,
  });
}

/** POST /api/config - 添加钱包 */
export async function POST(request: Request) {
  const body = await request.json();
  const { address, label, tags } = body;

  if (!address || !label) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "address and label are required",
    }, { status: 400 });
  }

  const newWallet: TrackedWallet = {
    id: `w${Date.now()}`,
    address,
    label,
    status: "ACTIVE",
    totalPnl: 0,
    winRate: 0,
    tradeCount: 0,
    addedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    tags: tags || [],
  };

  return NextResponse.json<ApiResponse<TrackedWallet>>({
    success: true,
    data: newWallet,
    message: "Wallet added successfully",
  });
}
