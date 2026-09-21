"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";

type Note = {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
};

const STATUSES = ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"];

export default function AdminReviewPanel({
  applicationId,
  currentStatus,
  notes,
}: {
  applicationId: string;
  currentStatus: string;
  notes: Note[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function updateStatus(newStatus: string) {
    setSaving(true);
    setError("");
    const res = await fetch(`/api/admin/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Could not update status.");
      return;
    }
    setStatus(newStatus);
    router.refresh();
  }

  async function addNote() {
    if (!note.trim()) return;
    setSaving(true);
    setError("");
    const res = await fetch(`/api/admin/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Could not add note.");
      return;
    }
    setNote("");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="font-semibold text-gray-900">Status</h2>
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          <StatusBadge status={status} />
          <select
            className="input max-w-xs"
            value={status}
            disabled={saving}
            onChange={(e) => updateStatus(e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="card">
        <h2 className="font-semibold text-gray-900">Internal notes</h2>
        <p className="text-xs text-gray-500 mt-1">Visible to admins only, not to the applicant.</p>

        <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
          {notes.length === 0 && <p className="text-sm text-gray-400">No notes yet.</p>}
          {notes.map((n) => (
            <div key={n.id} className="border-l-2 border-gray-200 pl-3">
              <p className="text-sm text-gray-800">{n.content}</p>
              <p className="text-xs text-gray-400 mt-1">
                {n.authorName} · {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <textarea
            className="input"
            rows={2}
            placeholder="Add a note for the review team…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <button
          onClick={addNote}
          disabled={saving || !note.trim()}
          className="btn-primary mt-2"
        >
          Add note
        </button>
      </div>
    </div>
  );
}
