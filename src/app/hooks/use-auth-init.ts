import { useEffect, useState } from "react"
import { useAuthStore } from "@/app/store/auth-store"

/**
 * Hook to initialize auth state on app startup
 * Fetches current user from /users/me if token exists
 * Call this once in your root layout or _app component
 */
export function useAuthInit() {
  const { token, isInitialized, isHydrating, hydrate } = useAuthStore()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const initializeAuth = async () => {
      // If token exists and not yet hydrated, fetch user data
      if (token && !isInitialized && !isHydrating) {
        await hydrate()
      }

      // Mark as ready even if not authenticated
      setIsReady(true)
    }

    initializeAuth()
  }, [token, isInitialized, isHydrating, hydrate])

  return {
    isReady,
    isHydrating,
    isInitialized,
  }
}
