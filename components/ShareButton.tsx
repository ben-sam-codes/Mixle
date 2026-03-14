"use client";

import { useState } from "react";

interface Props {
  shareText: string;
}

export default function ShareButton({ shareText }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <button className="share-btn" onClick={handleShare}>
        📋 Copy Results to Share
      </button>
      {copied && <div className="copied-toast">Copied to clipboard!</div>}
    </>
  );
}
