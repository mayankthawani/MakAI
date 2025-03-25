"use client"
import React, { useRef } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import Image from 'next/image'
import { useEffect } from 'react'

const Herosection = () => {
     const imageref = useRef(null);
     useEffect(() => {
        const imageelement = imageref.current;

        const handleScroll = () => {
            const scrollposition = window.scrollY;
            const scrollThreshold = 100;
            
            if (scrollposition > scrollThreshold) {
                imageelement.classList.add("scrolled");
            } else {
                imageelement.classList.remove("scrolled");
            }
        }

        window.addEventListener('scroll', handleScroll);
        
        // Cleanup function
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };

     }, []);
     
  return (
    <section className='w-full pt-36 md:pt-48 pb-10'>
    <div className='space-y-6 text-center'>
        <div className='space-y-6 mx-auto'> 
            <h1 className='gradient-title text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl ' >Your AI Carrer Coach
            <br />
            Professional Success
            </h1>
            <p className='mx-auto max-w-[600px] text-muted-foreground md:text-lg'>
                Advance your carrer with personalized guidance, interview prep, and AI-powered tools for job success.
            </p>

        </div>
        <div className='display-flex justify-center space-x-4'>
            <Link href="/dashboard">
            <Button size="lg" className = "px-8">Get started</Button></Link>
            <Link href="/https:github.com/mayankthawani">
            <Button size="lg" className = "px-8" variant="outline">Get started</Button></Link>
        </div>
        <div className='hero-image-wrapper mt-5 md:mt-0'>
            <div ref={imageref} className='hero-image'>
                <Image src ={"/banner.jpeg"}
                    width={1280}
                    height={720}
                    alt='bannerpreview'
                    className='rounded-lg shadow-2xl border mx-auto'
                    priority
                />
            </div>
        </div>
      
    </div>
    </section>
  )
}

export default Herosection
