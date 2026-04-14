"use client"

import * as React from "react"

type Theme = "system" | "light" | "dark"
type ResolvedTheme = "light" | "dark"

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

type ThemeProviderProps = {
  children: React.ReactNode
}

const systemDarkModeQuery = "(prefers-color-scheme: dark)"
const themeStorageKey = "clientdocs-theme"

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

function getSystemTheme() {
  return window.matchMedia(systemDarkModeQuery).matches ? "dark" : "light"
}

function getStoredTheme(): Theme {
  const storedTheme = window.localStorage.getItem(themeStorageKey)

  if (
    storedTheme === "light" ||
    storedTheme === "dark" ||
    storedTheme === "system"
  ) {
    return storedTheme
  }

  return "system"
}

function resolveTheme(theme: Theme, systemTheme: ResolvedTheme) {
  return theme === "system" ? systemTheme : theme
}

function applyTheme(resolvedTheme: ResolvedTheme) {
  const root = document.documentElement

  root.classList.toggle("dark", resolvedTheme === "dark")
  root.classList.toggle("light", resolvedTheme === "light")
  root.style.colorScheme = resolvedTheme
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>("system")
  const [resolvedTheme, setResolvedTheme] =
    React.useState<ResolvedTheme>("light")
  const themeRef = React.useRef<Theme>("system")

  const syncTheme = React.useEffectEvent(
    (nextTheme: Theme, systemTheme: ResolvedTheme) => {
      const nextResolvedTheme = resolveTheme(nextTheme, systemTheme)

      applyTheme(nextResolvedTheme)
      setResolvedTheme(nextResolvedTheme)
    },
  )

  function setTheme(nextTheme: Theme) {
    themeRef.current = nextTheme
    setThemeState(nextTheme)

    if (nextTheme === "system") {
      window.localStorage.removeItem(themeStorageKey)
    } else {
      window.localStorage.setItem(themeStorageKey, nextTheme)
    }

    syncTheme(nextTheme, getSystemTheme())
  }

  function toggleTheme() {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark"
    setTheme(nextTheme)
  }

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(systemDarkModeQuery)
    const initialTheme = getStoredTheme()

    themeRef.current = initialTheme
    setThemeState(initialTheme)
    syncTheme(initialTheme, getSystemTheme())

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      if (themeRef.current !== "system") {
        return
      }

      syncTheme(themeRef.current, event.matches ? "dark" : "light")
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== themeStorageKey) {
        return
      }

      const nextTheme =
        event.newValue === "light" || event.newValue === "dark"
          ? event.newValue
          : "system"

      themeRef.current = nextTheme
      setThemeState(nextTheme)
      syncTheme(nextTheme, getSystemTheme())
    }

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleMediaQueryChange)
      window.addEventListener("storage", handleStorageChange)

      return () => {
        mediaQuery.removeEventListener("change", handleMediaQueryChange)
        window.removeEventListener("storage", handleStorageChange)
      }
    }

    mediaQuery.addListener(handleMediaQueryChange)
    window.addEventListener("storage", handleStorageChange)

    return () => {
      mediaQuery.removeListener(handleMediaQueryChange)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }

  return context
}
