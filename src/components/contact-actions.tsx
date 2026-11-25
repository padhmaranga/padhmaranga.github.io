"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

export function CopyEmail({ email }: { email: string }) {
  const [message, setMessage] = useState("");
  return (
    <div>
      <button
        type="button"
        className="action action-outline"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(email);
            setMessage("Email copied.");
          } catch {
            setMessage("Copy the email address from the link above.");
          }
        }}
      >
        Copy email <Copy size={16} aria-hidden />
      </button>
      <p className="copy-status" role="status">
        {message}
      </p>
    </div>
  );
}
