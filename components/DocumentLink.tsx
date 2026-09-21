"use client";

import { useState } from "react";

export default function DocumentLink({
  documentId,
  fileName,
}: {
  documentId: string;
  fileName: string;
}) {
  const [loading, setLoading] = useState(false);

  async function open() {
    setLoading(true);
    try {
      const res = await fetch(`/api/documents/${documentId}`);
      const data = await res.json();
      if (res.ok && data.url) {
        window.open(data.url, "_blank", "noopener,noreferrer");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={open}
      disabled={loading}
      className="text-sm text-brand-600 hover:underline disabled:opacity-50"
    >
      📄 {fileName} {loading ? "…" : ""}
    </button>
  );
}
