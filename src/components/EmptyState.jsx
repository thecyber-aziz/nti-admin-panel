import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "No data found",
  message = "There is no data available."
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Inbox size={30} />
      </div>

      <h3>{title}</h3>

      <p>{message}</p>
    </div>
  );
}