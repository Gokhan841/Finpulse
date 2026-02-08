export interface AvatarProps {
  name: string
  image?: string | null
  size?: number
  className?: string
}

const DEFAULT_AVATAR_URL = 'https://ui-avatars.com/api/'

function getFallbackUrl(name: string, size: number): string {
  return `${DEFAULT_AVATAR_URL}?name=${encodeURIComponent(name)}&background=random&size=${size}`
}

export function Avatar({ name, image, size = 36, className = '' }: AvatarProps) {
  const pixelSize = size
  const fallbackUrl = getFallbackUrl(name, pixelSize)

  return (
    <img
      src={image || fallbackUrl}
      alt={name}
      className={`rounded-full object-cover ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
      onError={(e) => {
        e.currentTarget.src = fallbackUrl
      }}
    />
  )
}
