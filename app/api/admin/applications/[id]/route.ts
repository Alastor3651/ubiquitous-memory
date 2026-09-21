import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { noteSchema, statusSchema } from "@/lib/validations";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: {
      documents: true,
      notes: { orderBy: { createdAt: "desc" } },
      user: { select: { id: true, name: true, email: true, phone: true, createdAt: true } },
    },
  });

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  return NextResponse.json({ application });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const application = await prisma.application.findUnique({ where: { id: params.id } });
  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const results: Record<string, unknown> = {};

  if (body.status !== undefined) {
    const parsed = statusSchema.safeParse({ status: body.status });
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const updated = await prisma.application.update({
      where: { id: params.id },
      data: { status: parsed.data.status },
    });
    results.application = updated;
  }

  if (typeof body.note === "string" && body.note.trim().length > 0) {
    const parsed = noteSchema.safeParse({ content: body.note });
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
    }
    const note = await prisma.note.create({
      data: {
        applicationId: params.id,
        authorId: session.user.id,
        authorName: session.user.name || "Admin",
        content: parsed.data.content,
      },
    });
    results.note = note;
  }

  if (Object.keys(results).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  return NextResponse.json(results);
}
