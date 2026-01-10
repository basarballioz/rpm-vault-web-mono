"use client"

import { Search, Bike, ChevronDown, Menu, X, Trophy, Mountain, Trees, Zap, Map, Flag, Gauge } from "lucide-react"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { usePathname } from "next/navigation"
// Removed LanguageSelector; it is now floating in layout
import { useLanguage } from "@/contexts/language-context"
import { Motorcycle } from "@shared/types"
import { transformMotorcycleData } from "@shared/utils"
import { API_CONFIG } from "@shared/constants"

interface SearchResult {
  _id: string
  Model: string
  Brand: string
  Year: string
  Category: string
  Displacement?: string
  Power?: string
}

export function Header({ onSearch, searchQuery = "" }: { onSearch?: (query: string) => void, searchQuery?: string }) {
  const pathname = usePathname()
  const isCatalogPage = pathname === '/catalog'
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [searchSuggestions, setSearchSuggestions] = useState<SearchResult[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)
  const categoriesRef = useRef<HTMLDivElement>(null)
  const desktopInputRef = useRef<HTMLInputElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setIsMobileSearchOpen(false)
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const searchMotorcycles = async () => {
      // Disable suggestions on catalog page
      if (isCatalogPage) {
        setSearchSuggestions([])
        setShowSuggestions(false)
        return
      }

      if (searchQuery.length < 2) {
        setSearchSuggestions([])
        setShowSuggestions(false)
        return
      }

      setIsSearching(true)
      try {
        // Assuming 'setLoading' is a state variable that needs to be defined if not already present.
        // For now, I'll add it as per the instruction, but it might require a useState declaration.
        // setLoading(true) // This line was in the instruction but 'setLoading' is not defined. Removing for syntactical correctness.
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/bikes?search=${encodeURIComponent(searchQuery)}&limit=5`,
        )
        if (response.ok) {
          const data = await response.json()
          if (data.bikes) {
            setSearchSuggestions(data.bikes || [])
            setShowSuggestions(true)
          }
        }
      } catch (error) {
        console.error("Search error:", error)
        setSearchSuggestions([])
      } finally {
        setIsSearching(false)
      }
    }

    const timeoutId = setTimeout(searchMotorcycles, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery, isCatalogPage])

  const handleSearchInputChange = useCallback((value: string) => {
    if (onSearch) {
      onSearch(value)
    }
  }, [onSearch])

  const handleSuggestionClick = useCallback((motorcycle: SearchResult) => {
    setShowSuggestions(false)
    window.location.href = `/catalog?motorcycle=${motorcycle._id}`
  }, [])

  const getCategoryIcon = useCallback((category: string) => {
    switch (category?.toLowerCase()) {
      case "sport":
        return <Flag className="h-5 w-5" />
      case "cruiser":
        return <Bike className="h-5 w-5" />
      case "adventure":
        return <Mountain className="h-5 w-5" />
      case "enduro":
        return <Trees className="h-5 w-5" />
      case "scooter":
        return <Bike className="h-5 w-5" />
      case "touring":
        return <Map className="h-5 w-5" />
      case "naked":
        return <Zap className="h-5 w-5" />
      default:
        return <Bike className="h-5 w-5" />
    }
  }, [])

  const motorcycleCategories = useMemo(() => [
    { name: "Sport", icon: <Flag className="h-4 w-4" /> },
    { name: "Cruiser", icon: <Bike className="h-4 w-4" /> },
    { name: "Adventure", icon: <Mountain className="h-4 w-4" /> },
    { name: "Enduro", icon: <Trees className="h-4 w-4" /> },
    { name: "Scooter", icon: <Bike className="h-4 w-4" /> },
    { name: "Touring", icon: <Map className="h-4 w-4" /> },
    { name: "Naked", icon: <Zap className="h-4 w-4" /> },
  ], [])

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between gap-4">
            {/* Mobile: Hamburger Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden h-8 w-8 p-0 hover:bg-secondary/50 cursor-pointer flex-shrink-0"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 cursor-pointer flex-shrink-0">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
                <Bike className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground tracking-tight">RPMVault</span>
            </Link>

            <div className="hidden md:flex items-center flex-1 justify-center" ref={searchRef}>
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder={t("header.search")}
                  value={searchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  onFocus={() => !isCatalogPage && searchQuery.length >= 2 && setShowSuggestions(true)}
                  className="pl-9 pr-4 py-2 h-9 bg-secondary/30 border-border/50 rounded-lg text-sm placeholder:text-muted-foreground/60 focus:bg-background focus:border-primary/50 transition-all duration-200 cursor-pointer"
                  style={{ fontSize: "14px" }}
                />

                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                    {isSearching && (
                      <div className="p-4 text-center text-muted-foreground">
                        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                        Searching...
                      </div>
                    )}

                    {!isSearching && searchSuggestions.length === 0 && searchQuery.length >= 2 && (
                      <div className="p-4 text-center text-muted-foreground">No results found</div>
                    )}

                    {!isSearching &&
                      searchSuggestions.map((motorcycle) => (
                        <div
                          key={motorcycle._id}
                          onClick={() => handleSuggestionClick(motorcycle)}
                          className="p-3 hover:bg-secondary/50 cursor-pointer border-b border-border/30 last:border-b-0 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center text-primary">
                              {getCategoryIcon(motorcycle.Category)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-foreground truncate">
                                {motorcycle.Brand} {motorcycle.Model}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{motorcycle.Year}</span>
                                {motorcycle.Category && (
                                  <>
                                    <span>•</span>
                                    <span>{motorcycle.Category}</span>
                                  </>
                                )}
                                {motorcycle.Displacement && (
                                  <>
                                    <span>•</span>
                                    <span>{motorcycle.Displacement}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
            {/* Mobile: Search Icon */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden h-8 w-8 p-0 hover:bg-secondary/50 cursor-pointer flex-shrink-0 z-10"
              onClick={() => {
                if (isMobileSearchOpen) {
                  setIsMobileSearchOpen(false)
                  setShowSuggestions(false)
                } else {
                  setIsMobileSearchOpen(true)
                }
              }}
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Desktop: Navigation */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <nav className="flex items-center gap-2">
                <Link href="/catalog">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-4 text-sm font-medium hover:bg-secondary/50 cursor-pointer"
                  >
                    {t("header.catalog")}
                  </Button>
                </Link>

                <Link href="/compare">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-4 text-sm font-medium hover:bg-secondary/50 cursor-pointer"
                  >
                    {t("header.compare")}
                  </Button>
                </Link>

                <div className="relative" ref={categoriesRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-4 text-sm font-medium hover:bg-secondary/50 cursor-pointer"
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  >
                    {t("header.categories")}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>

                  {isCategoriesOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50">
                      {motorcycleCategories.map((category) => (
                        <Link
                          key={category.name}
                          href={`/catalog?category=${category.name}`}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-secondary/50 transition-colors cursor-pointer"
                          onClick={() => setIsCategoriesOpen(false)}
                        >
                          <span className="text-base text-primary">{category.icon}</span>
                          <span className="text-sm">{category.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </div>

          {isMobileSearchOpen && (
            <div className="md:hidden py-3 border-t border-border/40">
              <div className="relative" ref={mobileSearchRef}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder={t("header.search")}
                  value={searchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  onFocus={() => !isCatalogPage && searchQuery.length >= 2 && setShowSuggestions(true)}
                  className="pl-9 h-10 bg-secondary/30 border-border/50 rounded-lg text-base placeholder:text-muted-foreground/60 focus:bg-background focus:border-primary/50 transition-all duration-200"
                  style={{ fontSize: "14px" }}
                  autoFocus
                />

                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                    {isSearching && (
                      <div className="p-4 text-center text-muted-foreground">
                        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                        Searching...
                      </div>
                    )}

                    {!isSearching && searchSuggestions.length === 0 && searchQuery.length >= 2 && (
                      <div className="p-4 text-center text-muted-foreground">No results found</div>
                    )}

                    {!isSearching &&
                      searchSuggestions.map((motorcycle) => (
                        <div
                          key={motorcycle._id}
                          onClick={() => handleSuggestionClick(motorcycle)}
                          className="p-3 hover:bg-secondary/50 cursor-pointer border-b border-border/30 last:border-b-0 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center text-primary">
                              {getCategoryIcon(motorcycle.Category)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-foreground truncate">
                                {motorcycle.Brand} {motorcycle.Model}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{motorcycle.Year}</span>
                                {motorcycle.Category && (
                                  <>
                                    <span>•</span>
                                    <span>{motorcycle.Category}</span>
                                  </>
                                )}
                                {motorcycle.Displacement && (
                                  <>
                                    <span>•</span>
                                    <span>{motorcycle.Displacement}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Sidebar - Outside header for full page overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay - z-[60] */}
          <div
            className="fixed inset-0 bg-black/50 z-[60] md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar - z-[70] */}
          <div className="fixed top-0 left-0 h-full w-72 bg-background border-r border-border z-[70] md:hidden overflow-y-auto shadow-xl">
            <div className="p-4">
              {/* Header with close button */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-semibold">Menu</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-secondary/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex flex-col space-y-2">
                {/* Catalog Link */}
                <Link
                  href="/catalog"
                  className="flex items-center px-4 py-3 text-foreground hover:bg-secondary/50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("header.catalog")}
                </Link>

                {/* Compare Link */}
                <Link
                  href="/compare"
                  className="flex items-center px-4 py-3 text-foreground hover:bg-secondary/50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("header.compare")}
                </Link>

                {/* Categories Dropdown */}
                <div>
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 text-foreground hover:bg-secondary/50 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                  >
                    <span>{t("header.categories")}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${isMobileCategoriesOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Categories List */}
                  {isMobileCategoriesOpen && (
                    <div className="mt-2 ml-4 flex flex-col space-y-1">
                      {motorcycleCategories.map((category) => (
                        <Link
                          key={category.name}
                          href={`/catalog?category=${category.name}`}
                          className="flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                          onClick={() => {
                            setIsMobileMenuOpen(false)
                            setIsMobileCategoriesOpen(false)
                          }}
                        >
                          <span className="text-lg text-primary">{category.icon}</span>
                          <span>{category.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  )
}
