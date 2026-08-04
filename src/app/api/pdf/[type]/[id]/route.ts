import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  props: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const { type, id: projectId } = await props.params

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        client: true,
        worker: true,
        terms: true,
        contracts: true,
        payments: true,
      }
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const terms = project.terms
    const contract = project.contracts?.[0]
    const milestones = (terms?.milestones as any[]) || []
    const priceFormatted = terms?.priceFinal
      ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(terms.priceFinal))
      : "Rp 0"

    const title = type === 'terms' ? `TERMS OF AGREEMENT — ${project.title}` : `SERVICE CONTRACT — ${project.title}`

    const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
    body { background: #f8fafc; color: #0f172a; padding: 40px; }
    .container { max-width: 800px; margin: 0 auto; background: #ffffff; padding: 48px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 24px; border-bottom: 2px solid #6366f1; margin-bottom: 32px; }
    .logo { font-size: 24px; font-weight: 800; color: #4f46e5; letter-spacing: -0.5px; }
    .doc-type { text-align: right; }
    .doc-type h1 { font-size: 18px; font-weight: 700; color: #1e293b; text-transform: uppercase; letter-spacing: 0.5px; }
    .doc-type p { font-size: 12px; color: #64748b; margin-top: 4px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #f1f5f9; }
    .info-group label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 4px; }
    .info-group p { font-size: 13px; font-weight: 600; color: #0f172a; }
    .section-title { font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    .content-box { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-size: 13px; color: #334155; line-height: 1.6; margin-bottom: 24px; white-space: pre-wrap; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
    th { background: #4f46e5; color: #ffffff; text-align: left; padding: 10px 14px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    td { padding: 12px 14px; font-size: 13px; border-bottom: 1px solid #e2e8f0; color: #334155; }
    tr:nth-child(even) { background: #f8fafc; }
    .total-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .total-title { font-size: 13px; font-weight: 700; color: #166534; }
    .total-price { font-size: 20px; font-weight: 800; color: #15803d; }
    .signature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 48px; padding-top: 24px; border-top: 1px dashed #cbd5e1; }
    .sig-card { text-align: center; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
    .sig-title { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 16px; }
    .sig-status { display: inline-block; padding: 6px 12px; background: #dcfce7; color: #15803d; font-size: 11px; font-weight: 700; border-radius: 20px; border: 1px solid #86efac; margin-bottom: 8px; }
    .sig-date { font-size: 11px; color: #64748b; }
    .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 16px; }
    @media print {
      body { background: white; padding: 0; }
      .container { border: none; box-shadow: none; padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="max-width: 800px; margin: 0 auto 20px auto; text-align: right;">
    <button onclick="window.print()" style="padding: 10px 20px; background: #4f46e5; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px;">
      🖨️ Cetak / Simpan sebagai PDF
    </button>
  </div>

  <div class="container">
    <div class="header">
      <div>
        <div class="logo">CRAVE ITSM</div>
        <p style="font-size: 11px; color: #64748b; margin-top: 2px;">IT Service Management Platform</p>
      </div>
      <div class="doc-type">
        <h1>${type === 'terms' ? 'DOKUMEN TERMS' : 'KONTRAK LAYANAN'}</h1>
        <p>Ref: CRAVE-${project.id.slice(0, 8).toUpperCase()}</p>
        <p>Tanggal: ${new Date(project.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
    </div>

    <div class="grid">
      <div class="info-group">
        <label>Klien (Pemesan)</label>
        <p>${project.client?.name || 'Client'}</p>
        <span style="font-size: 11px; color: #64748b;">${project.client?.email}</span>
      </div>
      <div class="info-group">
        <label>Penyedia Jasa (Worker / Tim)</label>
        <p>${project.worker?.name || 'Crave Technical Team'}</p>
        <span style="font-size: 11px; color: #64748b;">${project.worker?.email || 'support@crave.com'}</span>
      </div>
    </div>

    <div class="section-title">Judul Proyek & Deskripsi</div>
    <div class="content-box">
      <strong>${project.title}</strong><br><br>
      ${project.description}
    </div>

    ${terms ? `
      <div class="section-title">Scope Pekerjaan & Ketentuan</div>
      <div class="content-box">${terms.scope || 'Scope pekerjaan disepakati sesuai brief proyek.'}</div>

      ${milestones.length > 0 ? `
        <div class="section-title">Jadwal Pembayaran & Milestone</div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Milestone / Tahapan</th>
              <th>Persentase (%)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${milestones.map((m: any, idx: number) => `
              <tr>
                <td>${idx + 1}</td>
                <td>${m.title || m.description || 'Tahap ' + (idx + 1)}</td>
                <td>${m.percentage ? m.percentage + '%' : '-'}</td>
                <td>${m.status || 'PENDING'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : ''}

      <div class="total-box">
        <div class="total-title">TOTAL HARGA KESEPAKATAN (FINAL)</div>
        <div class="total-price">${priceFormatted}</div>
      </div>
    ` : ''}

    <div class="signature-grid">
      <div class="sig-card">
        <div class="sig-title">Persetujuan Digital Klien</div>
        ${terms?.approvedByClient || contract?.signedAt ? `
          <div class="sig-status">✓ TERVERIFIKASI & DISETUJUI</div>
          <div class="sig-date">Timestamp: ${contract?.signedAt ? new Date(contract.signedAt).toLocaleString('id-ID') : new Date(terms?.updatedAt || Date.now()).toLocaleString('id-ID')}</div>
        ` : `
          <div style="font-size: 12px; color: #94a3b8; padding: 8px;">Menunggu Persetujuan</div>
        `}
      </div>

      <div class="sig-card">
        <div class="sig-title">Penyedia Jasa (Crave Admin)</div>
        <div class="sig-status">✓ TEROTORISASI SIKU</div>
        <div class="sig-date">Crave ITSM Management</div>
      </div>
    </div>

    <div class="footer">
      Dokumen ini diproses dan diterbitkan secara digital oleh Crave ITSM Platform. Sah dan mengikat bagi kedua belah pihak.
    </div>
  </div>
</body>
</html>
    `

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
