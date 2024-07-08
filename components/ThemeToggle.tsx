"use client"

import { useTheme } from "next-themes"
import { Button } from "./ui/button"
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="hover:bg-light-border dark:hover:bg-dark-border"
    >
      {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem] text-orange-300 transition-all transform rotate-90 rounded-lg" /> :
      <Moon className="h-[1.2rem] w-[1.2rem] transition-all transform rotate-0 text-gray-800 rounded-lg" />}
      {/*<span className="sr-only">Toggle theme</span>*/}
    </Button>
  )
}
