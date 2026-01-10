"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, ArrowLeft, Bike, Flag, Mountain, Trees, Map, Zap, Trophy, Handshake } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { Motorcycle } from "@shared/types"
import { transformMotorcycleData } from "@shared/utils"
import { API_CONFIG } from "@shared/constants"

export default function ComparePage() {
  const { t } = useLanguage()
  const [searchQuery1, setSearchQuery1] = useState("")
  const [searchQuery2, setSearchQuery2] = useState("")
  const [suggestions1, setSuggestions1] = useState<Motorcycle[]>([])
  const [suggestions2, setSuggestions2] = useState<Motorcycle[]>([])
  const [showSuggestions1, setShowSuggestions1] = useState(false)
  const [showSuggestions2, setShowSuggestions2] = useState(false)
  const [selectedBike1, setSelectedBike1] = useState<Motorcycle | null>(null)
  const [selectedBike2, setSelectedBike2] = useState<Motorcycle | null>(null)
  const [isSearching1, setIsSearching1] = useState(false)
  const [isSearching2, setIsSearching2] = useState(false)

  const searchRef1 = useRef<HTMLDivElement>(null)
  const searchRef2 = useRef<HTMLDivElement>(null)

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef1.current && !searchRef1.current.contains(event.target as Node)) {
        setShowSuggestions1(false)
      }
      if (searchRef2.current && !searchRef2.current.contains(event.target as Node)) {
        setShowSuggestions2(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Search for motorcycles - Input 1
  useEffect(() => {
    const searchMotorcycles = async () => {
      if (searchQuery1.length < 2) {
        setSuggestions1([])
        setShowSuggestions1(false)
        return
      }

      setIsSearching1(true)
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/bikes?search=${encodeURIComponent(searchQuery1)}&limit=8`,
        )
        if (response.ok) {
          const data = await response.json()
          setSuggestions1((data.bikes || []).map(transformMotorcycleData))
          setShowSuggestions1(true)
        }
      } catch (error) {
        console.error("Search error:", error)
        setSuggestions1([])
      } finally {
        setIsSearching1(false)
      }
    }

    const timeoutId = setTimeout(searchMotorcycles, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery1])

  // Search for motorcycles - Input 2
  useEffect(() => {
    const searchMotorcycles = async () => {
      if (searchQuery2.length < 2) {
        setSuggestions2([])
        setShowSuggestions2(false)
        return
      }

      setIsSearching2(true)
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/bikes?search=${encodeURIComponent(searchQuery2)}&limit=8`,
        )
        if (response.ok) {
          const data = await response.json()
          setSuggestions2((data.bikes || []).map(transformMotorcycleData))
          setShowSuggestions2(true)
        }
      } catch (error) {
        console.error("Search error:", error)
        setSuggestions2([])
      } finally {
        setIsSearching2(false)
      }
    }

    const timeoutId = setTimeout(searchMotorcycles, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery2])

  const handleSelectBike1 = (bike: Motorcycle) => {
    setSelectedBike1(bike)
    setSearchQuery1("")
    setShowSuggestions1(false)
  }

  const handleSelectBike2 = (bike: Motorcycle) => {
    setSelectedBike2(bike)
    setSearchQuery2("")
    setShowSuggestions2(false)
  }

  const getCategoryIcon = (category: string) => {
    const iconClass = "w-6 h-6"
    switch (category?.toLowerCase()) {
      case "sport":
        return <Flag className={iconClass} />
      case "cruiser":
        return <Bike className={iconClass} />
      case "adventure":
        return <Mountain className={iconClass} />
      case "enduro":
        return <Trees className={iconClass} />
      case "scooter":
        return <Bike className={iconClass} />
      case "touring":
        return <Map className={iconClass} />
      case "naked":
        return <Zap className={iconClass} />
      default:
        return <Bike className={iconClass} />
    }
  }

  // Extract numeric value from string (e.g., "26.6 HP" -> 26.6)
  const extractNumber = (value?: string): number | null => {
    if (!value) return null
    const match = value.match(/[\d.]+/)
    return match ? parseFloat(match[0]) : null
  }

  // Determine if higher is better for the spec
  const isHigherBetter = (label: string): boolean => {
    const lowerIsBetter = ["Dry Weight", "Wet Weight", "Kuru Ağırlık", "Yaş Ağırlık"]
    return !lowerIsBetter.some(term => label.includes(term))
  }

  const renderSpecRow = (label: string, value1?: string, value2?: string, isNumeric: boolean = true) => {
    // Hide row if both values are empty
    if (!value1 && !value2) return null

    const isDifferent = value1 !== value2 && value1 && value2
    let value1Class = "text-muted-foreground"
    let value2Class = "text-muted-foreground"

    // Compare numeric values and color code them
    if (isDifferent && isNumeric) {
      const num1 = extractNumber(value1)
      const num2 = extractNumber(value2)

      if (num1 !== null && num2 !== null) {
        const higherBetter = isHigherBetter(label)

        if (higherBetter) {
          // Higher is better (power, torque, etc.)
          if (num1 > num2) {
            value1Class = "font-bold text-green-500"
            value2Class = "font-semibold text-red-400"
          } else if (num2 > num1) {
            value2Class = "font-bold text-green-500"
            value1Class = "font-semibold text-red-400"
          }
        } else {
          // Lower is better (weight)
          if (num1 < num2) {
            value1Class = "font-bold text-green-500"
            value2Class = "font-semibold text-red-400"
          } else if (num2 < num1) {
            value2Class = "font-bold text-green-500"
            value1Class = "font-semibold text-red-400"
          }
        }
      } else if (isDifferent) {
        // Non-numeric but different
        value1Class = "font-semibold text-foreground"
        value2Class = "font-semibold text-foreground"
      }
    } else if (isDifferent && !isNumeric) {
      // Non-numeric comparison
      value1Class = "font-semibold text-foreground"
      value2Class = "font-semibold text-foreground"
    }

    // Determine winner for visual indicators
    const isValue1Winner = value1Class.includes('green')
    const isValue2Winner = value2Class.includes('green')
    const isValue1Loser = value1Class.includes('red')
    const isValue2Loser = value2Class.includes('red')
    const isTie = value1 === value2 && value1 && value2

    // Desktop view - side by side
    return (
      <>
        {/* Desktop View */}
        <div className="hidden md:grid grid-cols-[1fr_auto_1fr] gap-4 py-4 border-b border-border/20 last:border-0 hover:bg-secondary/10 transition-all rounded-lg px-3 group">
          <div className={`relative text-right ${value1Class} text-base px-4 py-2 rounded-lg transition-all ${isValue1Winner ? 'bg-green-500/10 border border-green-500/30 shadow-sm' :
            isValue1Loser ? 'bg-red-400/10 border border-red-400/30 shadow-sm' :
              isTie ? 'bg-blue-500/5 border border-blue-500/20' :
                'bg-transparent'
            }`}>
            {isValue1Winner && (
              <Trophy className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500" />
            )}
            {isTie && value1 && (
              <Handshake className="absolute -top-1 -right-1 w-4 h-4 text-blue-500" />
            )}
            {value1 || <span className="text-muted-foreground/40">-</span>}
          </div>
          <div className="text-sm font-semibold text-muted-foreground px-6 min-w-[140px] text-center self-center">
            {label}
          </div>
          <div className={`relative text-left ${value2Class} text-base px-4 py-2 rounded-lg transition-all ${isValue2Winner ? 'bg-green-500/10 border border-green-500/30 shadow-sm' :
            isValue2Loser ? 'bg-red-400/10 border border-red-400/30 shadow-sm' :
              isTie ? 'bg-blue-500/5 border border-blue-500/20' :
                'bg-transparent'
            }`}>
            {isValue2Winner && (
              <Trophy className="absolute -top-1 -left-1 w-4 h-4 text-yellow-500" />
            )}
            {isTie && value2 && (
              <Handshake className="absolute -top-1 -left-1 w-4 h-4 text-blue-500" />
            )}
            {value2 || <span className="text-muted-foreground/40">-</span>}
          </div>
        </div>

        {/* Mobile View - Stacked */}
        <div className="md:hidden border-b border-border/20 last:border-0 py-3">
          <div className="text-xs font-semibold text-muted-foreground mb-2 text-center uppercase tracking-wide">
            {label}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className={`relative text-center p-3 rounded-lg transition-all ${isValue1Winner ? 'bg-green-500/10 border-2 border-green-500/40 shadow-lg shadow-green-500/10' :
              isValue1Loser ? 'bg-red-400/10 border-2 border-red-400/40 shadow-lg shadow-red-400/10' :
                isTie ? 'bg-blue-500/10 border-2 border-blue-500/30' :
                  'bg-primary/5 border border-primary/20'
              } ${value1Class}`}>
              {isValue1Winner && (
                <Trophy className="absolute -top-2 -right-2 w-5 h-5 text-yellow-500" />
              )}
              {isTie && value1 && (
                <Handshake className="absolute -top-2 -right-2 w-5 h-5 text-blue-500" />
              )}
              <div className="text-xs text-muted-foreground mb-1 truncate px-1">
                {selectedBike1?.Model}
              </div>
              <div className="font-bold text-sm">{value1 || <span className="text-muted-foreground/40">-</span>}</div>
            </div>
            <div className={`relative text-center p-3 rounded-lg transition-all ${isValue2Winner ? 'bg-green-500/10 border-2 border-green-500/40 shadow-lg shadow-green-500/10' :
              isValue2Loser ? 'bg-red-400/10 border-2 border-red-400/40 shadow-lg shadow-red-400/10' :
                isTie ? 'bg-blue-500/10 border-2 border-blue-500/30' :
                  'bg-primary/5 border border-primary/20'
              } ${value2Class}`}>
              {isValue2Winner && (
                <Trophy className="absolute -top-2 -left-2 w-5 h-5 text-yellow-500" />
              )}
              {isTie && value2 && (
                <Handshake className="absolute -top-2 -left-2 w-5 h-5 text-blue-500" />
              )}
              <div className="text-xs text-muted-foreground mb-1 truncate px-1">
                {selectedBike2?.Model}
              </div>
              <div className="font-bold text-sm">{value2 || <span className="text-muted-foreground/40">-</span>}</div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/10">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/95 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all hover:gap-3 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">{t("compare.backToCatalog")}</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Title with gradient */}
        <div className="text-center mb-10 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
            {t("compare.title")}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            {t("compare.subtitle")}
          </p>
        </div>

        {/* VS Badge - Mobile */}
        {selectedBike1 && selectedBike2 && (
          <div className="md:hidden flex justify-center mb-6 animate-in zoom-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-red-500 to-primary blur-lg opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-primary via-red-500 to-primary px-8 py-3 rounded-full shadow-xl border-2 border-white/20">
                <span className="text-2xl font-black text-white tracking-widest">VS</span>
              </div>
            </div>
          </div>
        )}

        {/* Search Inputs */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-5xl mx-auto">
          {/* VS Badge - Desktop Only */}
          {selectedBike1 && selectedBike2 && (
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 animate-in zoom-in duration-500 delay-300">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-red-500 to-primary blur-xl opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-primary via-red-500 to-primary p-4 rounded-2xl shadow-2xl border-2 border-white/20 hover:scale-110 transition-transform">
                  <span className="text-3xl font-black text-white tracking-wider drop-shadow-lg">VS</span>
                </div>
              </div>
            </div>
          )}

          {/* Search Input 1 */}
          <div ref={searchRef1} className="relative group">
            {selectedBike1 ? (
              <div className="relative bg-gradient-to-br from-primary/10 via-secondary/20 to-background border-2 border-primary/40 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/60 hover:scale-[1.02] animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute -top-3 -left-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  Motor 1
                </div>
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center shadow-md ring-2 ring-primary/20 text-primary">
                        {getCategoryIcon(selectedBike1.Category)}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-lg">
                          {selectedBike1.Brand} {selectedBike1.Model}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <span className="font-medium">{selectedBike1.Year}</span>
                          <span className="text-xs">•</span>
                          <span>{selectedBike1.Category}</span>
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
                      onClick={() => setSelectedBike1(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {(selectedBike1.Displacement || selectedBike1.Power) && (
                    <div className="flex gap-3 pt-3 border-t border-border/30">
                      {selectedBike1.Displacement && (
                        <div className="flex-1 bg-background/50 rounded-lg px-3 py-2">
                          <span className="text-xs text-muted-foreground block mb-0.5">Displacement</span>
                          <span className="font-bold text-foreground text-sm">{selectedBike1.Displacement}</span>
                        </div>
                      )}
                      {selectedBike1.Power && (
                        <div className="flex-1 bg-background/50 rounded-lg px-3 py-2">
                          <span className="text-xs text-muted-foreground block mb-0.5">Power</span>
                          <span className="font-bold text-foreground text-sm">{selectedBike1.Power}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-colors" />
                  <Input
                    type="text"
                    placeholder={t("compare.searchPlaceholder1")}
                    value={searchQuery1}
                    onChange={(e) => setSearchQuery1(e.target.value)}
                    onFocus={() => searchQuery1.length >= 2 && setShowSuggestions1(true)}
                    className="pl-12 h-14 bg-gradient-to-br from-secondary/40 to-secondary/20 border-2 border-border/50 rounded-2xl text-base font-medium placeholder:text-muted-foreground/60 focus:border-primary/50 focus:bg-background transition-all shadow-sm hover:shadow-md"
                  />
                </div>

                {showSuggestions1 && (
                  <div className="absolute left-0 right-0 mt-3 bg-background/95 backdrop-blur-xl border-2 border-border/50 rounded-2xl shadow-2xl max-h-[320px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {isSearching1 && (
                      <div className="p-6 text-center text-muted-foreground">
                        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                        <span className="text-sm font-medium">{t("compare.searching")}</span>
                      </div>
                    )}

                    {!isSearching1 && suggestions1.length === 0 && (
                      <div className="p-6 text-center text-muted-foreground">
                        <span className="text-sm font-medium">{t("compare.noResults")}</span>
                      </div>
                    )}

                    {!isSearching1 &&
                      suggestions1.map((bike, index) => (
                        <div
                          key={bike._id}
                          onClick={() => handleSelectBike1(bike)}
                          className="p-4 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 cursor-pointer border-b border-border/20 last:border-b-0 transition-all duration-200 group"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all text-primary">
                              {getCategoryIcon(bike.Category)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                                {bike.Brand} {bike.Model}
                              </h4>
                              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                <span>{bike.Year}</span>
                                <span className="text-xs">•</span>
                                <span>{bike.Category}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Search Input 2 */}
          <div ref={searchRef2} className="relative group">
            {selectedBike2 ? (
              <div className="relative bg-gradient-to-br from-primary/10 via-secondary/20 to-background border-2 border-primary/40 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/60 hover:scale-[1.02] animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  Motor 2
                </div>
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center shadow-md ring-2 ring-primary/20 text-primary">
                        {getCategoryIcon(selectedBike2.Category)}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-lg">
                          {selectedBike2.Brand} {selectedBike2.Model}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <span className="font-medium">{selectedBike2.Year}</span>
                          <span className="text-xs">•</span>
                          <span>{selectedBike2.Category}</span>
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
                      onClick={() => setSelectedBike2(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {(selectedBike2.Displacement || selectedBike2.Power) && (
                    <div className="flex gap-3 pt-3 border-t border-border/30">
                      {selectedBike2.Displacement && (
                        <div className="flex-1 bg-background/50 rounded-lg px-3 py-2">
                          <span className="text-xs text-muted-foreground block mb-0.5">Displacement</span>
                          <span className="font-bold text-foreground text-sm">{selectedBike2.Displacement}</span>
                        </div>
                      )}
                      {selectedBike2.Power && (
                        <div className="flex-1 bg-background/50 rounded-lg px-3 py-2">
                          <span className="text-xs text-muted-foreground block mb-0.5">Power</span>
                          <span className="font-bold text-foreground text-sm">{selectedBike2.Power}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-colors" />
                  <Input
                    type="text"
                    placeholder={t("compare.searchPlaceholder2")}
                    value={searchQuery2}
                    onChange={(e) => setSearchQuery2(e.target.value)}
                    onFocus={() => searchQuery2.length >= 2 && setShowSuggestions2(true)}
                    className="pl-12 h-14 bg-gradient-to-br from-secondary/40 to-secondary/20 border-2 border-border/50 rounded-2xl text-base font-medium placeholder:text-muted-foreground/60 focus:border-primary/50 focus:bg-background transition-all shadow-sm hover:shadow-md"
                  />
                </div>

                {showSuggestions2 && (
                  <div className="absolute left-0 right-0 mt-3 bg-background/95 backdrop-blur-xl border-2 border-border/50 rounded-2xl shadow-2xl max-h-[320px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {isSearching2 && (
                      <div className="p-6 text-center text-muted-foreground">
                        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                        <span className="text-sm font-medium">{t("compare.searching")}</span>
                      </div>
                    )}

                    {!isSearching2 && suggestions2.length === 0 && (
                      <div className="p-6 text-center text-muted-foreground">
                        <span className="text-sm font-medium">{t("compare.noResults")}</span>
                      </div>
                    )}

                    {!isSearching2 &&
                      suggestions2.map((bike, index) => (
                        <div
                          key={bike._id}
                          onClick={() => handleSelectBike2(bike)}
                          className="p-4 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 cursor-pointer border-b border-border/20 last:border-b-0 transition-all duration-200 group"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all text-primary">
                              {getCategoryIcon(bike.Category)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                                {bike.Brand} {bike.Model}
                              </h4>
                              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                <span>{bike.Year}</span>
                                <span className="text-xs">•</span>
                                <span>{bike.Category}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        {selectedBike1 && selectedBike2 && (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Legend with animation */}
            <div className="mb-6 p-5 bg-gradient-to-r from-secondary/30 via-secondary/20 to-secondary/30 border border-border/40 rounded-2xl shadow-md backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-in fade-in zoom-in-95 duration-500 delay-500">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2.5 px-4 py-2 bg-background/50 rounded-full hover:bg-background/70 transition-colors hover:scale-105 transform duration-200">
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50 animate-pulse"></div>
                  <span className="text-foreground font-medium">{t("compare.better")}</span>
                </div>
                <div className="flex items-center gap-2.5 px-4 py-2 bg-background/50 rounded-full hover:bg-background/70 transition-colors hover:scale-105 transform duration-200">
                  <div className="w-3 h-3 rounded-full bg-red-400 shadow-lg shadow-red-400/50 animate-pulse"></div>
                  <span className="text-foreground font-medium">{t("compare.worse")}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-secondary/20 via-background to-secondary/10 border border-border/40 rounded-2xl overflow-hidden shadow-xl">
              {/* Engine & Performance */}
              {(selectedBike1.Displacement || selectedBike2.Displacement ||
                selectedBike1.Power || selectedBike2.Power ||
                selectedBike1.Torque || selectedBike2.Torque ||
                selectedBike1.EngineType || selectedBike2.EngineType ||
                selectedBike1.Bore || selectedBike2.Bore ||
                selectedBike1.Stroke || selectedBike2.Stroke ||
                selectedBike1.Compression || selectedBike2.Compression) && (
                  <div className="p-4 md:p-8 border-b border-border/30 bg-gradient-to-r from-transparent via-secondary/5 to-transparent">
                    <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4 md:mb-6 text-center">
                      {t("specs.enginePerformance")}
                    </h2>
                    <div className="space-y-1">
                      {renderSpecRow(t("detail.displacement"), selectedBike1.Displacement, selectedBike2.Displacement)}
                      {renderSpecRow(t("detail.power"), selectedBike1.Power, selectedBike2.Power)}
                      {renderSpecRow(t("compare.torque"), selectedBike1.Torque, selectedBike2.Torque)}
                      {renderSpecRow(t("compare.engineType"), selectedBike1.EngineType, selectedBike2.EngineType, false)}
                      {renderSpecRow(t("compare.bore"), selectedBike1.Bore, selectedBike2.Bore)}
                      {renderSpecRow(t("compare.stroke"), selectedBike1.Stroke, selectedBike2.Stroke)}
                      {renderSpecRow(t("compare.compression"), selectedBike1.Compression, selectedBike2.Compression)}
                    </div>
                  </div>
                )}

              {/* Fuel & Injection */}
              {(selectedBike1.FuelSystem || selectedBike2.FuelSystem ||
                selectedBike1.FuelControl || selectedBike2.FuelControl ||
                selectedBike1.Ignition || selectedBike2.Ignition ||
                selectedBike1.FuelCapacity || selectedBike2.FuelCapacity ||
                selectedBike1.CoolingSystem || selectedBike2.CoolingSystem ||
                selectedBike1.Starter || selectedBike2.Starter) && (
                  <div className="p-4 md:p-8 border-b border-border/30 bg-gradient-to-r from-transparent via-secondary/5 to-transparent">
                    <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4 md:mb-6 text-center">
                      {t("specs.fuelInjection")}
                    </h2>
                    <div className="space-y-1">
                      {renderSpecRow(t("compare.fuelSystem"), selectedBike1.FuelSystem, selectedBike2.FuelSystem, false)}
                      {renderSpecRow(t("compare.fuelControl"), selectedBike1.FuelControl, selectedBike2.FuelControl, false)}
                      {renderSpecRow(t("compare.ignition"), selectedBike1.Ignition, selectedBike2.Ignition, false)}
                      {renderSpecRow(t("compare.fuelCapacity"), selectedBike1.FuelCapacity, selectedBike2.FuelCapacity)}
                      {renderSpecRow(t("compare.cooling"), selectedBike1.CoolingSystem, selectedBike2.CoolingSystem, false)}
                      {renderSpecRow(t("compare.starter"), selectedBike1.Starter, selectedBike2.Starter, false)}
                    </div>
                  </div>
                )}

              {/* Transmission */}
              {(selectedBike1.Gearbox || selectedBike2.Gearbox ||
                selectedBike1.TransmissionType || selectedBike2.TransmissionType ||
                selectedBike1.Clutch || selectedBike2.Clutch) && (
                  <div className="p-4 md:p-8 border-b border-border/30 bg-gradient-to-r from-transparent via-secondary/5 to-transparent">
                    <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4 md:mb-6 text-center">
                      {t("specs.transmissionDrive")}
                    </h2>
                    <div className="space-y-1">
                      {renderSpecRow(t("compare.gearbox"), selectedBike1.Gearbox, selectedBike2.Gearbox, false)}
                      {renderSpecRow(t("compare.transmission"), selectedBike1.TransmissionType, selectedBike2.TransmissionType, false)}
                      {renderSpecRow(t("compare.clutch"), selectedBike1.Clutch, selectedBike2.Clutch, false)}

                    </div>
                  </div>
                )}

              {/* Chassis & Suspension */}
              {(selectedBike1.FrameType || selectedBike2.FrameType ||
                selectedBike1.FrontSuspension || selectedBike2.FrontSuspension ||
                selectedBike1.RearSuspension || selectedBike2.RearSuspension ||
                selectedBike1.FrontWheelTravel || selectedBike2.FrontWheelTravel ||
                selectedBike1.RearWheelTravel || selectedBike2.RearWheelTravel) && (
                  <div className="p-4 md:p-8 border-b border-border/30 bg-gradient-to-r from-transparent via-secondary/5 to-transparent">
                    <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4 md:mb-6 text-center">
                      {t("compare.chassisSuspension")}
                    </h2>
                    <div className="space-y-1">
                      {renderSpecRow(t("compare.frame"), selectedBike1.FrameType, selectedBike2.FrameType, false)}
                      {renderSpecRow(t("compare.frontSuspension"), selectedBike1.FrontSuspension, selectedBike2.FrontSuspension, false)}
                      {renderSpecRow(t("compare.rearSuspension"), selectedBike1.RearSuspension, selectedBike2.RearSuspension, false)}
                      {renderSpecRow(t("compare.frontTravel"), selectedBike1.FrontWheelTravel, selectedBike2.FrontWheelTravel)}
                      {renderSpecRow(t("compare.rearTravel"), selectedBike1.RearWheelTravel, selectedBike2.RearWheelTravel)}
                    </div>
                  </div>
                )}

              {/* Brakes */}
              {(selectedBike1.FrontBrakes || selectedBike2.FrontBrakes ||
                selectedBike1.RearBrakes || selectedBike2.RearBrakes) && (
                  <div className="p-4 md:p-8 border-b border-border/30 bg-gradient-to-r from-transparent via-secondary/5 to-transparent">
                    <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4 md:mb-6 text-center">
                      {t("specs.brakeSystem")}
                    </h2>
                    <div className="space-y-1">
                      {renderSpecRow(t("compare.frontBrakes"), selectedBike1.FrontBrakes, selectedBike2.FrontBrakes, false)}
                      {renderSpecRow(t("compare.rearBrakes"), selectedBike1.RearBrakes, selectedBike2.RearBrakes, false)}
                    </div>
                  </div>
                )}

              {/* Wheels & Tires */}
              {(selectedBike1.FrontTire || selectedBike2.FrontTire ||
                selectedBike1.RearTire || selectedBike2.RearTire ||
                selectedBike1.FrontWheel || selectedBike2.FrontWheel ||
                selectedBike1.RearWheel || selectedBike2.RearWheel) && (
                  <div className="p-4 md:p-8 border-b border-border/30 bg-gradient-to-r from-transparent via-secondary/5 to-transparent">
                    <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4 md:mb-6 text-center">
                      {t("specs.tiresWheels")}
                    </h2>
                    <div className="space-y-1">
                      {renderSpecRow(t("compare.frontTyre"), selectedBike1.FrontTire, selectedBike2.FrontTire, false)}
                      {renderSpecRow(t("compare.rearTyre"), selectedBike1.RearTire, selectedBike2.RearTire, false)}
                      {renderSpecRow(t("compare.frontWheel"), selectedBike1.FrontWheel, selectedBike2.FrontWheel, false)}
                      {renderSpecRow(t("compare.rearWheel"), selectedBike1.RearWheel, selectedBike2.RearWheel, false)}
                    </div>
                  </div>
                )}

              {/* Dimensions & Weight */}
              {(selectedBike1.OverallLength || selectedBike2.OverallLength ||
                selectedBike1.OverallWidth || selectedBike2.OverallWidth ||
                selectedBike1.OverallHeight || selectedBike2.OverallHeight ||
                selectedBike1.SeatHeight || selectedBike2.SeatHeight ||
                selectedBike1.Wheelbase || selectedBike2.Wheelbase ||
                selectedBike1.GroundClearance || selectedBike2.GroundClearance ||
                selectedBike1.DryWeight || selectedBike2.DryWeight ||
                selectedBike1.WetWeight || selectedBike2.WetWeight) && (
                  <div className="p-4 md:p-8 bg-gradient-to-r from-transparent via-secondary/5 to-transparent">
                    <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4 md:mb-6 text-center">
                      {t("specs.dimensionsWeight")}
                    </h2>
                    <div className="space-y-1">
                      {renderSpecRow(t("compare.length"), selectedBike1.OverallLength, selectedBike2.OverallLength)}
                      {renderSpecRow(t("compare.width"), selectedBike1.OverallWidth, selectedBike2.OverallWidth)}
                      {renderSpecRow(t("compare.height"), selectedBike1.OverallHeight, selectedBike2.OverallHeight)}
                      {renderSpecRow(t("compare.seatHeight"), selectedBike1.SeatHeight, selectedBike2.SeatHeight)}
                      {renderSpecRow(t("compare.wheelbase"), selectedBike1.Wheelbase, selectedBike2.Wheelbase)}
                      {renderSpecRow(t("compare.groundClearance"), selectedBike1.GroundClearance, selectedBike2.GroundClearance)}
                      {renderSpecRow(t("compare.dryWeight"), selectedBike1.DryWeight, selectedBike2.DryWeight)}
                      {renderSpecRow(t("compare.wetWeight"), selectedBike1.WetWeight, selectedBike2.WetWeight)}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedBike1 && !selectedBike2 && (
          <div className="text-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-2xl flex items-center justify-center shadow-lg border border-primary/20">
                <Search className="h-12 w-12 text-primary/60" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              {t("compare.emptyTitle")}
            </h3>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              {t("compare.emptyDescription")}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
