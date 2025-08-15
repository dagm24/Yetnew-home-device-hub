"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"
type Language = "en" | "am"

interface ThemeLanguageContextType {
  theme: Theme
  language: Language
  setTheme: (theme: Theme) => void
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined)

// Comprehensive translations
const translations = {
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.devices": "Devices",
    "nav.storage": "Storage",
    "nav.family": "Family",
    "nav.profile": "Profile",
    "nav.signOut": "Sign Out",

    // Landing Page
    "landing.hero.title": "Never Lose a Device Again",
    "landing.hero.subtitle":
      "Stop wasting hours searching through messy drawers and boxes. Yetnew helps families organize, track, and find every household device instantly with AI-powered search and smart storage management.",
    "landing.hero.cta": "Start Organizing Free",
    "landing.hero.demo": "Watch Demo",
    "landing.hero.free": "Free forever plan",
    "landing.hero.noCard": "No credit card required",
    "landing.hero.setup": "Setup in 2 minutes",

    // Problem Section
    "landing.problem.title": "The Daily Struggle Every Family Knows",
    "landing.problem.subtitle": "Sound familiar?",
    "landing.problem.search": '"Where\'s the screwdriver?"',
    "landing.problem.searchDesc": "Spend 20+ minutes searching through messy drawers, boxes, and storage areas",
    "landing.problem.blame": '"I thought YOU had it!"',
    "landing.problem.blameDesc": "Family arguments about who moved what and where things belong",
    "landing.problem.buy": '"Let\'s just buy another one"',
    "landing.problem.buyDesc": "Waste money buying duplicates of tools you already own but can't find",
    "landing.problem.timeWasted": "Average time wasted per week:",

    // Features
    "features.search.title": "Smart Search",
    "features.search.desc": "Find any device instantly with AI-powered search across your entire household",
    "features.storage.title": "Storage Organization",
    "features.storage.desc": "Track exactly which compartment in which box contains your devices",
    "features.family.title": "Family Sharing",
    "features.family.desc": "Everyone in your family can access and update the same device inventory",
    "features.maintenance.title": "Maintenance Tracking",
    "features.maintenance.desc": "Never forget when you last serviced your tools and equipment",
    "features.sync.title": "Real-time Sync",
    "features.sync.desc": "Changes made by any family member appear instantly on all devices",
    "features.ai.title": "AI Assistant",
    "features.ai.desc": "Ask questions about your devices and get instant, intelligent answers",

    // Auth
    "auth.signUp": "Sign Up",
    "auth.signIn": "Sign In",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.fullName": "Full Name",
    "auth.createAccount": "Create Account",
    "auth.welcomeBack": "Welcome back!",
    "auth.demoMode": "Demo Mode",
    "auth.demoDesc": "You're viewing the demo version. Your data will be stored locally.",

    // Dashboard
    "dashboard.welcome": "Welcome back",
    "dashboard.managing": "Managing devices for",
    "dashboard.setup": "Set up your household to get started",
    "dashboard.totalDevices": "Total Devices",
    "dashboard.working": "Working",
    "dashboard.needsRepair": "Needs Repair",
    "dashboard.storageBoxes": "Storage Boxes",
    "dashboard.recentDevices": "Recent Devices",
    "dashboard.quickActions": "Quick Actions",
    "dashboard.addDevice": "Add New Device",
    "dashboard.manageStorage": "Manage Storage",
    "dashboard.inviteFamily": "Invite Family Members",

    // Common
    "common.loading": "Loading...",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.add": "Add",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.reset": "Reset",
    "common.close": "Close",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.yes": "Yes",
    "common.no": "No",
    "common.ok": "OK",
    "common.error": "Error",
    "common.success": "Success",
    "common.warning": "Warning",
    "common.info": "Info",
  },
  am: {
    // Navigation
    "nav.dashboard": "ዳሽቦርድ",
    "nav.devices": "መሳሪያዎች",
    "nav.storage": "ማከማቻ",
    "nav.family": "ቤተሰብ",
    "nav.profile": "መገለጫ",
    "nav.signOut": "ውጣ",

    // Landing Page
    "landing.hero.title": "ከአሁን በኋላ መሳሪያ አታጣ",
    "landing.hero.subtitle":
      "በዘፈቀደ የተደረደሩ መሳሪያዎችን በመፈለግ ሰዓቶችን ማባከንን አቁም። የትነው የቤተሰብዎን ሁሉንም የቤት መሳሪያዎች በቅጽበት ለማደራጀት፣ ለመከታተል እና ለማግኘት ይረዳል።",
    "landing.hero.cta": "ነፃ ማደራጀት ጀምር",
    "landing.hero.demo": "ማሳያ ይመልከቱ",
    "landing.hero.free": "ለዘላለም ነፃ እቅድ",
    "landing.hero.noCard": "የክሬዲት ካርድ አያስፈልግም",
    "landing.hero.setup": "በ2 ደቂቃ ውስጥ ማዋቀር",

    // Problem Section
    "landing.problem.title": "እያንዳንዱ ቤተሰብ የሚያውቀው ዕለታዊ ትግል",
    "landing.problem.subtitle": "ይህ ተመሳሳይ ይመስላል?",
    "landing.problem.search": '"ስክሪው ድራይቨሩ የት ነው?"',
    "landing.problem.searchDesc": "በዘፈቀደ በተደረደሩ መሳሪያዎች ውስጥ ከ20+ ደቂቃ በላይ ማሳለፍ",
    "landing.problem.blame": '"አንተ እንዳለህ ነው የማስበው!"',
    "landing.problem.blameDesc": "ማን ምን እንደወሰደ እና ነገሮች የት እንደሚገኙ የቤተሰብ ክርክር",
    "landing.problem.buy": '"ሌላ እንግዛ"',
    "landing.problem.buyDesc": "ቀድሞ ያለዎትን ግን ማግኘት የማይችሉትን መሳሪያዎች በድጋሚ በመግዛት ገንዘብ ማባከን",
    "landing.problem.timeWasted": "በሳምንት የሚባከን አማካይ ጊዜ:",

    // Features
    "features.search.title": "ብልህ ፍለጋ",
    "features.search.desc": "በቤትዎ ውስጥ ያለውን ማንኛውንም መሳሪያ በAI የተጎላበተ ፍለጋ በቅጽበት ያግኙ",
    "features.storage.title": "የማከማቻ ድርጅት",
    "features.storage.desc": "መሳሪያዎችዎ በየትኛው ሳጥን ውስጥ በየትኛው ክፍል እንደሚገኙ በትክክል ይከታተሉ",
    "features.family.title": "የቤተሰብ መጋራት",
    "features.family.desc": "በቤተሰብዎ ውስጥ ያለ እያንዳንዱ ሰው ተመሳሳይ የመሳሪያ ዝርዝር ማግኘት እና ማዘመን ይችላል",
    "features.maintenance.title": "የጥገና ክትትል",
    "features.maintenance.desc": "መሳሪያዎችዎን መጨረሻ መቼ እንደጠገኑ በጭራሽ አይርሱ",
    "features.sync.title": "በእውነተኛ ጊዜ ማመሳሰል",
    "features.sync.desc": "በማንኛውም የቤተሰብ አባል የተደረጉ ለውጦች በሁሉም መሳሪያዎች ላይ በቅጽበት ይታያሉ",
    "features.ai.title": "AI ረዳት",
    "features.ai.desc": "ስለ መሳሪያዎችዎ ጥያቄዎችን ይጠይቁ እና ቅጽበታዊ፣ ብልህ መልሶችን ያግኙ",

    // Auth
    "auth.signUp": "ተመዝገብ",
    "auth.signIn": "ግባ",
    "auth.email": "ኢሜይል",
    "auth.password": "የይለፍ ቃል",
    "auth.fullName": "ሙሉ ስም",
    "auth.createAccount": "መለያ ፍጠር",
    "auth.welcomeBack": "እንኳን ደህና መጡ!",
    "auth.demoMode": "የማሳያ ሁነታ",
    "auth.demoDesc": "የማሳያ ስሪቱን እየተመለከቱ ነው። መረጃዎ በአካባቢው ይከማቻል።",

    // Dashboard
    "dashboard.welcome": "እንኳን ደህና መጡ",
    "dashboard.managing": "መሳሪያዎችን ማስተዳደር ለ",
    "dashboard.setup": "ለመጀመር የቤተሰብዎን ያዋቅሩ",
    "dashboard.totalDevices": "ጠቅላላ መሳሪያዎች",
    "dashboard.working": "እየሰራ",
    "dashboard.needsRepair": "ጥገና ይፈልጋል",
    "dashboard.storageBoxes": "የማከማቻ ሳጥኖች",
    "dashboard.recentDevices": "የቅርብ ጊዜ መሳሪያዎች",
    "dashboard.quickActions": "ፈጣን እርምጃዎች",
    "dashboard.addDevice": "አዲስ መሳሪያ አክል",
    "dashboard.manageStorage": "ማከማቻን አስተዳድር",
    "dashboard.inviteFamily": "የቤተሰብ አባላትን ጋብዝ",

    // Common
    "common.loading": "በመጫን ላይ...",
    "common.save": "አስቀምጥ",
    "common.cancel": "ሰርዝ",
    "common.delete": "ሰርዝ",
    "common.edit": "አርትዕ",
    "common.add": "አክል",
    "common.search": "ፈልግ",
    "common.filter": "ማጣሪያ",
    "common.reset": "ዳግም አስጀምር",
    "common.close": "ዝጋ",
    "common.back": "ተመለስ",
    "common.next": "ቀጣይ",
    "common.previous": "ቀዳሚ",
    "common.yes": "አዎ",
    "common.no": "አይ",
    "common.ok": "እሺ",
    "common.error": "ስህተት",
    "common.success": "ተሳክቷል",
    "common.warning": "ማስጠንቀቂያ",
    "common.info": "መረጃ",
  },
}

export const ThemeLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("system")
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    // Load saved preferences
    const savedTheme = localStorage.getItem("theme") as Theme
    const savedLanguage = localStorage.getItem("language") as Language

    if (savedTheme) setTheme(savedTheme)
    if (savedLanguage) setLanguage(savedLanguage)
  }, [])

  useEffect(() => {
    // Apply theme
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }

    // Save to localStorage
    localStorage.setItem("theme", theme)
  }, [theme])

  useEffect(() => {
    // Save language preference
    localStorage.setItem("language", language)

    // Set document direction for Amharic
    document.documentElement.dir = language === "am" ? "ltr" : "ltr" // Amharic is LTR
    document.documentElement.lang = language
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return (
    <ThemeLanguageContext.Provider value={{ theme, language, setTheme, setLanguage, t }}>
      {children}
    </ThemeLanguageContext.Provider>
  )
}

export const useThemeLanguage = () => {
  const context = useContext(ThemeLanguageContext)
  if (context === undefined) {
    throw new Error("useThemeLanguage must be used within a ThemeLanguageProvider")
  }
  return context
}
