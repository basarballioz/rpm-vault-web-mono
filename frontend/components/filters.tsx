"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { X, Filter, Search } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface FiltersProps {
  categories: string[]
  brands: string[]
  selectedCategories: string[]
  selectedBrands: string[]
  onCategoryChange: (categories: string[]) => void
  onBrandChange: (brands: string[]) => void
  onClearFilters: () => void
  totalResults: number
  loading: boolean
}

export function Filters({
  categories,
  brands,
  selectedCategories,
  selectedBrands,
  onCategoryChange,
  onBrandChange,
  onClearFilters,
  totalResults,
  loading,
}: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [categorySearch, setCategorySearch] = useState("")
  const [brandSearch, setBrandSearch] = useState("")
  const { t } = useLanguage()

  const MAX_SELECTIONS = 7

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category))
    } else if (selectedCategories.length < MAX_SELECTIONS) {
      onCategoryChange([...selectedCategories, category])
    }
  }

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandChange(selectedBrands.filter((b) => b !== brand))
    } else if (selectedBrands.length < MAX_SELECTIONS) {
      onBrandChange([...selectedBrands, brand])
    }
  }

  // Filter categories and brands based on search
  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(categorySearch.toLowerCase())
  )

  const filteredBrands = brands.filter((brand) =>
    String(brand || '').toLowerCase().includes(brandSearch.toLowerCase())
  )

  const hasActiveFilters = selectedCategories.length > 0 || selectedBrands.length > 0

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <Button onClick={() => setIsOpen(!isOpen)} className="w-full gap-2">
          <Filter className="h-4 w-4" />
          <span>{t("filters.title") ?? "Filters"}</span>
          {!loading && totalResults > 0 && (
            <Badge variant="secondary" className="ml-auto cursor-pointer">
              {totalResults.toLocaleString()}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      <div className={`space-y-4 ${isOpen ? "block" : "hidden md:block"}`}>
        {/* Active Filters */}
        {hasActiveFilters && (
          <Card className="gap-2">
            <CardHeader>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{t("filters.active") ?? "Active Filters"}</CardTitle>
                  <Button variant="destructive" size="sm" onClick={onClearFilters} className="text-xs cursor-pointer">
                    {t("filters.clearAll")}
                  </Button>
                </div>
                {!loading && totalResults > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {totalResults.toLocaleString()} motorcycles found
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
                {selectedBrands.map((brand) => (
                  <Badge
                    key={brand}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => toggleBrand(brand)}
                  >
                    {brand}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("filters.categories")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Category Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t("filters.searchCategories") ?? "Search categories..."}
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>

              {/* Categories List */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <label
                      key={category}
                      className={`flex items-center space-x-2 cursor-pointer hover:text-primary transition-colors ${!selectedCategories.includes(category) && selectedCategories.length >= MAX_SELECTIONS
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        disabled={!selectedCategories.includes(category) && selectedCategories.length >= MAX_SELECTIONS}
                        className="rounded border-border text-primary focus:ring-primary cursor-pointer disabled:cursor-not-allowed"
                      />
                      <span className="text-sm cursor-pointer">{category}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    {t("filters.noResults") ?? "No results found"}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brands */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("filters.brands")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Brand Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t("filters.searchBrands") ?? "Search brands..."}
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>

              {/* Brands List */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredBrands.length > 0 ? (
                  filteredBrands.map((brand) => (
                    <label
                      key={brand}
                      className={`flex items-center space-x-2 cursor-pointer hover:text-primary transition-colors ${!selectedBrands.includes(brand) && selectedBrands.length >= MAX_SELECTIONS
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        disabled={!selectedBrands.includes(brand) && selectedBrands.length >= MAX_SELECTIONS}
                        className="rounded border-border text-primary focus:ring-primary cursor-pointer disabled:cursor-not-allowed"
                      />
                      <span className="text-sm cursor-pointer">{brand}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    {t("filters.noResults") ?? "No results found"}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
