"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";

type Application = {
  id: string;
  fullName: string;
  email: string;
  location: string;
  amountRequested: number;
  status: string;
  createdAt: string;
  _count: { documents: number; notes: number };
};

const STATUS_OPTIONS = ["", "PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"];

export default function AdminApplicationsTable() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (status) qs.set("status", status);
    if (search) qs.set("search", search);
    qs.set("page", String(page));

    const res = await fetch(`/api/admin/applications?${qs.toString()}`);
    const data = await res.json();
    if (res.ok) {
      setApplications(data.applications);
      setTotalPages(data.totalPages);
    }
    setLoading(false);
  }, [status, search, page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="card mt-6">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="label">Search</label>
          <input
            className="input"
            placeholder="Name, email, or location"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
        <div>
          <label className="label">Status</label>
          <select
            className="input"
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s ? s.replace("_", " ") : "All statuses"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-gray-400 border-b">
              <th className="py-2 pr-4">Applicant</th>
              <th className="py-2 pr-4">Location</th>
              <th className="py-2 pr-4">Amount</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Submitted</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-b last:border-0">
                <td className="py-3 pr-4">
                  <p className="font-medium text-gray-900">{app.fullName}</p>
                  <p className="text-xs text-gray-500">{app.email}</p>
                </td>
                <td className="py-3 pr-4">{app.location}</td>
                <td className="py-3 pr-4">${app.amountRequested.toLocaleString()}</td>
                <td className="py-3 pr-4">
                  <StatusBadge status={app.status} />
                </td>
                <td className="py-3 pr-4 text-gray-500">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 pr-4">
                  <Link href={`/admin/applications/${app.id}`} className="text-brand-600 hover:underline">
                    Review
                  </Link>
                </td>
              </tr>
            ))}
            {!loading && applications.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  No applications match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <button
          className="btn-secondary"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </button>
        <span className="text-gray-500">
          Page {page} of {totalPages}
        </span>
        <button
          className="btn-secondary"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
