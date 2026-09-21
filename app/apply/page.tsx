"use client";

import { useState, useEffect, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ApplyPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    amountRequested: "",
    purpose: "",
    additionalInfo: "",
  });

  // useSession() resolves asynchronously, so the session is usually not yet
  // available on first render. Prefill name/email once it loads, without
  // overwriting anything the user has already typed.
  useEffect(() => {
    if (!session?.user) return;
    setForm((f) => ({
      ...f,
      fullName: f.fullName || session.user.name || "",
      email: f.email || session.user.email || "",
    }));
  }, [session]);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [done, setDone] = useState<{ id: string } | null>(null);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not submit your application.");
        setSubmitting(false);
        return;
      }

      const applicationId = data.application.id;

      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          setUploadStatus(`Uploading document ${i + 1} of ${files.length}…`);
          const fd = new FormData();
          fd.append("file", files[i]);
          fd.append("applicationId", applicationId);
          const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
          if (!uploadRes.ok) {
            const uploadData = await uploadRes.json();
            setError(
              `Application submitted, but "${files[i].name}" failed to upload: ${
                uploadData.error || "unknown error"
              }. You can add it later from your dashboard.`
            );
          }
        }
      }

      setUploadStatus("");
      setDone({ id: applicationId });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="card">
          <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl">
            ✓
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Application submitted</h1>
          <p className="mt-2 text-sm text-gray-600">
            Your application has been received and is now <strong>Pending</strong> review. You
            can track its status any time from your dashboard.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <a href={`/applications/${done.id}`} className="btn-primary">
              View application
            </a>
            <a href="/dashboard" className="btn-secondary">
              Go to dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Funding application</h1>
      <p className="mt-1 text-sm text-gray-600">
        Fields marked with an asterisk are required. All information is stored securely.
      </p>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Full name *</label>
            <input
              className="input"
              required
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Email *</label>
            <input
              type="email"
              className="input"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Phone number *</label>
            <input
              type="tel"
              className="input"
              required
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Location (city, state/country) *</label>
            <input
              className="input"
              required
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label">Funding amount requested (USD) *</label>
          <input
            type="number"
            min="1"
            step="0.01"
            className="input"
            required
            value={form.amountRequested}
            onChange={(e) => update("amountRequested", e.target.value)}
          />
        </div>

        <div>
          <label className="label">Purpose of funding *</label>
          <textarea
            className="input"
            rows={4}
            required
            minLength={20}
            placeholder="Describe what the funding will be used for (at least 20 characters)."
            value={form.purpose}
            onChange={(e) => update("purpose", e.target.value)}
          />
        </div>

        <div>
          <label className="label">Additional information (optional)</label>
          <textarea
            className="input"
            rows={3}
            value={form.additionalInfo}
            onChange={(e) => update("additionalInfo", e.target.value)}
          />
        </div>

        <div>
          <label className="label">Supporting documents (optional)</label>
          <input
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
            className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
            onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])}
          />
          <p className="mt-1 text-xs text-gray-500">
            PDF, PNG, JPG, DOC or DOCX. Max 10MB per file.
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </p>
        )}
        {uploadStatus && <p className="text-sm text-gray-500">{uploadStatus}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Submitting…" : "Submit application"}
        </button>
      </form>
    </div>
  );
}
