import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DocumentLink from "@/components/DocumentLink";
import AdminReviewPanel from "@/components/AdminReviewPanel";

export default async function AdminApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: {
      documents: true,
      notes: { orderBy: { createdAt: "desc" } },
      user: { select: { name: true, email: true, phone: true, createdAt: true } },
    },
  });

  if (!application) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{application.fullName}</h1>
          <p className="text-sm text-gray-500">
            Account holder: {application.user.name} ({application.user.email})
          </p>
        </div>

        <div className="card space-y-4">
          <Row label="Email" value={application.email} />
          <Row label="Phone" value={application.phone} />
          <Row label="Location" value={application.location} />
          <Row
            label="Amount requested"
            value={`$${application.amountRequested.toLocaleString()}`}
          />
          <Row label="Purpose" value={application.purpose} multiline />
          {application.additionalInfo && (
            <Row label="Additional information" value={application.additionalInfo} multiline />
          )}
          <Row label="Submitted" value={new Date(application.createdAt).toLocaleString()} />
        </div>

        <div className="card">
          <h2 className="font-semibold text-gray-900">Documents</h2>
          {application.documents.length === 0 ? (
            <p className="text-sm text-gray-500 mt-2">No documents uploaded.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {application.documents.map((doc) => (
                <li key={doc.id}>
                  <DocumentLink documentId={doc.id} fileName={doc.fileName} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <AdminReviewPanel
          applicationId={application.id}
          currentStatus={application.status}
          notes={application.notes.map((n) => ({
            id: n.id,
            authorName: n.authorName,
            content: n.content,
            createdAt: n.createdAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className={`mt-1 text-sm text-gray-900 ${multiline ? "whitespace-pre-wrap" : ""}`}>
        {value}
      </p>
    </div>
  );
}
