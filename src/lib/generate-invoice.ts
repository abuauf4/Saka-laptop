import jsPDF from "jspdf";
import { type Transaction } from "@/lib/transaction-store";

/* ── Helpers ── */
function formatRupiah(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDateLong(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

function formatShortId(id: string): string {
  return `INV-${id.slice(-8).toUpperCase()}`;
}

/* ── Store info ── */
interface StoreInfo {
  namaToko: string;
  tagline: string;
  alamat: string;
  telepon: string;
  whatsapp: string;
}

/* ── Main: Generate Invoice PDF ── */
export function generateInvoice(
  tx: Transaction,
  store: StoreInfo
): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageW = 210;
  const pageH = 297;
  const ml = 18;       // margin left
  const mr = 18;       // margin right
  const contentW = pageW - ml - mr;
  const contentR = pageW - mr;  // right edge of content area
  let y = 0;

  // ─── Colors ───
  const cPrimary = [79, 70, 229];    // Indigo
  const cDark = [25, 25, 35];
  const cGray = [110, 110, 125];
  const cLightGray = [245, 245, 250];
  const cWhite = [255, 255, 255];
  const cAccent = [55, 48, 190];     // Darker indigo for footer

  const setFill = (c: number[]) => doc.setFillColor(c[0], c[1], c[2]);
  const setText = (c: number[]) => doc.setTextColor(c[0], c[1], c[2]);
  const setDraw = (c: number[]) => doc.setDrawColor(c[0], c[1], c[2]);

  // ═══════════════════════════════════════════════
  // HEADER BAR — full width indigo bar
  // ═══════════════════════════════════════════════
  setFill(cPrimary);
  doc.rect(0, 0, pageW, 40, "F");

  // Left: Store name + tagline
  setText(cWhite);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(store.namaToko, ml, 17);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(store.tagline, ml, 24);

  // Right: INVOICE label + ID + date
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", contentR, 16, { align: "right" });

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.text(formatShortId(tx.id), contentR, 23, { align: "right" });

  // Thin white separator line inside header
  doc.setLineWidth(0.2);
  setDraw(cWhite);
  doc.line(ml, 29, contentR, 29);

  // Date/time row
  doc.setFontSize(7.5);
  doc.text(
    `${formatDateLong(tx.createdAt)}  |  ${formatTime(tx.createdAt)} WIB`,
    contentR,
    35,
    { align: "right" }
  );

  y = 50;

  // ═══════════════════════════════════════════════
  // TWO-COLUMN: Store Info (left) & Customer Info (right)
  // ═══════════════════════════════════════════════
  const gap = 8;                         // gap between two columns
  const halfW = (contentW - gap) / 2;    // width of each column
  const col2X = ml + halfW + gap;        // x start of right column

  // — Left column: DARI —
  let yL = y;
  setText(cGray);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("DARI", ml, yL);
  yL += 5;

  setText(cDark);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(store.namaToko, ml, yL);
  yL += 5;

  setText(cGray);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  const addrLines = doc.splitTextToSize(store.alamat, halfW);
  doc.text(addrLines, ml, yL);
  yL += addrLines.length * 3.8;

  doc.text(`Telp: ${store.telepon}`, ml, yL);
  yL += 3.8;
  doc.text(`WA: wa.me/${store.whatsapp}`, ml, yL);
  yL += 3.8;

  // — Right column: KEPADA —
  let yR = y;
  setText(cGray);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("KEPADA", col2X, yR);
  yR += 5;

  setText(cDark);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(tx.customerName || "-", col2X, yR);
  yR += 5;

  setText(cGray);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");

  if (tx.customerPhone) {
    doc.text(`Telp: ${tx.customerPhone}`, col2X, yR);
    yR += 3.8;
  }

  if (tx.customerAddress) {
    const custAddrLines = doc.splitTextToSize(tx.customerAddress, halfW);
    doc.text(custAddrLines, col2X, yR);
    yR += custAddrLines.length * 3.8;
  }

  y = Math.max(yL, yR) + 10;

  // ═══════════════════════════════════════════════
  // TABLE: Item list
  // ═══════════════════════════════════════════════
  // Column definitions — precise widths that sum to contentW
  const colNo   = { x: ml,                w: 10  };  // 10mm
  const colProd = { x: ml + 10,           w: 62  };  // 62mm
  const colHrg  = { x: ml + 72,           w: 42  };  // 42mm
  const colQty  = { x: ml + 114,          w: 14  };  // 14mm
  const colSub  = { x: ml + 128,          w: contentW - 128 + ml - ml }; // remainder
  // Fix: recalc colSub properly
  const usedW = 10 + 62 + 42 + 14; // = 128
  const colSubW = contentW - usedW;  // = 210 - 18 - 18 - 128 = 46
  const colSub2 = { x: ml + usedW, w: colSubW };

  // ─── Table Header Row ───
  const thH = 9;  // table header height
  setFill(cPrimary);
  doc.roundedRect(ml, y, contentW, thH, 1, 1, "F");

  setText(cWhite);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");

  const thY = y + 6;  // text baseline inside header

  doc.text("NO", colNo.x + colNo.w / 2, thY, { align: "center" });
  doc.text("PRODUK", colProd.x + 3, thY);
  doc.text("HARGA SATUAN", colHrg.x + colHrg.w - 2, thY, { align: "right" });
  doc.text("QTY", colQty.x + colQty.w / 2, thY, { align: "center" });
  doc.text("SUBTOTAL", colSub2.x + colSub2.w - 2, thY, { align: "right" });

  y += thH + 1;

  // ─── Table Data Rows ───
  const rowH = 8;

  tx.items.forEach((item, i) => {
    // Alternate row background
    if (i % 2 === 0) {
      setFill(cLightGray);
      doc.rect(ml, y, contentW, rowH, "F");
    }

    const rowY = y + 5.5;  // text baseline

    setText(cDark);

    // No — centered
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`${i + 1}`, colNo.x + colNo.w / 2, rowY, { align: "center" });

    // Product name — left aligned with padding
    doc.setFont("helvetica", "bold");
    const nameLines = doc.splitTextToSize(item.productName, colProd.w - 6);
    doc.text(nameLines[0], colProd.x + 3, rowY);

    // Price — right aligned
    doc.setFont("helvetica", "normal");
    doc.text(formatRupiah(item.price), colHrg.x + colHrg.w - 2, rowY, { align: "right" });

    // Qty — centered
    doc.text(`${item.quantity}`, colQty.x + colQty.w / 2, rowY, { align: "center" });

    // Subtotal — right aligned, bold
    doc.setFont("helvetica", "bold");
    doc.text(formatRupiah(item.price * item.quantity), colSub2.x + colSub2.w - 2, rowY, { align: "right" });

    y += rowH;
  });

  // ─── Table bottom border ───
  y += 1;
  doc.setLineWidth(0.4);
  setDraw(cPrimary);
  doc.line(ml, y, contentR, y);
  y += 8;

  // ═══════════════════════════════════════════════
  // TOTAL + PAYMENT INFO
  // ═══════════════════════════════════════════════
  // Left side: Payment method & status
  setText(cGray);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text("Metode Pembayaran", ml, y);
  doc.setFont("helvetica", "bold");
  setText(cDark);
  doc.text(tx.paymentMethod, ml, y + 4.5);

  setText(cGray);
  doc.setFont("helvetica", "normal");
  doc.text("Status", ml, y + 11);
  doc.setFont("helvetica", "bold");
  setText(tx.status === "completed" ? [16, 185, 129] : cDark); // green if completed
  doc.text(tx.status === "completed" ? "LUNAS" : tx.status.toUpperCase(), ml, y + 15.5);

  // Right side: Total box
  const totalBoxW = 72;
  const totalBoxH = 16;
  const totalBoxX = contentR - totalBoxW;

  setFill(cPrimary);
  doc.roundedRect(totalBoxX, y - 2, totalBoxW, totalBoxH, 2, 2, "F");

  setText(cWhite);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL", totalBoxX + 6, y + 5);

  doc.setFontSize(12);
  doc.text(formatRupiah(tx.total), totalBoxX + totalBoxW - 5, y + 5.5, { align: "right" });

  // Subtle "Terima kasih" under total
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "italic");
  doc.text("Terima kasih atas kepercayaan Anda", totalBoxX + totalBoxW / 2, y + 11, { align: "center" });

  y += totalBoxH + 12;

  // ═══════════════════════════════════════════════
  // NOTES SECTION
  // ═══════════════════════════════════════════════
  const notePad = 5;
  setFill(cLightGray);
  doc.roundedRect(ml, y, contentW, 22, 1.5, 1.5, "F");

  setText(cGray);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("CATATAN", ml + notePad, y + 5.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text("1. Barang yang sudah dibeli tidak dapat dikembalikan kecuali ada kesepakatan tertulis.", ml + notePad, y + 10);
  doc.text("2. Garansi produk mengikuti ketentuan masing-masing brand.", ml + notePad, y + 14);
  doc.text("3. Simpan invoice ini sebagai bukti pembayaran yang sah.", ml + notePad, y + 18);

  y += 30;

  // ═══════════════════════════════════════════════
  // SIGNATURE
  // ═══════════════════════════════════════════════
  const sigW = 55;
  const sigX = contentR - sigW;

  setText(cGray);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text("Hormat kami,", sigX, y);

  y += 18;
  doc.setLineWidth(0.3);
  setDraw(cGray);
  doc.line(sigX, y, sigX + sigW, y);

  y += 4.5;
  setText(cDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(store.namaToko, sigX + sigW / 2, y, { align: "center" });

  // ═══════════════════════════════════════════════
  // FOOTER BAR
  // ═══════════════════════════════════════════════
  const footerH = 14;
  const footerY = pageH - footerH;

  setFill(cAccent);
  doc.rect(0, footerY, pageW, footerH, "F");

  setText(cWhite);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");

  const shortAddr = store.alamat.split(",").slice(0, 2).join(",").trim();
  doc.text(
    `${store.namaToko}  |  ${shortAddr}  |  ${store.telepon}`,
    pageW / 2,
    footerY + 5.5,
    { align: "center" }
  );
  doc.text(
    `Invoice ini dicetak secara otomatis oleh sistem ${store.namaToko}`,
    pageW / 2,
    footerY + 10,
    { align: "center" }
  );

  return doc;
}

/* ── Convenience: Generate and download ── */
export function downloadInvoice(tx: Transaction, store: StoreInfo): void {
  const doc = generateInvoice(tx, store);
  doc.save(`${formatShortId(tx.id)}.pdf`);
}
