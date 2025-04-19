"use client"
import React from 'react'
import { Suspense } from 'react'
import { GridLoader } from 'react-spinners'

const Layout = ({ children }) => {
  return (
    <div className='px-5'>
      <div className='flex items-center justify-between mb-5'> 
        <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-500 to-gray-300 text-transparent bg-clip-text">
          Industry Insights
        </h1>
      </div>
      <Suspense fallback={<GridLoader className='mt-4' color='gray' width={"100%"} />}>
        {children}
      </Suspense>  
    </div>
  )
}

export default Layout
