export function openOrDownloadPdf(pdfBlob, mode = "download", fileName = "document.pdf") {
  const blob = new Blob([pdfBlob], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);

  if (mode === "preview") {
    // Open in new tab
    const newTab = window.open(url, "_blank");

    if (newTab) {
      newTab.onload = () => {
        window.URL.revokeObjectURL(url); // cleanup when tab is loaded
      };
    }
  } else {
    // Download file
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // cleanup
    window.URL.revokeObjectURL(url);
  }
}
