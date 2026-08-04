import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        client: true,
        worker: true,
        terms: true,
        contracts: true,
      }
    })

    if (!project) {
      return new NextResponse("Project document not found", { status: 404 })
    }

    const terms = project.terms
    const contract = project.contracts[0]
    const priceFormatted = terms?.priceFinal
      ? `Rp ${Number(terms.priceFinal).toLocaleString("id-ID")}`
      : "Rp " + Number(project.offeredPrice || 0).toLocaleString("id-ID")

    const dpAmount = terms?.priceFinal
      ? `Rp ${(Number(terms.priceFinal) * 0.5).toLocaleString("id-ID")}`
      : "Rp " + (Number(project.offeredPrice || 0) * 0.5).toLocaleString("id-ID")

    const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Perjanjian Kontrak & Terms - ${project.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      background: #f8fafc;
      margin: 0;
      padding: 40px 20px;
    }
    .contract-container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 48px;
      border-radius: 16px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
      border: 1px solid #e2e8f0;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #6366f1;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .logo {
      font-size: 24px;
      font-weight: 800;
      color: #4f46e5;
    }
    .doc-title {
      text-align: right;
    }
    .doc-title h1 {
      margin: 0;
      font-size: 20px;
      color: #0f172a;
    }
    .doc-title p {
      margin: 4px 0 0;
      font-size: 12px;
      color: #64748b;
    }
    .section {
      margin-bottom: 28px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #4f46e5;
      margin-bottom: 12px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    .info-card {
      background: #f8fafc;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #f1f5f9;
    }
    .info-card label {
      display: block;
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .info-card p {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
    }
    .scope-box {
      background: #faf5ff;
      border: 1px solid #e9d5ff;
      padding: 20px;
      border-radius: 12px;
      white-space: pre-wrap;
      font-size: 13px;
      line-height: 1.6;
      color: #3b0764;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
    }
    .table th, .table td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
      font-size: 13px;
    }
    .table th {
      background: #f1f5f9;
      color: #475569;
      font-weight: 700;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
    }
    .badge-approved { background: #dcfce7; color: #166534; }
    .badge-pending { background: #fef3c7; color: #92400e; }
    .print-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #4f46e5;
      color: #ffffff;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 700;
      border: none;
      cursor: pointer;
      box-shadow: 0 10px 20px rgba(79, 70, 229, 0.3);
    }
    @media print {
      body { background: #ffffff; padding: 0; }
      .contract-container { border: none; box-shadow: none; padding: 0; }
      .print-btn { display: none; }
    }
  </style>
</head>
<body>

  <button class="print-btn" onclick="window.print()">🖨️ Cetak / Simpan PDF</button>

  <div class="contract-container">
    <div class="header">
      <div class="logo">CRAVE ITSM</div>
      <div class="doc-title">
        <h1>SURAT PERJANJIAN & KONTRAK KERJA</h1>
        <p>No. Dokumen: CONTRACT-${project.id.substring(0, 8).toUpperCase()}</p>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Informasi Proyek & Para Pihak</div>
      <div class="grid-2">
        <div class="info-card">
          <label>Nama Proyek</label>
          <p>${project.title}</p>
        </div>
        <div class="info-card">
          <label>Klien</label>
          <p>${project.client?.name || "Klien Crave"} (${project.client?.email || "-"})</p>
        </div>
        <div class="info-card">
          <label>Penyedia Layanan (Admin)</label>
          <p>Crave Center Management</p>
        </div>
        <div class="info-card">
          <label>Pelaksana Proyek (Worker)</label>
          <p>${project.worker?.name || "Tim Pengembang Crave"}</p>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Lingkup Pekerjaan (Scope of Work)</div>
      <div class="scope-box">${terms?.scope || project.description || "Ketentuan pekerjaan disesuaikan dengan brief kebutuhan proyek."}</div>
    </div>

    <div class="section">
      <div class="section-title">Skema Biaya & Pembayaran</div>
      <table class="table">
        <thead>
          <tr>
            <th>Komponen</th>
            <th>Ketentuan</th>
            <th>Jumlah</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Nilai Kontrak Total</strong></td>
            <td>Harga Final Disepakati</td>
            <td><strong>${priceFormatted}</strong></td>
          </tr>
          <tr>
            <td><strong>Down Payment (DP 50%)</strong></td>
            <td>Wajib sebelum pengerjaan dimulai</td>
            <td><strong>${dpAmount}</strong></td>
          </tr>
          <tr>
            <td><strong>Pelunasan (50%)</strong></td>
            <td>Setelah deliverable disetujui</td>
            <td><strong>${priceFormatted}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <div class="section-title">Status Persetujuan Digital</div>
      <div class="grid-2">
        <div class="info-card">
          <label>Status Terms</label>
          <p>${terms?.approvedByClient ? '<span class="badge badge-approved">DISETUJUI KLIEN</span>' : '<span class="badge badge-pending">MENUNGGU VERIFIKASI KLIEN</span>'}</p>
        </div>
        <div class="info-card">
          <label>Tanggal Penandatanganan</label>
          <p>${contract?.signedAt ? new Date(contract.signedAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : "Belum Ditandatangani"}</p>
        </div>
      </div>
    </div>

    <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
      Dokumen ini diterbitkan secara otomatis oleh sistem Crave Center ITSM dan sah sebagai bukti perjanjian kerja.
    </div>
  </div>

</body>
</html>
    `

    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      }
    })
  } catch (error: any) {
    return new NextResponse("Error generating contract PDF: " + error.message, { status: 500 })
  }
}
