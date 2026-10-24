import { useState } from 'react'
import styles from './ProductGallery.module.css'

type ProductGalleryProps = {
  images: string[]
  title: string
}

// The product's main image, with thumbnail buttons to switch between photos when there is more than one
export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0)

  return (
    <div className={styles.gallery}>
      <div className={styles.frame}>
        <img className={styles.main} src={images[selected]} alt={title} width={1000} height={1000} decoding="async" />
      </div>
      {images.length > 1 && (
        <ul className={styles.thumbs} aria-label="Product images">
          {images.map((image, index) => (
            <li key={image}>
              <button
                type="button"
                className={styles.thumb}
                aria-pressed={index === selected}
                aria-label={`Show image ${index + 1} of ${images.length}`}
                onClick={() => setSelected(index)}
              >
                <img src={image} alt="" width={64} height={64} loading="lazy" decoding="async" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
