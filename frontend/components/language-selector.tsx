"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"

export function LanguageSelector() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="flex gap-1">
      <Button
        variant={language === "en" ? "default" : "ghost"}
        size="sm"
        onClick={toggleLanguage}
        className="h-6 px-2 text-sm cursor-pointer"
      >
        EN
      </Button>
      <Button
        variant={language === "tr" ? "default" : "ghost"}
        size="sm"
        onClick={toggleLanguage}
        className="h-6 px-2 text-sm cursor-pointer"
      >
        TR
      </Button>
    </div>
  )
}
