"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Search, UserStar, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function HeaderLanding() {
  const [search, setSearch] = useState("");
  const { data: session } = useSession();

  return (
    <header className="w-full border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
        <Link
          prefetch={false}
          href="/"
          className="flex items-center gap-2 flex-shrink-0"
        >
          <Image
            src="/images/nike.png"
            width={32}
            height={32}
            alt="Nike Logo"
            className="rounded-full sm:w-9 sm:h-9"
          />
          <span className="font-bold text-lg sm:text-xl lg:text-2xl bg-gradient-to-r from-[#70e000] to-[#16db65] text-transparent bg-clip-text">
            Nike Store
          </span>
        </Link>
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          <Link
            prefetch={false}
            href="/shop"
            className="text-sm font-medium hover:text-[#70e000] transition-colors"
          >
            Shop
          </Link>
          <Link
            prefetch={false}
            href="/about"
            className="text-sm font-medium hover:text-[#70e000] transition-colors"
          >
            About
          </Link>
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shoes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-48 xl:w-64 focus-visible:ring-[#70e000]"
            />
          </div>
          {session?.user?.role == "admin" ? (
            <Link
              href="/admin"
              className="bg-gradient-to-r from-[#e03f00] to-[#dbb416] text-black font-medium hover:opacity-90 transition-opacity p-[5px] rounded-md flex items-center justify-center"
            >
              <UserStar />
            </Link>
          ) : (
            <Button
              asChild
              className="bg-gradient-to-r from-[#70e000] to-[#16db65] text-black font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <Link href="/login">Login / Register</Link>
            </Button>
          )}
        </div>
        <div className="hidden md:flex lg:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-[#70e000] hover:bg-[#70e000]/10"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-gradient-to-r from-[#70e000] to-[#16db65] text-black font-medium hover:opacity-90"
          >
            <Link prefetch={false} href="/login">
              Login
            </Link>
          </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-[#70e000] hover:bg-[#70e000]/10"
            >
              <Menu className="w-6 h-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[280px] sm:w-[350px]">
            <SheetHeader>
              <SheetTitle className="text-left text-lg">Menu</SheetTitle>
            </SheetHeader>

            <div className="mt-8 flex flex-col gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search shoes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 focus-visible:ring-[#70e000]"
                />
              </div>
              <nav className="flex flex-col gap-1">
                <Link
                  prefetch={false}
                  href="/men"
                  className="px-3 py-2.5 text-base font-medium hover:text-[#70e000] hover:bg-[#70e000]/5 rounded-md transition-colors"
                >
                  Men
                </Link>
                <Link
                  prefetch={false}
                  href="/women"
                  className="px-3 py-2.5 text-base font-medium hover:text-[#70e000] hover:bg-[#70e000]/5 rounded-md transition-colors"
                >
                  Women
                </Link>
                <Link
                  prefetch={false}
                  href="/kids"
                  className="px-3 py-2.5 text-base font-medium hover:text-[#70e000] hover:bg-[#70e000]/5 rounded-md transition-colors"
                >
                  Kids
                </Link>
                <Link
                  prefetch={false}
                  href="/new"
                  className="px-3 py-2.5 text-base font-medium hover:text-[#70e000] hover:bg-[#70e000]/5 rounded-md transition-colors"
                >
                  New Arrivals
                </Link>
              </nav>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-[#70e000] to-[#16db65] text-black font-medium hover:opacity-90 transition-opacity mt-2"
              >
                <Link prefetch={false} href="/login">
                  Login / Register
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
