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
    const numericPrice = terms?.priceFinal ? Number(terms.priceFinal) : Number(project.offeredPrice || 0)
    const priceFormatted = `Rp ${numericPrice.toLocaleString("id-ID")}`
    const dpAmount = `Rp ${(numericPrice * 0.5).toLocaleString("id-ID")}`

    const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Perjanjian Kontrak & Terms - ${project.title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    * { box-sizing: border-box; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0F172A;
      background: #F8FAFC;
      margin: 0;
      padding: 40px 20px;
      -webkit-print-color-adjust: exact;
    }
    .contract-container {
      max-width: 840px;
      margin: 0 auto;
      background: #ffffff;
      padding: 56px;
      border-radius: 24px;
      box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.08);
      border: 1px solid #E2E8F0;
      position: relative;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #4F46E5;
      padding-bottom: 28px;
      margin-bottom: 36px;
    }
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-icon {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      font-weight: 900;
      font-size: 22px;
      box-shadow: 0 8px 16px rgba(79, 70, 229, 0.25);
    }
    .brand-name {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #0F172A;
    }
    .brand-name span {
      color: #4F46E5;
    }
    .doc-title {
      text-align: right;
    }
    .doc-title h1 {
      margin: 0;
      font-size: 18px;
      font-weight: 800;
      color: #0F172A;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }
    .doc-title p {
      margin: 4px 0 0;
      font-size: 12px;
      font-weight: 600;
      color: #64748B;
    }
    .section {
      margin-bottom: 32px;
    }
    .section-title {
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #4F46E5;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .info-card {
      background: #F8FAFC;
      padding: 16px 20px;
      border-radius: 14px;
      border: 1px solid #E2E8F0;
    }
    .info-card label {
      display: block;
      font-size: 11px;
      color: #64748B;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }
    .info-card p {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: #0F172A;
    }
    .scope-box {
      background: #F5F3FF;
      border: 1px solid #DDD6FE;
      padding: 24px;
      border-radius: 16px;
      white-space: pre-wrap;
      font-size: 13px;
      line-height: 1.7;
      color: #3730A3;
      font-weight: 500;
    }
    .table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      border: 1px solid #E2E8F0;
      border-radius: 14px;
      overflow: hidden;
    }
    .table th, .table td {
      padding: 14px 20px;
      text-align: left;
      border-bottom: 1px solid #E2E8F0;
      font-size: 13px;
    }
    .table th {
      background: #F1F5F9;
      color: #475569;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.05em;
    }
    .table tr:last-child td {
      border-bottom: none;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 800;
    }
    .badge-approved { background: #DCFCE7; color: #15803D; }
    .badge-pending { background: #FEF3C7; color: #B45309; }
    
    .signature-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-top: 40px;
      padding-top: 24px;
      border-top: 2px dashed #E2E8F0;
    }
    .sig-box {
      text-align: center;
      padding: 20px;
      background: #FAFAFA;
      border-radius: 16px;
      border: 1px solid #F1F5F9;
    }
    .sig-title {
      font-size: 12px;
      font-weight: 700;
      color: #64748B;
      margin-bottom: 40px;
    }
    .sig-name {
      font-size: 14px;
      font-weight: 800;
      color: #0F172A;
    }
    .sig-stamp {
      font-size: 11px;
      color: #16A34A;
      font-weight: 700;
      margin-top: 4px;
    }

    .print-btn {
      position: fixed;
      bottom: 28px;
      right: 28px;
      background: linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%);
      color: #ffffff;
      padding: 14px 28px;
      border-radius: 16px;
      font-weight: 800;
      border: none;
      cursor: pointer;
      box-shadow: 0 12px 24px rgba(79, 70, 229, 0.35);
      font-size: 14px;
      transition: all 0.2s ease;
    }
    .print-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 32px rgba(79, 70, 229, 0.45); }

    @media print {
      body { background: #ffffff; padding: 0; }
      .contract-container { border: none; box-shadow: none; padding: 0; }
      .print-btn { display: none; }
    }
  </style>
</head>
<body>

  <button class="print-btn" onclick="window.print()">🖨️ Cetak / Simpan PDF Kontrak</button>

  <div class="contract-container">
    {/* Header & Crave Logo */}
    <div class="header">
      <div class="brand-logo">
        <div class="brand-icon">C</div>
        <div class="brand-name">CRAVE <span>SYSTEM</span></div>
      </div>
      <div class="doc-title">
        <h1>SURAT PERJANJIAN & KONTRAK KERJA</h1>
        <p>NO. DOKUMEN: CONTRACT-${project.id.substring(0, 8).toUpperCase()}</p>
      </div>
    </div>

    {/* Section 1: Para Pihak */}
    <div class="section">
      <div class="section-title">📄 I. INFORMASI PROYEK & PARA PIHAK</div>
      <div class="grid-2">
        <div class="info-card">
          <label>Nama Proyek</label>
          <p>${project.title}</p>
        </div>
        <div class="info-card">
          <label>Klien (Pemberi Kerja)</label>
          <p>${project.client?.name || "Klien Crave"} (${project.client?.email || "-"})</p>
        </div>
        <div class="info-card">
          <label>Penyedia Layanan / Manajemen</label>
          <p>Crave Center Management System</p>
        </div>
        <div class="info-card">
          <label>Pelaksana Proyek (Worker)</label>
          <p>${project.worker?.name || "Tim Pengembang / Specialist Crave"}</p>
        </div>
      </div>
    </div>

    {/* Section 2: Scope of Work & Garansi */}
    <div class="section">
      <div class="section-title">📝 II. LINGKUP PEKERJAAN & KETENTUAN GARANSI</div>
      <div class="scope-box">${terms?.scope || project.description || "Ketentuan pengerjaan disesuaikan dengan deskripsi dan kesepakatan kebutuhan proyek."}</div>
    </div>

    {/* Section 3: Skema Biaya */}
    <div class="section">
      <div class="section-title">💳 III. SKEMA BIAYA & PEMBAYARAN</div>
      <table class="table">
        <thead>
          <tr>
            <th>Komponen Tagihan</th>
            <th>Ketentuan Pembayaran</th>
            <th>Jumlah (IDR)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Nilai Kontrak Disepakati</strong></td>
            <td>Harga Total Proyek</td>
            <td><strong>${priceFormatted}</strong></td>
          </tr>
          <tr>
            <td><strong>Uang Muka (DP 50%)</strong></td>
            <td>Wajib dibayar sebelum pengerjaan dimulai</td>
            <td><strong style="color: #4F46E5;">${dpAmount}</strong></td>
          </tr>
          <tr>
            <td><strong>Pelunasan Akhir (50%)</strong></td>
            <td>Dibayarkan setelah deliverable disetujui</td>
            <td><strong>${dpAmount}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* Section 4: Persetujuan */}
    <div class="section">
      <div class="section-title">🛡️ IV. STATUS PERSETUJUAN & INTEGRITAS DIGITAL</div>
      <div class="grid-2">
        <div class="info-card">
          <label>Status Persetujuan Terms</label>
          <p>${terms?.approvedByClient ? '<span class="badge badge-approved">✓ DISETUJUI KLIEN</span>' : '<span class="badge badge-pending">⏳ MENUNGGU KONFIRMASI KLIEN</span>'}</p>
        </div>
        <div class="info-card">
          <label>Tanggal Verifikasi Digital</label>
          <p>${contract?.signedAt ? new Date(contract.signedAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
    </div>

    {/* Signatures */}
    <div class="signature-grid">
      <div class="sig-box">
        <div class="sig-title">Pihak Klien (Pemberi Kerja)</div>
        <div class="sig-name">${project.client?.name || "Klien"}</div>
        <div class="sig-stamp">✓ Verified via Crave Client Dashboard</div>
      </div>
      <div class="sig-box">
        <div class="sig-title">Pihak Penyedia (Crave System)</div>
        <div class="sig-name">Crave Center Management</div>
        <div class="sig-stamp">✓ Authorized & Digitally Sealed</div>
      </div>
    </div>

    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E2E8F0; font-size: 11px; color: #94A3B8; text-align: center; font-weight: 500;">
      Dokumen Perjanjian & Kontrak ini diterbitkan secara elektronik oleh platform Crave Center System dan sah tanpa memerlukan tanda tangan basah fisik.
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
