import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { applicationSchema } from "@/lib/validations";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { documents: true },
  });

  return NextResponse.json({ applications });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = applicationSchema.safeParse({
      ...body,
      amountRequested: Number(body.amountRequested),
    });

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || "Invalid input";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: {
        userId: session.user.id,
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        location: parsed.data.location,
        amountRequested: parsed.data.amountRequested,
        purpose: parsed.data.purpose,
        additionalInfo: parsed.data.additionalInfo || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (err) {
    console.error("Application creation error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
