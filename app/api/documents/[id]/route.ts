import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const document = await prisma.document.findUnique({
    where: { id: params.id },
    include: { application: { select: { userId: true } } },
  });

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const isOwner = document.application.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(document.filePath, 60); // link valid for 60 seconds

  if (error || !data) {
    console.error("Signed URL error:", error);
    return NextResponse.json({ error: "Could not generate file link" }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl });
}
