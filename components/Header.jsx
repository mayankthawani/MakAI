import React from 'react'
import { SignedIn, SignedOut, SignInButton, SignUpButton , UserButton } from "@clerk/nextjs";
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button";
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, StarsIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { checkuser } from '@/lib/checkuser';
const Header = async  () => {
  await checkuser();
  return (
    <div>
      <header className="fixed top-0 left-0 w-full border-b bg-background/90 backdrop-blur-lg z-50 supports-[backdrop-filter]:bg-background/60">
        <nav className='container mx-auto px-4 h-16 flex item-center justify-between'   >
          <Link href ='/'>
          <Image src="/logo.png" alt='MakAI logo' width={200} height={60} className='h-12 py-1 w-auto object-contain '></Image>
          </Link>
          <div className='flex items-center gap-4'>
            <SignedIn>
              <Link href={'/dashboard'}>
              <Button variant = "outline">
                <LayoutDashboard className='h-6 w-6'/>
                <span className='hidden md:block'>Industry Insights</span>
              </Button>
              </Link>
           
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <StarsIcon className='h-6 w-6'/>
              <span className='hidden md:block'>Growth Tools</span>
              <ChevronDown className='h-6 w-6'/>
            </Button>

          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href={"/resume"} className='flex items-center gap-2'> <FileText className='h-4 w-4'/>
              <span> Build resume </span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem> 
              <Link href={"/ai-cover-letter"} className='flex items-center gap-2'> <PenBox className='h-4 w-4'/>
              <span> Cover Letter </span>
              </Link>
              </DropdownMenuItem>
            <DropdownMenuItem>
               <Link href={"/interview"} className='flex items-center gap-2'> <GraduationCap className='h-4 w-4'/>
              <span> Interview prep </span>
              </Link>
              </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
        </SignedIn>

        <SignedOut>
          <SignInButton>
            <Button>
              <span>Sign In</span>
            </Button>
          </SignInButton>
              
            <SignUpButton>
              <Button>Sign UP</Button>
            </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton
              appearance={{
                elements:{
                  avatarBox:"w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font semibold"
                }
              }} 
              />
            </SignedIn>


          </div>

        </nav>
           
          </header>
    </div>
  )
}

export default Header
