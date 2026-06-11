import { jsPDF } from "jspdf";

interface CertificateData {
  studentName: string;
  courseName: string;
  issuedDate: string;
  certificateId: string;
}

export function generateCertificatePDF(data: CertificateData): Buffer {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 297, 210, "F");

  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(2);
  doc.rect(10, 10, 277, 190);

  doc.setDrawColor(6, 182, 212);
  doc.setLineWidth(0.5);
  doc.rect(15, 15, 267, 180);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(36);
  doc.text("EduBridge", 148, 40, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(148, 163, 184);
  doc.text("Certificate of Completion", 148, 55, { align: "center" });

  doc.setFontSize(12);
  doc.text("This is to certify that", 148, 75, { align: "center" });

  doc.setFontSize(28);
  doc.setTextColor(6, 182, 212);
  doc.text(data.studentName, 148, 95, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(148, 163, 184);
  doc.text("has successfully completed the course", 148, 110, { align: "center" });

  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text(data.courseName, 148, 125, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text(`Issued on: ${data.issuedDate}`, 148, 150, { align: "center" });
  doc.text(`Certificate ID: ${data.certificateId}`, 148, 160, { align: "center" });

  return Buffer.from(doc.output("arraybuffer"));
}
