"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Bike, Award, Search, TrendingUp, Users, Shield, CircleArrowRight, Flag, Mountain, Map, Trees, Zap, Plug } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"

interface Stats {
  totalBikes: number
  totalBrands: number
  totalCategories: number
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({ totalBikes: 0, totalBrands: 0, totalCategories: 0 })
  const [searchQuery, setSearchQuery] = useState("")
  const { t } = useLanguage()

  // Using static stats instead of fetching from API
  useEffect(() => {
    // Set static stats to avoid API calls on homepage
    setStats({
      totalBikes: 1000,
      totalBrands: 50,
      totalCategories: 8,
    })
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/10 to-primary/5">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 text-balance">
              {t("home.hero.title")}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 text-pretty max-w-3xl mx-auto">
              {t("home.hero.subtitle")}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/catalog">
                <Button size="lg" className="text-lg px-8 py-6 rounded-full cursor-pointer">
                  <CircleArrowRight className="mr-2 h-5 w-5" />
                  {t("home.hero.cta")}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stats.totalBikes.toLocaleString()}+
                </div>
                <div className="text-sm md:text-base text-muted-foreground">{t("home.stats.motorcycles")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stats.totalBrands}+</div>
                <div className="text-sm md:text-base text-muted-foreground">{t("home.stats.brands")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stats.totalCategories}+</div>
                <div className="text-sm md:text-base text-muted-foreground">{t("home.stats.categories")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("home.why.title")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("home.why.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Bike className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t("home.why.card.catalog.title")}</h3>
              <p className="text-muted-foreground">{t("home.why.card.catalog.desc")}</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t("home.why.card.search.title")}</h3>
              <p className="text-muted-foreground">{t("home.why.card.search.desc")}</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t("home.why.card.details.title")}</h3>
              <p className="text-muted-foreground">{t("home.why.card.details.desc")}</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t("home.why.card.current.title")}</h3>
              <p className="text-muted-foreground">{t("home.why.card.current.desc")}</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t("home.why.card.community.title")}</h3>
              <p className="text-muted-foreground">{t("home.why.card.community.desc")}</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t("home.why.card.reliable.title")}</h3>
              <p className="text-muted-foreground">{t("home.why.card.reliable.desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("home.categories.title")}</h2>
            <p className="text-xl text-muted-foreground">{t("home.categories.subtitle")}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Sport", description: "High performance", icon: <Flag className="h-8 w-8" /> },
              { name: "Cruiser", description: "Comfortable ride", icon: <Bike className="h-8 w-8" /> },
              { name: "Adventure", description: "All terrain", icon: <Mountain className="h-8 w-8" /> },
              { name: "Naked", description: "City friendly", icon: <Zap className="h-8 w-8" /> },
              { name: "Touring", description: "Long distance", icon: <Map className="h-8 w-8" /> },
              { name: "Enduro", description: "Off-road adventure", icon: <Trees className="h-8 w-8" /> },
              { name: "Scooter", description: "Practical transport", icon: <Bike className="h-8 w-8" /> },
              { name: "Electric", description: "Future is here", icon: <Plug className="h-8 w-8" /> },
            ].map((category) => (
              <Link key={category.name} href={`/catalog?category=${category.name}`}>
                <div className="bg-card border border-border rounded-xl p-6 text-center hover:bg-accent transition-colors cursor-pointer group">
                  <div className="text-primary mb-3 flex justify-center">{category.icon}</div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Brands */}
      <section className="py-20 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("home.brands.title")}</h2>
            <p className="text-xl text-muted-foreground">{t("home.brands.subtitle")}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "Honda", logo: "/brands/honda.svg" },
              { name: "Yamaha", logo: "/brands/yamaha.svg" },
              { name: "Sym", logo: "/brands/sym.svg" },
              { name: "Kawasaki", logo: "/brands/kawasaki.svg" },
              { name: "Suzuki", logo: "/brands/suzuki.svg" },
              { name: "BMW", logo: "/brands/bmw.svg" },
            ].map((brand) => (
              <Link key={brand.name} href={`/catalog?brand=${brand.name}`}>
                <div className="bg-card border border-border rounded-xl p-6 flex items-center justify-center h-32 hover:shadow-lg transition-all cursor-pointer group grayscale hover:grayscale-0 bg-white">
                  <div className="relative w-full h-full">
                    <Image
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{t("home.cta.title")}</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">{t("home.cta.subtitle")}</p>
          <Link href="/catalog">
            <Button size="lg" className="text-lg px-12 py-6 rounded-full">
              <Search className="mr-2 h-5 w-5" />
              {t("home.cta.button")}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
