import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE_BYTES } from "@/lib/validations";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const applicationId = formData.get("applicationId") as string | null;

  if (!file || !applicationId) {
    return NextResponse.json({ error: "Missing file or applicationId" }, { status: 400 });
  }

  // Ownership check: the application must belong to the requesting user
  // (or the requester must be an admin).
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { userId: true },
  });

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const isOwner = application.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Allowed: PDF, PNG, JPG, DOC, DOCX." },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: "File is too large. Max size is 10MB." }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${applicationId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Supabase upload error:", uploadError);
    return NextResponse.json({ error: "File upload failed. Please try again." }, { status: 500 });
  }

  // Bucket is private; store the path and generate signed URLs on demand
  // when the file needs to be viewed (see /api/documents/[id]).
  const document = await prisma.document.create({
    data: {
      applicationId,
      fileName: file.name,
      filePath,
      fileUrl: filePath, // resolved to a signed URL at read time
      fileType: file.type,
      fileSize: file.size,
    },
  });

  return NextResponse.json({ document }, { status: 201 });
}
