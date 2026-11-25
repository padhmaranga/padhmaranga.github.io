"use client";

import { useState } from "react";
import { ExternalLink } from "@/components/ui";

export function DriveVideo({
  driveId,
  title,
}: {
  driveId: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const source = "https://drive.google.com/file/d/" + driveId;
  const playerId = "drive-video-" + driveId;

  return (
    <div className="drive-video">
      <div className="actions">
        <button
          type="button"
          className="action action-primary"
          aria-expanded={open}
          aria-controls={playerId}
          onClick={() => setOpen(!open)}
        >
          {open ? "Hide video" : "Load video"}
        </button>
        <ExternalLink href={source + "/view"}>
          Open in Google Drive
        </ExternalLink>
      </div>
      <div id={playerId} hidden={!open}>
        {open && (
          <iframe
            src={source + "/preview"}
            title={title}
            allow="encrypted-media; fullscreen"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}
