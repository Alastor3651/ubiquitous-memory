import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminApplicationsTable from "@/components/AdminApplicationsTable";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [total, pending, underReview, approved, rejected] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({ where: { status: "PENDING" } }),
    prisma.application.count({ where: { status: "UNDER_REVIEW" } }),
    prisma.application.count({ where: { status: "APPROVED" } }),
    prisma.application.count({ where: { status: "REJECTED" } }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Admin dashboard</h1>
      <p className="text-sm text-gray-600 mt-1">Review and manage funding applications.</p>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Stat label="Total" value={total} />
        <Stat label="Pending" value={pending} accent="text-yellow-600" />
        <Stat label="Under review" value={underReview} accent="text-blue-600" />
        <Stat label="Approved" value={approved} accent="text-green-600" />
        <Stat label="Rejected" value={rejected} accent="text-red-600" />
      </div>

      <AdminApplicationsTable />
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="card">
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent || "text-gray-900"}`}>{value}</p>
    </div>
  );
}
