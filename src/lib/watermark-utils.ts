/**
 * Watermark Utility for Crave Center System
 * Client-side HTML5 Canvas watermark generator for image deliverables
 */

export interface WatermarkOptions {
  text?: string
  subtext?: string
  opacity?: number
  tileSize?: number
  showSecurityBadge?: boolean
}

/**
 * Applies a professional, semi-transparent watermark and security badge onto an image file
 */
export async function applyWatermarkToImage(
  file: File,
  options: WatermarkOptions = {}
): Promise<{ file: File; dataUrl: string }> {
  const {
    text = "CRAVE CENTER - PREVIEW ONLY",
    subtext = "NOT FOR COMMERCIAL USE • ALL RIGHTS RESERVED",
    opacity = 0.22,
    showSecurityBadge = true,
  } = options

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("Gagal membaca file gambar"))

    reader.onload = (event) => {
      const img = new Image()
      img.onerror = () => reject(new Error("Gagal memuat format gambar"))

      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height

        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Gagal menginisialisasi Canvas 2D context"))
          return
        }

        // 1. Draw original image
        ctx.drawImage(img, 0, 0)

        // 2. Draw Repeating Diagonal Watermark Grid
        ctx.save()
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.strokeStyle = `rgba(0, 0, 0, ${opacity * 0.7})`
        ctx.lineWidth = Math.max(1, Math.round(img.width / 1200))

        const fontSize = Math.max(16, Math.round(img.width / 24))
        ctx.font = `900 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
        ctx.textBaseline = "middle"

        const stepX = Math.max(250, img.width / 3)
        const stepY = Math.max(180, img.height / 4)

        ctx.translate(img.width / 2, img.height / 2)
        ctx.rotate((-30 * Math.PI) / 180)
        ctx.translate(-img.width, -img.height)

        for (let x = -img.width; x < img.width * 2; x += stepX) {
          for (let y = -img.height; y < img.height * 2; y += stepY) {
            ctx.strokeText(text, x, y)
            ctx.fillText(text, x, y)
          }
        }
        ctx.restore()

        // 3. Draw Bottom-Right Frosted Glass Security Badge
        if (showSecurityBadge) {
          ctx.save()
          const badgeWidth = Math.min(img.width * 0.6, 420)
          const badgeHeight = Math.max(48, Math.round(img.height / 16))
          const margin = Math.max(16, Math.round(img.width / 50))

          const badgeX = img.width - badgeWidth - margin
          const badgeY = img.height - badgeHeight - margin
          const cornerRadius = Math.max(8, Math.round(badgeHeight / 4))

          // Dark frosted glass background
          ctx.fillStyle = "rgba(15, 23, 42, 0.82)"
          ctx.beginPath()
          if ("roundRect" in ctx && typeof ctx.roundRect === "function") {
            ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, cornerRadius)
          } else {
            ctx.rect(badgeX, badgeY, badgeWidth, badgeHeight)
          }
          ctx.fill()

          // Accent border
          ctx.strokeStyle = "rgba(99, 102, 241, 0.6)"
          ctx.lineWidth = 2
          ctx.stroke()

          // Badge Text
          const badgeFontSize = Math.max(11, Math.round(badgeHeight * 0.32))
          const badgeSubFontSize = Math.max(9, Math.round(badgeHeight * 0.22))

          ctx.fillStyle = "#FFFFFF"
          ctx.font = `bold ${badgeFontSize}px system-ui, -apple-system, sans-serif`
          ctx.fillText(`🔒 ${text}`, badgeX + 16, badgeY + badgeHeight * 0.38)

          ctx.fillStyle = "#94A3B8"
          ctx.font = `500 ${badgeSubFontSize}px system-ui, -apple-system, sans-serif`
          ctx.fillText(subtext, badgeX + 16, badgeY + badgeHeight * 0.72)

          ctx.restore()
        }

        // Export as Blob & DataURL
        const mimeType = file.type || "image/png"
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Gagal mengonversi canvas ke blob"))
              return
            }
            const watermarkedFileName = file.name.replace(
              /(\.[\w]+)$/,
              "-watermarked$1"
            )
            const watermarkedFile = new File([blob], watermarkedFileName, {
              type: mimeType,
              lastModified: Date.now(),
            })
            const dataUrl = canvas.toDataURL(mimeType, 0.92)
            resolve({ file: watermarkedFile, dataUrl })
          },
          mimeType,
          0.92
        )
      }

      img.src = event.target?.result as string
    }

    reader.readAsDataURL(file)
  })
}
