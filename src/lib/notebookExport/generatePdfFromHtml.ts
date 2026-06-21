import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const A4_W_MM = 210;
const A4_H_MM = 297;
const CAPTURE_SCALE = 2;

export async function generatePdfFromHtml(
  container: HTMLElement,
  filename: string,
): Promise<void> {
  const pages = container.querySelectorAll<HTMLElement>("[data-nb-page]");
  if (pages.length === 0) {
    throw new Error("No hay páginas para exportar");
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const canvas = await html2canvas(page, {
      scale: CAPTURE_SCALE,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: page.offsetWidth,
      height: page.offsetHeight,
      windowWidth: page.scrollWidth,
      windowHeight: page.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, 0, A4_W_MM, A4_H_MM);
  }

  pdf.save(filename);
}
