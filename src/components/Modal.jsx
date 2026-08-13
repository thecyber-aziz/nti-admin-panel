import { X } from "lucide-react";

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = "medium"
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={onClose}
    >
      <div
        className={`modal modal-${size}`}
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="modal-header">
          <h2>{title}</h2>

          <button
            className="modal-close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}