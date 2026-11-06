import { useCallback, useEffect, useState } from 'react'

import { reviewApi } from '../api/reviewApi'
import type { CarBrandSummary } from './types'

const CATALOG_CHANGED_EVENT = 'reviews:catalog-changed'

export const notifyCatalogChanged = () => {
  window.dispatchEvent(new Event(CATALOG_CHANGED_EVENT))
}

interface UseCarCatalogResult {
  brands: CarBrandSummary[]
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export const useCarCatalog = (): UseCarCatalogResult => {
  const [brands, setBrands] = useState<CarBrandSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await reviewApi.getCatalog(signal)

      if (!signal?.aborted) {
        setBrands(data)
      }
    } catch (cause) {
      if (signal?.aborted) {
        return
      }

      setError(cause instanceof Error ? cause.message : 'Не удалось загрузить марки автомобилей')
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void load(controller.signal)

    const handleCatalogChanged = () => {
      void load()
    }

    window.addEventListener(CATALOG_CHANGED_EVENT, handleCatalogChanged)

    return () => {
      controller.abort()
      window.removeEventListener(CATALOG_CHANGED_EVENT, handleCatalogChanged)
    }
  }, [load])

  const refresh = useCallback(() => load(), [load])

  return { brands, isLoading, error, refresh }
}
