import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/StatusBadge";
import DocumentLink from "@/components/DocumentLink";

const STEPS = ["PENDING", "UNDER_REVIEW", "APPROVED"];

export default async function ApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: { documents: true },
  });

  if (!application) notFound();

  const isOwner = application.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) notFound();

  const isRejected = application.status === "REJECTED";
  const currentStepIndex = isRejected ? -1 : STEPS.indexOf(application.status);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Application details</h1>
        <StatusBadge status={application.status} />
      </div>

      {!isRejected && (
        <div className="card mt-6">
          <div className="flex items-center justify-between text-xs font-medium text-gray-500">
            {STEPS.map((step, i) => (
              <span key={step} className={i <= currentStepIndex ? "text-brand-600" : ""}>
                {step.replace("_", " ")}
              </span>
            ))}
          </div>
          <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-brand-500 transition-all"
              style={{
                width: `${((currentStepIndex + 1) / STEPS.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
      {isRejected && (
        <div className="card mt-6 border-l-4 border-red-400">
          <p className="text-sm text-gray-700">
            This application was reviewed and was not approved. Contact support if you have
            questions.
          </p>
        </div>
      )}

      <div className="card mt-6 space-y-4">
        <Row label="Full name" value={application.fullName} />
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
        <Row
          label="Submitted"
          value={new Date(application.createdAt).toLocaleString()}
        />
      </div>

      <div className="card mt-6">
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
