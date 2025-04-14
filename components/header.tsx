"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { LoginModal } from "@/components/login-modal"
import { RegisterModal } from "@/components/register-modal"

export default function Header() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const navItems = [
    { name: "Главная", href: "/" },
    { name: "Турниры", href: "/tournaments" },
    { name: "Команды", href: "/teams" },
  ]

  const openLoginModal = () => {
    setIsLoginModalOpen(true)
    setIsRegisterModalOpen(false)
  }

  const closeLoginModal = () => {
    setIsLoginModalOpen(false)
  }

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true)
    setIsLoginModalOpen(false)
  }

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false)
  }

  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link href="/" className="font-bold text-xl mr-8">
            WINFORGE
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Auth Buttons / User Menu */}
        <div className="hidden md:block">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || ""} alt={user.username} />
                    <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Профиль</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/teams/my-teams">Мои команды</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/tournaments/my-tournaments">Мои турниры</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Выйти</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={openLoginModal}>
                Войти
              </Button>
              <Button onClick={openRegisterModal}>Регистрация</Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="border-t pt-4">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || ""} alt={user.username} />
                      <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button variant="ghost" asChild className="justify-start">
                      <Link href="/profile">Профиль</Link>
                    </Button>
                    <Button variant="ghost" asChild className="justify-start">
                      <Link href="/teams/my-teams">Мои команды</Link>
                    </Button>
                    <Button variant="ghost" asChild className="justify-start">
                      <Link href="/tournaments/my-tournaments">Мои турниры</Link>
                    </Button>
                    <Button variant="ghost" onClick={logout} className="justify-start">
                      Выйти
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" onClick={openLoginModal} className="w-full">
                    Войти
                  </Button>
                  <Button onClick={openRegisterModal} className="w-full">
                    Регистрация
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Модальные окна */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} onRegisterClick={openRegisterModal} />
      <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} />
    </header>
  )
}
