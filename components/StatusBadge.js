export default function StatusBadge({ status }) {
  const styles = {
    requested: "bg-amber-100 text-amber-800 border-amber-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    in_progress: "bg-indigo-100 text-indigo-800 border-indigo-200",
    completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
    reviewed: "bg-teal-100 text-teal-800 border-teal-200",
    cancelled: "bg-gray-100 text-gray-600 border-gray-200",
    declined: "bg-red-100 text-red-800 border-red-200",
    disputed: "bg-purple-100 text-purple-800 border-purple-200",
    approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
    pending: "bg-amber-100 text-amber-800 border-amber-200",
  };

  const label = status
    ? status.replaceAll("_", " ").toUpperCase()
    : "UNKNOWN";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-800 border-gray-200"
      }`}
    >
      {label}
    </span>
  );
}