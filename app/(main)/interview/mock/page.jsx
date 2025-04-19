"use client"
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Quiz from '../_component/Quiz'

const MockInterView = () => {
  return (
    <div className='container mx-auto px-4 md:px-6 py-12 md:py-24 lg:py-32 bg-background'>
      <div className='flex flex-col space-y-2 mx-2'>
        <Link href={'/interview'}>
        <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Interview Preparation
          
          </Button></Link>

          <div>
            <h1 className='text-6xl font-bold bg-gradient-to from-[#ADB3BC] to-[#666B74]'>Mock Interview</h1>
            <p className='text-muted-foreground'>Test Your Knowledge with Industry-specific questions</p>
          </div>


      </div>

      <Quiz />

    </div>
  )
}

export default MockInterView
