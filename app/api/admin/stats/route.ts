import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [total, pending, underReview, approved, rejected] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({ where: { status: "PENDING" } }),
    prisma.application.count({ where: { status: "UNDER_REVIEW" } }),
    prisma.application.count({ where: { status: "APPROVED" } }),
    prisma.application.count({ where: { status: "REJECTED" } }),
  ]);

  const totalRequestedAgg = await prisma.application.aggregate({
    _sum: { amountRequested: true },
  });

  return NextResponse.json({
    total,
    pending,
    underReview,
    approved,
    rejected,
    totalRequested: totalRequestedAgg._sum.amountRequested || 0,
  });
}
