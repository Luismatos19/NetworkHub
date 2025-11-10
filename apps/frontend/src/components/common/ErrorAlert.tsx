'use client';

type ErrorAlertProps = {
  message?: string;
  onClose?: () => void;
  className?: string;
};

export default function ErrorAlert({
  message,
  onClose,
  className,
}: ErrorAlertProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start justify-between gap-4 ${
        className ?? ""
      }`}
    >
      <span>{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-red-700 hover:text-red-900 text-sm font-semibold"
        >
          Fechar
        </button>
      )}
    </div>
  );
}

