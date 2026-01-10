"use client"

import type React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Loader2, Bike, Flag, Mountain, Trees, Map, Zap, Settings, Activity, Fuel, Thermometer, Key, RefreshCw, Circle, Disc, Lightbulb, Ruler, MoveHorizontal, MoveVertical, Weight, Sparkles, Square, Palette, BarChart, Folder, Calendar, Wrench } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Motorcycle } from "@shared/types"
import { transformMotorcycleData } from "@shared/utils"
import { API_CONFIG } from "@shared/constants"

export default function MotorcycleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { t } = useLanguage()
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMotorcycle = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`${API_CONFIG.BASE_URL}/bikes/${params.id}`)

        if (!response.ok) {
          throw new Error("Motor detayları yüklenirken bir hata oluştu")
        }

        const data = await response.json()
        setMotorcycle(transformMotorcycleData(data))
      } catch (err) {
        console.error("Motor detayları yüklenirken hata:", err)
        setError(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchMotorcycle()
    }
  }, [params.id])

  const hasDataInSection = useCallback((motorcycle: Motorcycle, fields: string[]): boolean => {
    return fields.some((field) => {
      const value = motorcycle[field]
      return value != null && String(value).trim() !== ""
    })
  }, [])

  const renderSection = useCallback((
    title: string,
    icon: React.ReactNode,
    fields: string[],
    motorcycle: Motorcycle,
    renderContent: () => React.ReactNode,
  ) => {
    if (!hasDataInSection(motorcycle, fields)) {
      return null
    }

    return (
      <div className="bg-card/50 border border-border/50 rounded-lg p-4 hover:border-primary/30 transition-colors">
        <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="text-primary">{icon}</span>
          {title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{renderContent()}</div>
      </div>
    )
  }, [hasDataInSection])

  const renderField = useCallback((label: string, value: string | undefined, icon?: React.ReactNode) => {
    if (!value || String(value).trim() === "") return null
    return (
      <div className="flex items-start gap-2 p-2 rounded-md bg-background/50">
        {icon && <span className="text-primary mt-0.5">{icon}</span>}
        <div className="flex-1 min-w-0">
          <dt className="text-xs text-muted-foreground">{label}</dt>
          <dd className="text-sm font-medium text-foreground truncate">{value}</dd>
        </div>
      </div>
    )
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSearch={() => { }} searchQuery="" />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">{t("catalog.loading")}</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !motorcycle) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSearch={() => { }} searchQuery="" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error || "Motor bulunamadı"}</p>
            <Button onClick={() => router.push("/catalog")} className="cursor-pointer">
              {t("detail.backToCatalog")}
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={() => { }} searchQuery="" />
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <Button
          variant="default"
          onClick={() => router.push("/catalog")}
          className="mb-4 md:mb-6 cursor-pointer"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {t("detail.backToCatalog")}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-lg p-6 border border-border/50">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Bike className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-1">{motorcycle.Model}</h1>
                  <p className="text-lg text-muted-foreground mb-3">
                    {motorcycle.Brand} • {motorcycle.Year}
                  </p>
                  {motorcycle.Category && (
                    <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                      <span>
                        {motorcycle.Category === "Sport"
                          ? <Flag className="w-4 h-4" />
                          : motorcycle.Category === "Cruiser"
                            ? <Bike className="w-4 h-4" />
                            : motorcycle.Category === "Adventure"
                              ? <Mountain className="w-4 h-4" />
                              : motorcycle.Category === "Enduro"
                                ? <Trees className="w-4 h-4" />
                                : motorcycle.Category === "Scooter"
                                  ? <Bike className="w-4 h-4" />
                                  : motorcycle.Category === "Touring"
                                    ? <Map className="w-4 h-4" />
                                    : motorcycle.Category === "Naked"
                                      ? <Zap className="w-4 h-4" />
                                      : <Bike className="w-4 h-4" />}
                      </span>
                      <span>{motorcycle.Category}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {renderSection(
              t("specs.enginePerformance"),
              <Settings className="w-5 h-5" />,
              ["Displacement", "Power", "EngineType", "TopSpeed", "Torque", "ValvesPerCylinder"],
              motorcycle,
              () => (
                <>
                  {renderField(t("detail.displacement"), motorcycle.Displacement, <Wrench className="w-4 h-4" />)}
                  {renderField(t("detail.power"), motorcycle.Power, <Zap className="w-4 h-4" />)}
                  {renderField("Engine Type", motorcycle.EngineType, <Settings className="w-4 h-4" />)}
                  {renderField("Top Speed", motorcycle.TopSpeed, <Flag className="w-4 h-4" />)}
                  {renderField("Torque", motorcycle.Torque, <Activity className="w-4 h-4" />)}
                  {renderField("Valves/Cyl", motorcycle.ValvesPerCylinder, <Settings className="w-4 h-4" />)}
                </>
              ),
            )}

            {renderSection(
              t("specs.fuelInjection"),
              <Fuel className="w-5 h-5" />,
              ["FuelSystem", "FuelCapacity", "FuelControl"],
              motorcycle,
              () => (
                <>
                  {renderField("Fuel System", motorcycle.FuelSystem, <Activity className="w-4 h-4" />)}
                  {renderField("Fuel Capacity", motorcycle.FuelCapacity, <Fuel className="w-4 h-4" />)}
                  {renderField("Fuel Control", motorcycle.FuelControl, <Settings className="w-4 h-4" />)}
                </>
              ),
            )}

            {renderSection(
              t("specs.coolingStarter"),
              <Thermometer className="w-5 h-5" />,
              ["CoolingSystem", "Starter", "Electrical"],
              motorcycle,
              () => (
                <>
                  {renderField("Cooling System", motorcycle.CoolingSystem, <Thermometer className="w-4 h-4" />)}
                  {renderField("Starter", motorcycle.Starter, <Key className="w-4 h-4" />)}
                  {renderField("Electrical", motorcycle.Electrical, <Zap className="w-4 h-4" />)}
                </>
              ),
            )}

            {renderSection(
              t("specs.transmissionDrive"),
              <RefreshCw className="w-5 h-5" />,
              ["Gearbox", "TransmissionType", "Clutch"],
              motorcycle,
              () => (
                <>
                  {renderField("Gearbox", motorcycle.Gearbox, <Settings className="w-4 h-4" />)}
                  {renderField("Transmission", motorcycle.TransmissionType, <RefreshCw className="w-4 h-4" />)}
                  {renderField("Clutch", motorcycle.Clutch, <Circle className="w-4 h-4" />)}
                </>
              ),
            )}

            {renderSection(
              t("specs.brakeSystem"),
              <Disc className="w-5 h-5" />,
              ["FrontBrakes", "RearBrakes", "Diameter"],
              motorcycle,
              () => (
                <>
                  {renderField("Front Brakes", motorcycle.FrontBrakes, <Disc className="w-4 h-4" />)}
                  {renderField("Rear Brakes", motorcycle.RearBrakes, <Disc className="w-4 h-4" />)}
                  {renderField("Diameter", motorcycle.Diameter, <Circle className="w-4 h-4" />)}
                </>
              ),
            )}

            {renderSection(
              t("specs.suspension"),
              <Settings className="w-5 h-5" />,
              ["FrontSuspension", "RearSuspension", "FrontWheelTravel", "RearWheelTravel"],
              motorcycle,
              () => (
                <>
                  {renderField("Front Suspension", motorcycle.FrontSuspension, <Wrench className="w-4 h-4" />)}
                  {renderField("Rear Suspension", motorcycle.RearSuspension, <Wrench className="w-4 h-4" />)}
                  {renderField("Front Travel", motorcycle.FrontWheelTravel, <MoveVertical className="w-4 h-4" />)}
                  {renderField("Rear Travel", motorcycle.RearWheelTravel, <MoveVertical className="w-4 h-4" />)}
                </>
              ),
            )}

            {renderSection(
              t("specs.tiresWheels"),
              <Disc className="w-5 h-5" />,
              ["FrontTire", "RearTire"],
              motorcycle,
              () => (
                <>
                  {renderField("Front Tire", motorcycle.FrontTire, <Disc className="w-4 h-4" />)}
                  {renderField("Rear Tire", motorcycle.RearTire, <Disc className="w-4 h-4" />)}
                </>
              ),
            )}

            {renderSection(t("specs.lighting"), <Lightbulb className="w-5 h-5" />, ["Light"], motorcycle, () => (
              <>{renderField("Light", motorcycle.Light, <Lightbulb className="w-4 h-4" />)}</>
            ))}

            {renderSection(
              t("specs.dimensionsWeight"),
              <Ruler className="w-5 h-5" />,
              [
                "OverallLength",
                "OverallWidth",
                "OverallHeight",
                "Wheelbase",
                "SeatHeight",
                "GroundClearance",
                "DryWeight",
                "WetWeight",
              ],
              motorcycle,
              () => (
                <>
                  {renderField("Length", motorcycle.OverallLength, <MoveHorizontal className="w-4 h-4" />)}
                  {renderField("Width", motorcycle.OverallWidth, <MoveHorizontal className="w-4 h-4" />)}
                  {renderField("Height", motorcycle.OverallHeight, <MoveVertical className="w-4 h-4" />)}
                  {renderField("Wheelbase", motorcycle.Wheelbase, <Ruler className="w-4 h-4" />)}
                  {renderField("Seat Height", motorcycle.SeatHeight, <MoveVertical className="w-4 h-4" />)}
                  {renderField("Ground Clearance", motorcycle.GroundClearance, <MoveVertical className="w-4 h-4" />)}
                  {renderField("Dry Weight", motorcycle.DryWeight, <Weight className="w-4 h-4" />)}
                  {renderField("Wet Weight", motorcycle.WetWeight, <Weight className="w-4 h-4" />)}
                </>
              ),
            )}

            {renderSection(
              t("specs.otherFeatures"),
              <Sparkles className="w-5 h-5" />,
              ["FrameType", "ColorOptions", "EngineDetails", "PowerWeightRatio"],
              motorcycle,
              () => (
                <>
                  {renderField("Frame Type", motorcycle.FrameType, <Square className="w-4 h-4" />)}
                  {renderField("Colors", motorcycle.ColorOptions, <Palette className="w-4 h-4" />)}
                  {renderField("Engine Details", motorcycle.EngineDetails, <Settings className="w-4 h-4" />)}
                  {renderField("Power/Weight", motorcycle.PowerWeightRatio, <BarChart className="w-4 h-4" />)}
                </>
              ),
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card/50 border border-border/50 rounded-lg p-4 sticky top-4">
              <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="text-primary"><BarChart className="w-5 h-5" /></span>
                {t("detail.quickInfo")}
              </h3>
              <div className="space-y-2">
                {motorcycle.Category && (
                  <div className="flex items-start gap-2 p-2 bg-background/50 rounded-md">
                    <span className="text-primary mt-0.5"><Folder className="w-4 h-4" /></span>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground block">{t("detail.category")}</span>
                      <p className="text-sm font-medium text-foreground">{motorcycle.Category}</p>
                    </div>
                  </div>
                )}
                {motorcycle.Displacement && (
                  <div className="flex items-start gap-2 p-2 bg-background/50 rounded-md">
                    <span className="text-primary mt-0.5"><Wrench className="w-4 h-4" /></span>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground block">{t("detail.displacement")}</span>
                      <p className="text-sm font-medium text-foreground truncate">{motorcycle.Displacement}</p>
                    </div>
                  </div>
                )}
                {motorcycle.Power && (
                  <div className="flex items-start gap-2 p-2 bg-background/50 rounded-md">
                    <span className="text-primary mt-0.5"><Zap className="w-4 h-4" /></span>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground block">{t("detail.power")}</span>
                      <p className="text-sm font-medium text-foreground truncate">{motorcycle.Power}</p>
                    </div>
                  </div>
                )}
                {motorcycle.Year && (
                  <div className="flex items-start gap-2 p-2 bg-background/50 rounded-md">
                    <span className="text-primary mt-0.5"><Calendar className="w-4 h-4" /></span>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground block">{t("detail.modelYear")}</span>
                      <p className="text-sm font-medium text-foreground">{motorcycle.Year}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
