"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useThemeLanguage } from "@/context/theme-language-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ConnectionStatus } from "@/components/connection-status";
import {
  Moon,
  Sun,
  Monitor,
  Globe,
  Menu,
  X,
  Home,
  Wrench,
  Package,
  Users,
  History,
} from "lucide-react";

export function Navigation() {
  const { user, profile, household, signOut } = useAuth();
  const { theme, language, setTheme, setLanguage, t } = useThemeLanguage();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigation = [
    { name: t("nav.dashboard"), href: "/dashboard", icon: Home },
    { name: t("nav.devices"), href: "/devices", icon: Wrench },
    { name: t("nav.storage"), href: "/storage", icon: Package },
    { name: t("nav.family"), href: "/family", icon: Users },
    { name: "History", href: "/devices/history", icon: History },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700"
            : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50"
        }`}
      >
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              href="/dashboard"
              className="flex items-center gap-2 sm:gap-3 group"
            >
              <div className="bg-gradient-to-r from-pink-500 to-violet-500 p-1.5 sm:p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
                <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" />
              </div>
              <div className="transform group-hover:translate-x-1 transition-transform duration-300">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text animate-gradient">
                  Yetnew
                </h1>
                {household && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 animate-fade-in hidden sm:block">
                    {household.name}
                  </p>
                )}
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navigation.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={pathname === item.href ? "default" : "ghost"}
                      className={`relative overflow-hidden transition-all duration-300 ${
                        pathname === item.href
                          ? "bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white shadow-lg"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105"
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      <span className="relative z-10">{item.name}</span>
                      {pathname === item.href && (
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 animate-pulse opacity-20" />
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:block">
                <ConnectionStatus />
              </div>

              {/* Language Switcher - Hidden on mobile */}
              <div className="hidden sm:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:scale-110 transition-transform duration-300"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      {language === "en" ? "EN" : "አማ"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="animate-slide-in-up"
                  >
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
              </div>

              {/* Theme Switcher - Hidden on mobile */}
              <div className="hidden sm:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:scale-110 transition-transform duration-300"
                    >
                      {getThemeIcon()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="animate-slide-in-up"
                  >
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
              </div>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:scale-110 transition-transform duration-300"
                  >
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-gradient-to-r ring-pink-500 ring-violet-500 animate-pulse">
                      <AvatarImage
                        src={profile?.avatar_url || ""}
                        alt={profile?.full_name || ""}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-pink-500 to-violet-500 text-white animate-gradient text-sm">
                        {profile?.full_name?.charAt(0) ||
                          user?.email?.charAt(0) ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 animate-slide-in-up"
                  align="end"
                >
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">
                        {profile?.full_name || "User"}
                      </p>
                      <p className="w-[200px] truncate text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                      {profile?.role && (
                        <Badge
                          variant="secondary"
                          className="w-fit text-xs animate-bounce"
                        >
                          {profile.role}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />

                  {/* Mobile-only options */}
                  <div className="sm:hidden">
                    <DropdownMenuItem asChild>
                      <div className="flex items-center gap-2 p-2">
                        <Globe className="h-4 w-4" />
                        <span>
                          Language: {language === "en" ? "English" : "አማርኛ"}
                        </span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setLanguage(language === "en" ? "am" : "en")
                      }
                    >
                      Switch to {language === "en" ? "አማርኛ" : "English"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </div>

                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="hover:bg-gradient-to-r hover:from-pink-50 hover:to-violet-50"
                    >
                      {t("nav.profile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/family"
                      className="hover:bg-gradient-to-r hover:from-pink-50 hover:to-violet-50"
                    >
                      {t("nav.family")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-600 hover:bg-red-50"
                  >
                    {t("nav.signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden hover:scale-110 transition-transform duration-300 p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-xl animate-slide-in-up">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col gap-4">
                {navigation.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button
                        variant={pathname === item.href ? "default" : "ghost"}
                        className={`w-full justify-start text-left transition-all duration-300 ${
                          pathname === item.href
                            ? "bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <IconComponent className="w-5 h-5 mr-3" />
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="mb-4">
                    <ConnectionStatus />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Theme
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant={theme === "light" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setTheme("light")}
                      >
                        <Sun className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setTheme("dark")}
                      >
                        <Moon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={theme === "system" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setTheme("system")}
                      >
                        <Monitor className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
