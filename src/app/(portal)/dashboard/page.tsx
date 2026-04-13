"use client";
import React from "react";

const TEST_DOCUMENT_ID = "7176f588-5a98-4990-a303-17d7ae7b253b";

function getFilenameFromDisposition(contentDisposition: string | null) {
  if (!contentDisposition) {
    return null;
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const asciiMatch = contentDisposition.match(/filename="([^"]+)"/i);
  return asciiMatch?.[1] ?? null;
}

export default function DashboardPage() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const file = form.get("myFile") as File | null;
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);
    fd.append("originalFilename", file.name);
    fd.append("contentType", file.type || "application/octet-stream");
    fd.append("size", String(file.size));

    const res = await fetch("/api/documents", {
      method: "POST",
      body: fd,
      credentials: "same-origin", // << include session cookies
    });

    if (res.ok) console.log("Document created");
    else {
      const body = await res.json();
      console.error("Upload failed:", body);
    }
  }

  async function handleDownload() {
    const response = await fetch(
      `/api/documents/${TEST_DOCUMENT_ID}/download`,
      {
        method: "GET",
        credentials: "same-origin",
      },
    );

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      console.error("Download failed:", body ?? response.statusText);
      return;
    }

    const blob = await response.blob();
    const href = window.URL.createObjectURL(blob);
    const filename =
      response.headers.get("X-Download-Filename") ||
      getFilenameFromDisposition(response.headers.get("Content-Disposition")) ||
      "document";

    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(href);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="file" name="myFile" />
        <button type="submit">Upload</button>
      </form>
      <button onClick={handleDownload}>Download</button>
    </>
  );
}
