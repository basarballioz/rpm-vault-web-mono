"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "tr"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Header
    "header.search": "Search for motorcycles...",
    "header.catalog": "Catalog",
    "header.compare": "Compare",
    "header.categories": "Categories",
    "header.sport": "Sport",
    "header.cruiser": "Cruiser",
    "header.adventure": "Adventure",

    // Homepage
    "home.hero.title": "Discover Your Perfect Motorcycle",
    "home.hero.subtitle": "Explore thousands of motorcycles from top brands worldwide",
    "home.hero.cta": "Browse Catalog",
    "home.stats.motorcycles": "Motorcycles",
    "home.stats.brands": "Brands",
    "home.stats.categories": "Categories",
    "home.why.title": "Why RPMVault?",
    "home.why.subtitle": "The most comprehensive and reliable data source in the motorcycle world",
    "home.why.card.catalog.title": "Comprehensive Catalog",
    "home.why.card.catalog.desc": "The world's largest motorcycle database. Thousands of models from every brand and category.",
    "home.why.card.search.title": "Smart Search",
    "home.why.card.search.desc": "Find the motorcycle you want in seconds with our advanced filtering system.",
    "home.why.card.details.title": "Detailed Information",
    "home.why.card.details.desc": "Engine displacement, power, torque, dimensions and more. Every detail at your fingertips.",
    "home.why.card.current.title": "Current Data",
    "home.why.card.current.desc": "Latest models and technical specifications with continuously updated database.",
    "home.why.card.community.title": "Community",
    "home.why.card.community.desc": "The platform trusted by thousands of motorcycle enthusiasts. Share your experiences.",
    "home.why.card.reliable.title": "Reliable",
    "home.why.card.reliable.desc": "Verified data and reliable sources. No room for misinformation.",
    "home.categories.title": "Popular Categories",
    "home.categories.subtitle": "Find the perfect motorcycle for your riding style",
    "home.cta.title": "Find Your Dream Motorcycle",
    "home.cta.subtitle": "Discover the most suitable motorcycle for you among thousands of models. Make the right choice with detailed comparisons and technical specifications.",
    "home.cta.button": "Start Searching",
    "home.brands.title": "Top Brands",
    "home.brands.subtitle": "Discover motorcycles from the world's leading manufacturers",

    // Catalog
    "catalog.title": "motorcycles found",
    "catalog.searchResults": "Results for",
    "catalog.sortBy": "Sort by",
    "catalog.sortNewest": "Newest First",
    "catalog.sortOldest": "Oldest First",
    "catalog.sortName": "Name A-Z",
    "catalog.page": "Page",
    "catalog.loading": "Loading motorcycles...",
    "catalog.error": "An error occurred",
    "catalog.retry": "Try Again",
    "catalog.clearFilters": "Clear Filters",
    "catalog.noResults": "No motorcycles found matching your criteria.",
    "catalog.previous": "Previous",
    "catalog.next": "Next",

    // Detail Page
    "detail.backToCatalog": "Back to Catalog",
    "detail.quickInfo": "Quick Info",
    "detail.category": "Category",
    "detail.displacement": "Engine Displacement",
    "detail.power": "Power",
    "detail.modelYear": "Model Year",

    // Technical Specifications
    // Cards / Common
    "card.viewDetails": "View Details →",
    "specs.enginePerformance": "Engine & Performance",
    "specs.fuelInjection": "Fuel & Injection System",
    "specs.coolingStarter": "Cooling & Starter",
    "specs.transmissionDrive": "Transmission & Drive",
    "specs.brakeSystem": "Brake System",
    "specs.suspension": "Suspension",
    "specs.tiresWheels": "Tires & Wheels",
    "specs.lighting": "Lighting",
    "specs.dimensionsWeight": "Dimensions & Weight",
    "specs.otherFeatures": "Other Features",

    // Filters
    "filters.title": "Filters",
    "filters.active": "Active Filters",
    "filters.categories": "Categories",
    "filters.brands": "Brands",
    "filters.clearAll": "Clear All",
    "filters.searchCategories": "Search categories...",
    "filters.searchBrands": "Search brands...",
    "filters.noResults": "No results found",

    // Footer
    "footer.about": "About",
    "footer.contact": "Contact",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "footer.rights": "All rights reserved.",

    // Compare Page
    "compare.title": "Compare Motorcycles",
    "compare.subtitle": "Select two motorcycles to compare their specifications side by side",
    "compare.backToCatalog": "Back to Catalog",
    "compare.searchPlaceholder1": "Search for first motorcycle...",
    "compare.searchPlaceholder2": "Search for second motorcycle...",
    "compare.searching": "Searching...",
    "compare.noResults": "No results found",
    "compare.emptyTitle": "Start Comparing",
    "compare.emptyDescription": "Search and select two motorcycles to see their detailed comparison",
    "compare.torque": "Torque",
    "compare.bore": "Bore",
    "compare.stroke": "Stroke",
    "compare.compression": "Compression Ratio",
    "compare.fuelSystem": "Fuel System",
    "compare.fuelControl": "Fuel Control",
    "compare.ignition": "Ignition",
    "compare.gearbox": "Gearbox",
    "compare.transmission": "Transmission",
    "compare.clutch": "Clutch",
    "compare.chassisSuspension": "Chassis & Suspension",
    "compare.frame": "Frame",
    "compare.frontSuspension": "Front Suspension",
    "compare.rearSuspension": "Rear Suspension",
    "compare.frontBrakes": "Front Brakes",
    "compare.rearBrakes": "Rear Brakes",
    "compare.frontTyre": "Front Tyre",
    "compare.rearTyre": "Rear Tyre",
    "compare.frontWheel": "Front Wheel",
    "compare.rearWheel": "Rear Wheel",
    "compare.seatHeight": "Seat Height",
    "compare.wheelbase": "Wheelbase",
    "compare.groundClearance": "Ground Clearance",
    "compare.dryWeight": "Dry Weight",
    "compare.wetWeight": "Wet Weight",
    "compare.fuelCapacity": "Fuel Capacity",
    "compare.better": "Better",
    "compare.worse": "Worse",
    "compare.engineType": "Engine Type",
    "compare.cooling": "Cooling System",
    "compare.starter": "Starter",
    "compare.frontTravel": "Front Travel",
    "compare.rearTravel": "Rear Travel",
    "compare.length": "Length",
    "compare.width": "Width",
    "compare.height": "Height",
  },
  tr: {
    // Header
    "header.search": "Hangi motosikleti arıyorsunuz?",
    "header.catalog": "Katalog",
    "header.compare": "Kıyasla",
    "header.categories": "Kategoriler",
    "header.sport": "Sport",
    "header.cruiser": "Cruiser",
    "header.adventure": "Adventure",

    // Homepage
    "home.hero.title": "Mükemmel Motosikletinizi Keşfedin",
    "home.hero.subtitle": "Dünya çapında önde gelen markalardan binlerce motosikleti keşfedin",
    "home.hero.cta": "Kataloğa Göz At",
    "home.stats.motorcycles": "Motosiklet",
    "home.stats.brands": "Marka",
    "home.stats.categories": "Kategori",
    "home.why.title": "Neden RPMVault?",
    "home.why.subtitle": "Motosiklet dünyasının en kapsamlı ve güvenilir veri kaynağı",
    "home.why.card.catalog.title": "Kapsamlı Katalog",
    "home.why.card.catalog.desc": "Dünyanın en büyük motosiklet veritabanı. Her marka ve kategoriden binlerce model.",
    "home.why.card.search.title": "Akıllı Arama",
    "home.why.card.search.desc": "Gelişmiş filtreleme sistemiyle aradığınız motosikleti saniyeler içinde bulun.",
    "home.why.card.details.title": "Detaylı Bilgiler",
    "home.why.card.details.desc": "Motor hacmi, güç, tork, boyutlar ve daha fazlası. Tüm detaylar parmaklarınızın ucunda.",
    "home.why.card.current.title": "Güncel Veri",
    "home.why.card.current.desc": "Sürekli güncellenen veritabanıyla en yeni modeller ve teknik özellikler.",
    "home.why.card.community.title": "Topluluk",
    "home.why.card.community.desc": "Binlerce motosiklet tutkununun güvendiği platform. Deneyimlerinizi paylaşın.",
    "home.why.card.reliable.title": "Güvenilir",
    "home.why.card.reliable.desc": "Doğrulanmış veriler ve güvenilir kaynaklar. Yanlış bilgiye yer yok.",
    "home.categories.title": "Popüler Kategoriler",
    "home.categories.subtitle": "Sürüş tarzınıza uygun mükemmel motosikleti bulun",
    "home.cta.title": "Hayalinizdeki Motosikleti Bulun",
    "home.cta.subtitle": "Binlerce model arasından size en uygun motosikleti keşfedin. Karşılaştırmalar ve teknik özelliklerle doğru seçimi yapın.",
    "home.cta.button": "Aramaya Başla",
    "home.brands.title": "Önde Gelen Markalar",
    "home.brands.subtitle": "Dünyanın önde gelen üreticilerinden motosikletleri keşfedin",

    // Catalog
    "catalog.title": "motor bulundu",
    "catalog.searchResults": "için sonuçlar",
    "catalog.sortBy": "Sırala",
    "catalog.sortNewest": "En Yeni",
    "catalog.sortOldest": "En Eski",
    "catalog.sortName": "İsim A-Z",
    "catalog.page": "Sayfa",
    "catalog.loading": "Motorlar yükleniyor...",
    "catalog.error": "Bir sorun oluştu",
    "catalog.retry": "Tekrar Dene",
    "catalog.clearFilters": "Filtreleri Temizle",
    "catalog.noResults": "Arama kriterlerinize uygun motor bulunamadı.",
    "catalog.previous": "Önceki",
    "catalog.next": "Sonraki",

    // Detail Page
    "detail.backToCatalog": "Kataloga Dön",
    "detail.quickInfo": "Hızlı Bilgiler",
    "detail.category": "Kategori",
    "detail.displacement": "Motor Hacmi",
    "detail.power": "Güç",
    "detail.modelYear": "Model Yılı",

    // Technical Specifications
    // Cards / Common
    "card.viewDetails": "Detayları Gör →",
    "specs.enginePerformance": "Motor & Performans",
    "specs.fuelInjection": "Yakıt & Enjeksiyon Sistemi",
    "specs.coolingStarter": "Soğutma & Başlatıcı",
    "specs.transmissionDrive": "Şanzıman & Aktarım",
    "specs.brakeSystem": "Fren Sistemi",
    "specs.suspension": "Süspansiyon",
    "specs.tiresWheels": "Lastikler & Tekerlekler",
    "specs.lighting": "Aydınlatma",
    "specs.dimensionsWeight": "Boyutlar & Ağırlık",
    "specs.otherFeatures": "Diğer Özellikler",

    // Filters
    "filters.title": "Filtreler",
    "filters.active": "Aktif Filtreler",
    "filters.categories": "Kategoriler",
    "filters.brands": "Markalar",
    "filters.clearAll": "Tümünü Temizle",
    "filters.searchCategories": "Kategorilerde ara...",
    "filters.searchBrands": "Markalarda ara...",
    "filters.noResults": "Sonuç bulunamadı",

    // Footer
    "footer.about": "Hakkında",
    "footer.contact": "İletişim",
    "footer.privacy": "Gizlilik",
    "footer.terms": "Şartlar",
    "footer.rights": "Tüm hakları saklıdır.",

    // Compare Page
    "compare.title": "Motor Kıyaslama",
    "compare.subtitle": "İki motosikleti seçerek teknik özelliklerini yan yana karşılaştırın",
    "compare.backToCatalog": "Kataloga Dön",
    "compare.searchPlaceholder1": "İlk motosikleti arayın...",
    "compare.searchPlaceholder2": "İkinci motosikleti arayın...",
    "compare.searching": "Aranıyor...",
    "compare.noResults": "Sonuç bulunamadı",
    "compare.emptyTitle": "Kıyaslamaya Başlayın",
    "compare.emptyDescription": "İki motosiklet arayıp seçerek detaylı karşılaştırma yapın",
    "compare.torque": "Tork",
    "compare.bore": "Silindir Çapı",
    "compare.stroke": "Strok",
    "compare.compression": "Sıkıştırma Oranı",
    "compare.fuelSystem": "Yakıt Sistemi",
    "compare.fuelControl": "Yakıt Kontrolü",
    "compare.ignition": "Ateşleme",
    "compare.gearbox": "Vites Kutusu",
    "compare.transmission": "Aktarım",
    "compare.clutch": "Debriyaj",
    "compare.chassisSuspension": "Şasi & Süspansiyon",
    "compare.frame": "Şasi",
    "compare.frontSuspension": "Ön Süspansiyon",
    "compare.rearSuspension": "Arka Süspansiyon",
    "compare.frontBrakes": "Ön Frenler",
    "compare.rearBrakes": "Arka Frenler",
    "compare.frontTyre": "Ön Lastik",
    "compare.rearTyre": "Arka Lastik",
    "compare.frontWheel": "Ön Jant",
    "compare.rearWheel": "Arka Jant",
    "compare.seatHeight": "Sele Yüksekliği",
    "compare.wheelbase": "Dingil Mesafesi",
    "compare.groundClearance": "Yerden Yükseklik",
    "compare.dryWeight": "Kuru Ağırlık",
    "compare.wetWeight": "Yaş Ağırlık",
    "compare.fuelCapacity": "Yakıt Kapasitesi",
    "compare.better": "Daha İyi",
    "compare.worse": "Daha Kötü",
    "compare.engineType": "Motor Tipi",
    "compare.cooling": "Soğutma Sistemi",
    "compare.starter": "Marş",
    "compare.frontTravel": "Ön Süspansiyon Hareketi",
    "compare.rearTravel": "Arka Süspansiyon Hareketi",
    "compare.length": "Uzunluk",
    "compare.width": "Genişlik",
    "compare.height": "Yükseklik",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "tr")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === "en" ? "tr" : "en"
      localStorage.setItem("language", next)
      return next
    })
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
