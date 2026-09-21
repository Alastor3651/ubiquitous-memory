import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/StatusBadge";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null; // middleware already redirects unauthenticated users

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { documents: true },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your applications</h1>
          <p className="text-sm text-gray-600 mt-1">
            Welcome back, {session.user.name}.
          </p>
        </div>
        <Link href="/apply" className="btn-primary">
          New application
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="card mt-8 text-center">
          <p className="text-gray-600">You haven&apos;t submitted an application yet.</p>
          <Link href="/apply" className="btn-primary mt-4 inline-flex">
            Start your first application
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {applications.map((app) => (
            <Link
              key={app.id}
              href={`/applications/${app.id}`}
              className="card block hover:ring-brand-300 transition"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-semibold text-gray-900">
                    ${app.amountRequested.toLocaleString()} requested
                  </p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">{app.purpose}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Submitted {new Date(app.createdAt).toLocaleDateString()} ·{" "}
                    {app.documents.length} document{app.documents.length === 1 ? "" : "s"}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
