"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gauge, Zap, DatabaseZap } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Motorcycle } from "@shared/types"

interface MotorcycleCardProps {
  motorcycle: Motorcycle
  onClick: () => void
}

export function MotorcycleCard({ motorcycle, onClick }: MotorcycleCardProps) {
  const { t } = useLanguage()
  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border-border bg-card"
      onClick={onClick}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="space-y-2 mb-4">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2 cursor-pointer">
              {motorcycle.Model}
            </h3>
            <Badge
              variant="default"
              className="ml-2 shrink-0 bg-primary text-primary-foreground font-bold text-sm px-3 py-1 cursor-pointer"
            >
              {motorcycle.Year}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground cursor-pointer">{motorcycle.Brand}</p>
        </div>

        {/* Category Badge */}
        <div className="mb-4">
          <Badge variant="outline" className="text-xs cursor-pointer">
            {motorcycle.Category}
          </Badge>
        </div>

        {/* Specs Grid */}
        <div className="flex flex-col gap-2 text-sm ">
          {motorcycle.Displacement && (
            <div className="flex items-center space-x-2">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground truncate">{motorcycle.Displacement}</span>
            </div>
          )}

          {motorcycle.Power && (
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground truncate">{motorcycle.Power}</span>
            </div>
          )}

          {motorcycle.EngineType && (
            <div className="flex items-center space-x-2 col-span-2">
              <DatabaseZap className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground truncate">{motorcycle.EngineType}</span>
            </div>
          )}
        </div>

        {/* Hover Effect */}
        <div className="mt-4 pt-4 border-t border-border transition-opacity">
          <p className="text-sm text-primary cursor-pointer">{t("card.viewDetails") ?? "View Details →"}</p>
        </div>
      </CardContent>
    </Card>
  )
}
