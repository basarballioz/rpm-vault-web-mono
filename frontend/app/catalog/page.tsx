"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MotorcycleCard } from "@/components/motorcycle-card"
import { Filters } from "@/components/filters"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ChevronLeft, ChevronRight, AlertCircle, ArrowUpDown } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Motorcycle } from "@shared/types"
import { transformMotorcycleData } from "@shared/utils"
import { API_CONFIG } from "@shared/constants"

interface ApiResponse {
  page: number
  limit: number
  total: number
  bikes: Motorcycle[]
}

export default function CatalogPage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>("newest")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const itemsPerPage = 24

  const [allCategories, setAllCategories] = useState<string[]>([])
  const [allBrands, setAllBrands] = useState<string[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/categories`)
        if (response.ok) {
          const data = await response.json()
          setAllCategories(data)
        } else {
          // Fallback to hardcoded if API fails
          setAllCategories(["Adventure", "Cruiser", "Enduro", "Naked", "Scooter", "Sport", "Touring", "Electric"].sort())
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
        // Fallback to hardcoded if API fails
        setAllCategories(["Adventure", "Cruiser", "Enduro", "Naked", "Scooter", "Sport", "Touring", "Electric"].sort())
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/brands`)
        if (response.ok) {
          const data = await response.json()
          const brandNames = data
            .map((item: any) => {
              if (typeof item === 'string') return item
              if (item.Brand) return String(item.Brand)
              if (item.brands) return String(item.brands)
              if (item.name) return String(item.name)
              return null
            })
            .filter((brand: any) => brand)
            .sort()
          setAllBrands(brandNames)
        } else {
          setAllBrands(["Honda", "Yamaha", "Kawasaki", "Suzuki", "BMW", "Ducati", "KTM", "Harley-Davidson"].sort())
        }
      } catch (error) {
        console.error("Error fetching brands:", error)
        setAllBrands(["Honda", "Yamaha", "Kawasaki", "Suzuki", "BMW", "Ducati", "KTM", "Harley-Davidson"].sort())
      }
    }
    fetchBrands()
  }, [])

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get("category")
    const brand = searchParams.get("brand")
    const search = searchParams.get("search")
    const motorcycleId = searchParams.get("motorcycle")

    if (category) setSelectedCategories([category])
    if (brand) setSelectedBrands([brand])
    if (search) setSearchQuery(search)

    // Handle direct motorcycle navigation from search suggestions
    if (motorcycleId) {
      router.push(`/motorcycle/${motorcycleId}`)
    }
  }, [searchParams, router])

  const sortMotorcycles = useCallback((bikes: Motorcycle[], sortType: string) => {
    return [...bikes].sort((a, b) => {
      const yearA = Number.parseInt(a.Year) || 0
      const yearB = Number.parseInt(b.Year) || 0

      switch (sortType) {
        case "newest":
          return yearB - yearA
        case "oldest":
          return yearA - yearB
        case "name":
          return `${a.Brand} ${a.Model}`.localeCompare(`${b.Brand} ${b.Model}`)
        default:
          return yearB - yearA
      }
    })
  }, [])


  useEffect(() => {
    const fetchMotorcycles = async () => {
      try {
        setLoading(true)
        setError(null)

        // Build query parameters
        const params = new URLSearchParams()
        params.append("page", currentPage.toString())
        params.append("limit", itemsPerPage.toString())

        if (searchQuery) params.append("search", searchQuery)

        // Send all selected categories as comma-separated
        if (selectedCategories.length > 0) {
          params.append("category", selectedCategories.join(','))
        }

        // Send all selected brands as comma-separated
        if (selectedBrands.length > 0) {
          params.append("brand", selectedBrands.join(','))
        }


        const response = await fetch(`${API_CONFIG.BASE_URL}/bikes?${params.toString()}`)

        if (response.status === 429) {
          throw new Error("Çok fazla istek gönderildi. Lütfen birkaç saniye bekleyip tekrar deneyin.")
        }

        if (!response.ok) {
          throw new Error("Motorlar yüklenirken bir hata oluştu")
        }

        const data: ApiResponse = await response.json()
        console.log("[v0] API response:", data)

        const filteredBikes = (data.bikes || []).map(transformMotorcycleData)
        const sortedBikes = sortMotorcycles(filteredBikes, sortBy)
        setMotorcycles(sortedBikes)

        setTotalResults(data.total || 0)
        setTotalPages(Math.ceil((data.total || 0) / itemsPerPage))
      } catch (err) {
        console.error("API fetch error:", err)
        setError(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu")
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchMotorcycles, 300)
    return () => clearTimeout(timeoutId)
  }, [currentPage, searchQuery, selectedCategories, selectedBrands, sortBy])

  const handleMotorcycleClick = useCallback((motorcycle: Motorcycle) => {
    router.push(`/motorcycle/${motorcycle._id}`)
  }, [router])

  const clearFilters = useCallback(() => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSearchQuery("")
    setCurrentPage(1)
    setSortBy("newest")
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const handleRetry = useCallback(() => {
    setError(null)
    setCurrentPage(1)
    // Force re-fetch after a short delay
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Filters
              categories={allCategories}
              brands={allBrands}
              selectedCategories={selectedCategories}
              selectedBrands={selectedBrands}
              onCategoryChange={setSelectedCategories}
              onBrandChange={setSelectedBrands}
              onClearFilters={clearFilters}
              totalResults={totalResults}
              loading={loading}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 ml-2 lg:ml-1">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-semibold text-foreground">
                  {loading ? t("catalog.loading") : `${totalResults.toLocaleString()} ${t("catalog.title")}`}
                </h1>
                {searchQuery && (
                  <p className="text-sm md:text-base text-muted-foreground mt-1">
                    "{searchQuery}" {t("catalog.searchResults")}
                  </p>
                )}
              </div>

              {!loading && motorcycles.length > 0 && (
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="flex items-center gap-2 flex-1 md:flex-initial">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full md:w-50 cursor-pointer border-2">
                        <SelectValue placeholder={t("catalog.sortBy")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">{t("catalog.sortNewest")}</SelectItem>
                        <SelectItem value="oldest">{t("catalog.sortOldest")}</SelectItem>
                        <SelectItem value="name">{t("catalog.sortName")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Page Info - Hidden on mobile */}
                  {totalPages > 1 && (
                    <div className="hidden md:block text-sm text-muted-foreground whitespace-nowrap">
                      {t("catalog.page")} {currentPage} / {totalPages}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="text-muted-foreground">{t("catalog.loading")}</p>
                </div>
              </div>
            )}

            {error && !loading && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{t("catalog.error")}</h3>
                  <p className="text-muted-foreground mb-6">{error}</p>
                  <div className="space-y-3">
                    <Button onClick={handleRetry} className="w-full cursor-pointer">
                      {t("catalog.retry")}
                    </Button>
                    <Button variant="destructive" onClick={clearFilters} className="w-full bg-transparent cursor-pointer">
                      {t("catalog.clearFilters")}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Motorcycles Grid */}
            {!loading && !error && motorcycles.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                  {motorcycles.map((motorcycle) => (
                    <MotorcycleCard
                      key={motorcycle._id}
                      motorcycle={motorcycle}
                      onClick={() => handleMotorcycleClick(motorcycle)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col items-center gap-4">
                    {/* Mobile Page Info */}
                    <div className="md:hidden text-sm text-muted-foreground">
                      {t("catalog.page")} {currentPage} / {totalPages}
                    </div>

                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="cursor-pointer"
                        size="sm"
                      >
                        <ChevronLeft className="h-4 w-4 md:mr-1" />
                        <span className="hidden md:inline">{t("catalog.previous")}</span>
                      </Button>

                      {/* Page Numbers */}
                      <div className="flex space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              className="cursor-pointer min-w-[2.5rem]"
                            >
                              {pageNum}
                            </Button>
                          )
                        })}
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="cursor-pointer"
                        size="sm"
                      >
                        <span className="hidden md:inline">{t("catalog.next")}</span>
                        <ChevronRight className="h-4 w-4 md:ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* No Results */}
            {!loading && !error && motorcycles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">{t("catalog.noResults")}</p>
                <Button variant="destructive" onClick={clearFilters} className="cursor-pointer bg-transparent">
                  {t("catalog.clearFilters")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
