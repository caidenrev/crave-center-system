import React from "react"

/**
 * Checks if a filename or MIME type is an image
 */
export function isImageFile(fileName?: string | null, fileType?: string | null): boolean {
  if (fileType === "IMAGE") return true
  if (!fileName) return false
  const ext = fileName.split(".").pop()?.toLowerCase() || ""
  return ["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"].includes(ext)
}

/**
 * Parses URLs in a text string and converts them to clickable <a> elements safely.
 */
export function renderTextWithLinks(text: string): React.ReactNode {
  if (!text) return null

  // Regex to match URLs starting with http:// or https://
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-medium hover:text-indigo-300 transition-colors break-all"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      )
    }
    return <React.Fragment key={index}>{part}</React.Fragment>
  })
}
