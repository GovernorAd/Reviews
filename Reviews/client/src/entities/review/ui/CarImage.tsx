import { useEffect, useState } from 'react'
import styled from 'styled-components'

const FALLBACK_IMAGE = '/cars/placeholder.svg'

const Image = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

interface CarImageProps {
  src?: string
  alt: string
  className?: string
}

export const CarImage = ({ src, alt, className }: CarImageProps) => {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [src])

  return (
    <Image
      className={className}
      src={!src || hasError ? FALLBACK_IMAGE : src}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  )
}
