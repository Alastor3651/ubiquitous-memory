const STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 ring-yellow-600/20",
  UNDER_REVIEW: "bg-blue-100 text-blue-800 ring-blue-600/20",
  APPROVED: "bg-green-100 text-green-800 ring-green-600/20",
  REJECTED: "bg-red-100 text-red-800 ring-red-600/20",
};

const LABELS: Record<string, string> = {
  PENDING: "Pending",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
        STYLES[status] || "bg-gray-100 text-gray-800 ring-gray-600/20"
      }`}
    >
      {LABELS[status] || status}
    </span>
  );
}
