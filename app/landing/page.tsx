"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useThemeLanguage } from "@/context/theme-language-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Play, Check, Star, Users, Shield, Zap, Globe, Moon, Sun, Monitor } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function LandingPage() {
  const { theme, language, setTheme, setLanguage, t } = useThemeLanguage()
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const testimonials = [
    {
      name: language === "am" ? "ሳራ ዮሃንስ" : "Sarah Johnson",
      role: language === "am" ? "የ3 ልጆች እናት" : "Busy Mom of 3",
      content:
        language === "am"
          ? "መሳሪያዎችን ለመፈለግ 20 ደቂቃ እጠቀማለሁ ነበር። አሁን በሰከንዶች ውስጥ ሁሉንም ነገር አገኛለሁ!"
          : "I used to spend 20 minutes looking for tools. Now I find everything in seconds!",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60&text=SJ",
    },
    {
      name: language === "am" ? "ሚካኤል ቸን" : "Mike Chen",
      role: language === "am" ? "DIY ወዳጅ" : "DIY Enthusiast",
      content:
        language === "am"
          ? "ይህ መተግበሪያ የእኔን ወርክሾፕ ከትርምስ ወደ ተደራጀ ፍጽምና ቀይሮታል።"
          : "This app transformed my workshop from chaos to organized perfection.",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60&text=MC",
    },
    {
      name: language === "am" ? "የሮድሪጌዝ ቤተሰብ" : "The Rodriguez Family",
      role: language === "am" ? "የ5 ቤተሰብ" : "Family of 5",
      content:
        language === "am"
          ? "አሁን ሁሉም ሰው ሁሉም ነገር የት እንደሚገኝ ያውቃል። ስለ ጠፋ መሳሪያዎች ክርክር የለም!"
          : "Everyone knows where everything is now. No more arguments about missing tools!",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60&text=RF",
    },
  ]

  const features = [
    {
      icon: "🔍",
      title: t("features.search.title"),
      description: t("features.search.desc"),
    },
    {
      icon: "📦",
      title: t("features.storage.title"),
      description: t("features.storage.desc"),
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: t("features.family.title"),
      description: t("features.family.desc"),
    },
    {
      icon: "🔧",
      title: t("features.maintenance.title"),
      description: t("features.maintenance.desc"),
    },
    {
      icon: "📱",
      title: t("features.sync.title"),
      description: t("features.sync.desc"),
    },
    {
      icon: "🤖",
      title: t("features.ai.title"),
      description: t("features.ai.desc"),
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-pink-500/10 to-violet-500/10 rounded-full blur-3xl animate-float"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transition: "all 0.3s ease-out",
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-full blur-3xl animate-bounce" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-50 transition-all duration-500">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 group">
            <div className="bg-gradient-to-r from-pink-500 to-violet-500 p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-wrench animate-pulse"
              >
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text animate-gradient">
              Yetnew
            </span>
          </div>
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:scale-110 transition-transform duration-300">
                  <Globe className="h-4 w-4 mr-2" />
                  {language === "en" ? "EN" : "አማ"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="animate-slide-in-up">
                <DropdownMenuItem
                  onClick={() => setLanguage("en")}
                  className="hover:bg-gradient-to-r hover:from-pink-50 hover:to-violet-50"
                >
                  🇺🇸 English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("am")}
                  className="hover:bg-gradient-to-r hover:from-pink-50 hover:to-violet-50"
                >
                  🇪🇹 አማርኛ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:scale-110 transition-transform duration-300">
                  {getThemeIcon()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="animate-slide-in-up">
                <DropdownMenuItem
                  onClick={() => setTheme("light")}
                  className="hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50"
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("dark")}
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("system")}
                  className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50"
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/login">
              <Button variant="ghost" className="hover:scale-105 transition-transform duration-300">
                {t("auth.signIn")}
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl pulse-glow">
                {t("auth.signUp")}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-in-left">
              <div className="space-y-6">
                <Badge className="bg-gradient-to-r from-pink-500 to-violet-500 text-white border-0 animate-bounce">
                  ✨ {language === "am" ? "የቤትዎን ድርጅት ይለውጡ" : "Transform Your Home Organization"}
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight animate-fade-in">
                  {language === "am" ? (
                    <>
                      ከአሁን በኋላ{" "}
                      <span className="bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text animate-gradient">
                        መሳሪያ
                      </span>{" "}
                      አታጣ
                    </>
                  ) : (
                    <>
                      Never Lose a{" "}
                      <span className="bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text animate-gradient">
                        Device
                      </span>{" "}
                      Again
                    </>
                  )}
                </h1>
                <p
                  className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed animate-fade-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  {t("landing.hero.subtitle")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 animate-slide-in-up" style={{ animationDelay: "0.4s" }}>
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-lg px-8 py-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl pulse-glow"
                  >
                    {t("landing.hero.cta")}
                    <ChevronRight className="ml-2 h-5 w-5 animate-bounce" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 bg-transparent hover:scale-105 transition-all duration-300 border-2 hover:border-pink-500 hover:text-pink-500"
                  onClick={() => setIsVideoPlaying(true)}
                >
                  <Play className="mr-2 h-5 w-5 animate-pulse" />
                  {t("landing.hero.demo")}
                </Button>
              </div>

              <div
                className="flex items-center gap-8 text-sm text-gray-600 dark:text-gray-400 animate-fade-in"
                style={{ animationDelay: "0.6s" }}
              >
                <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                  <Check className="h-4 w-4 text-green-500 animate-pulse" />
                  {t("landing.hero.free")}
                </div>
                <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                  <Check className="h-4 w-4 text-green-500 animate-pulse" />
                  {t("landing.hero.noCard")}
                </div>
                <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                  <Check className="h-4 w-4 text-green-500 animate-pulse" />
                  {t("landing.hero.setup")}
                </div>
              </div>
            </div>

            <div className="relative animate-slide-in-right">
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transform hover:rotate-0 rotate-3 transition-all duration-500 hover:scale-105 hover-lift">
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-pink-500 to-violet-500 text-white px-4 py-2 rounded-full text-sm font-semibold animate-bounce">
                  {language === "am" ? "ቀጥታ ማሳያ" : "Live Demo"}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg animate-pulse">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                    <span className="text-sm">
                      {language === "am" ? '"ፓወር ድሪል" በመፈለግ ላይ...' : 'Searching for "power drill"...'}
                    </span>
                  </div>
                  <div className="bg-gradient-to-r from-pink-50 to-violet-50 dark:from-pink-900/20 dark:to-violet-900/20 p-4 rounded-lg border-l-4 border-pink-500 animate-slide-in-up">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg flex items-center justify-center animate-spin-slow">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold">
                          {language === "am" ? "ብላክ እና ዴከር ፓወር ድሪል" : "Black & Decker Power Drill"}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          📦 {language === "am" ? "መሳሪያዎች ሳጥን → ክፍል #3" : "Tools Box → Compartment #3"}
                        </p>
                        <p className="text-xs text-green-600 animate-pulse">
                          ✅ {language === "am" ? "በጋራዥ መደርደሪያ ተገኝቷል" : "Found in Garage Shelf"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center animate-bounce">
                    <span className="text-2xl">⚡</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {language === "am" ? "በ0.3 ሰከንድ ተገኝቷል!" : "Found in 0.3 seconds!"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 text-transparent bg-clip-text">
              {t("landing.problem.title")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">{t("landing.problem.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                emoji: "😤",
                title: t("landing.problem.search"),
                desc: t("landing.problem.searchDesc"),
                color: "red",
                delay: "0s",
              },
              {
                emoji: "🤷‍♀️",
                title: t("landing.problem.blame"),
                desc: t("landing.problem.blameDesc"),
                color: "yellow",
                delay: "0.2s",
              },
              {
                emoji: "💸",
                title: t("landing.problem.buy"),
                desc: t("landing.problem.buyDesc"),
                color: "orange",
                delay: "0.4s",
              },
            ].map((problem, index) => (
              <Card
                key={index}
                className={`p-6 text-center border-${problem.color}-200 bg-${problem.color}-50 dark:bg-${problem.color}-900/20 hover:scale-105 transition-all duration-500 hover-lift animate-slide-in-up`}
                style={{ animationDelay: problem.delay }}
              >
                <div className="text-5xl mb-4 animate-bounce" style={{ animationDelay: `${index * 0.5}s` }}>
                  {problem.emoji}
                </div>
                <h3 className="font-semibold text-lg mb-2">{problem.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{problem.desc}</p>
              </Card>
            ))}
          </div>

          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-8 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform duration-300">
              <span className="text-red-500 font-semibold">{t("landing.problem.timeWasted")}</span>
              <span className="text-3xl font-bold text-red-600 animate-pulse">
                3.5 {language === "am" ? "ሰዓት" : "hours"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-purple-900/20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              {language === "am" ? "ተደራጅተው ለመቆየት የሚያስፈልግዎት ሁሉም ነገር" : "Everything You Need to Stay Organized"}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {language === "am" ? "ለዘመናዊ ቤተሰቦች የተነደፉ ኃይለኛ ባህሪያት" : "Powerful features designed for modern families"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:scale-105 hover-lift animate-slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-5xl mb-4 animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              {language === "am" ? "በሺዎች ቤተሰቦች የተወደደ" : "Loved by Thousands of Families"}
            </h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-8 w-8 fill-yellow-400 text-yellow-400 animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
              <span className="text-lg font-semibold ml-2">
                4.9/5 {language === "am" ? "ከ2,847 ቤተሰቦች" : "from 2,847 families"}
              </span>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-0 hover:scale-105 transition-transform duration-500 animate-fade-in">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-6 w-6 fill-yellow-400 text-yellow-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                <blockquote className="text-2xl italic mb-8 animate-fade-in">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div className="flex items-center justify-center gap-4 animate-slide-in-up">
                  <img
                    src={testimonials[currentTestimonial].image || "/placeholder.svg"}
                    alt={testimonials[currentTestimonial].name}
                    className="w-16 h-16 rounded-full ring-4 ring-purple-200 animate-pulse"
                  />
                  <div>
                    <div className="font-semibold text-lg">{testimonials[currentTestimonial].name}</div>
                    <div className="text-gray-600 dark:text-gray-400">{testimonials[currentTestimonial].role}</div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-300 hover:scale-125 ${
                    index === currentTestimonial
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-purple-300"
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-violet-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50,000+", label: language === "am" ? "የተደራጁ መሳሪያዎች" : "Devices Organized", delay: "0s" },
              { number: "2,847", label: language === "am" ? "ደስተኛ ቤተሰቦች" : "Happy Families", delay: "0.2s" },
              { number: "15 min", label: language === "am" ? "አማካይ ማዋቀሪያ ጊዜ" : "Average Setup Time", delay: "0.4s" },
              { number: "99.9%", label: language === "am" ? "የስራ ጊዜ ዋስትና" : "Uptime Guarantee", delay: "0.6s" },
            ].map((stat, index) => (
              <div
                key={index}
                className="animate-slide-in-up hover:scale-110 transition-transform duration-300"
                style={{ animationDelay: stat.delay }}
              >
                <div className="text-5xl font-bold mb-2 animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                  {stat.number}
                </div>
                <div className="text-pink-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 text-transparent bg-clip-text">
              {language === "am" ? "ቤትዎን ለመለወጥ ዝግጁ ነዎት?" : "Ready to Transform Your Home?"}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
              {language === "am"
                ? "የጠፉ መሳሪያዎችን ማስቸገር ለቀው ፍጹም ድርጅት ላይ ሰላም ያሉ ሺዎች ቤተሰቦችን ይቀላቀሉ።"
                : "Join thousands of families who've already said goodbye to the frustration of lost devices and hello to perfect organization."}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 animate-slide-in-up">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-lg px-10 py-6 hover:scale-110 transition-all duration-300 shadow-2xl pulse-glow"
                >
                  {language === "am" ? "ነፃ መለያዎን ይጀምሩ" : "Start Your Free Account"}
                  <ChevronRight className="ml-2 h-5 w-5 animate-bounce" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-6 bg-transparent hover:scale-105 transition-all duration-300 border-2 hover:border-purple-500 hover:text-purple-500"
                >
                  {language === "am" ? "ቀድሞውኑ መለያ አለዎት?" : "Already have an account?"}
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400 animate-fade-in">
              <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                <Shield className="h-4 w-4 text-green-500 animate-pulse" />
                {language === "am" ? "ደህንነቱ የተጠበቀ እና ግላዊ" : "Secure & Private"}
              </div>
              <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                <Users className="h-4 w-4 text-blue-500 animate-pulse" />
                {language === "am" ? "ለቤተሰብ ተስማሚ" : "Family Friendly"}
              </div>
              <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />
                {language === "am" ? "በጣም ፈጣን" : "Lightning Fast"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-gray-900 dark:bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-pink-500 to-violet-500 p-2 rounded-lg animate-pulse">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-wrench"
                  >
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 text-transparent bg-clip-text">
                  Yetnew
                </span>
              </div>
              <p className="text-gray-400">
                {language === "am"
                  ? "በቤትዎ ውስጥ ያለውን እያንዳንዱን መሳሪያ ለማደራጀት እና ለማግኘት ብልህ መንገድ። ከአሁን በኋላ ምንም ነገር አታጡ።"
                  : "The smart way to organize and find every device in your home. Never lose anything again."}
              </p>
            </div>

            <div className="animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
              <h4 className="font-semibold mb-4 text-pink-400">{language === "am" ? "ምርት" : "Product"}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="#"
                    className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {language === "am" ? "ባህሪያት" : "Features"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {language === "am" ? "ዋጋ" : "Pricing"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {language === "am" ? "ማሳያ" : "Demo"}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="animate-slide-in-up" style={{ animationDelay: "0.4s" }}>
              <h4 className="font-semibold mb-4 text-violet-400">{language === "am" ? "ድጋፍ" : "Support"}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="#"
                    className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {language === "am" ? "የእገዛ ማዕከል" : "Help Center"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {language === "am" ? "አግኙን" : "Contact Us"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {language === "am" ? "የግላዊነት ፖሊሲ" : "Privacy Policy"}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="animate-slide-in-up" style={{ animationDelay: "0.6s" }}>
              <h4 className="font-semibold mb-4 text-blue-400">{language === "am" ? "ኩባንያ" : "Company"}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="#"
                    className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {language === "am" ? "ስለ እኛ" : "About Us"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {language === "am" ? "ብሎግ" : "Blog"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {language === "am" ? "ስራዎች" : "Careers"}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 animate-fade-in">
            <p>
              &copy; 2024 Yetnew.{" "}
              {language === "am"
                ? "ሁሉም መብቶች የተጠበቁ ናቸው። ለተደራጁ ቤተሰቦች በ❤️ የተሰራ።"
                : "All rights reserved. Made with ❤️ for organized families."}
            </p>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-4xl w-full animate-slide-in-up">
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-violet-500/20 animate-pulse"></div>
              <div className="text-center text-white z-10">
                <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-6"></div>
                <p className="text-xl mb-2">{language === "am" ? "ማሳያ ቪዲዮ እዚህ ይጫወታል" : "Demo video would play here"}</p>
                <p className="text-gray-300 mb-6">
                  {language === "am" ? '"ከዘፈቀደ ወደ ተደራጀ በደቂቃዎች ውስጥ"' : '"From Messy to Organized in Minutes"'}
                </p>
                <Button
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-black bg-transparent"
                  onClick={() => setIsVideoPlaying(false)}
                >
                  {language === "am" ? "ቪዲዮ ዝጋ" : "Close Video"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
