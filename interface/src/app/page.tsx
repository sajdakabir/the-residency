'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGetStarted = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      console.log('Starting onboarding process...')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Grey dots gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-white opacity-30"></div>
      <div 
        className="absolute inset-0 opacity-20" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}
      ></div>

      {/* Header */}
      <header className="absolute top-0 left-0 z-10 p-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center">
            <span className="text-xs font-bold text-white">D</span>
          </div>
          <span className="text-base font-medium text-gray-900">Druk e-Portal</span>
        </div>
      </header>

      {/* Menu button - top right */}
      <div className="absolute top-6 right-6 z-10">
        <button className="p-2">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Main Container - centered with bordered card */}
      <div className="min-h-screen flex items-center justify-center p-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex w-full max-w-4xl h-auto">
          {/* Left side - Image */}
          <div className="w-96 relative">
            <div className="aspect-[4/5] relative">
              <Image
                src="/image.avif"
                alt="Futuristic city architecture"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="w-96 flex flex-col justify-between py-12">
            {/* Form Content */}
            <div className="flex-1 flex items-center">
              <div className="w-full max-w-sm mx-auto space-y-8">
                {/* Title with gradient background and subtitles */}
                <div className="relative text-center">
                  {/* Grey dots gradient behind text */}
                  <div 
                    className="absolute inset-0 rounded-xl -mx-4 -my-6 opacity-30" 
                    style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0)`,
                      backgroundSize: '16px 16px'
                    }}
                  ></div>
                  <div className="relative space-y-4">
                    <div>
                      <h2 className="text-2xl font-normal text-gray-900 leading-tight bg-gradient-to-r from-gray-900 via-black to-gray-900 bg-clip-text ml-16">
                        The e-Himalayan Kingdom
                      </h2>
                      <p className="text-2xl font-normal text-gray-900 leading-tight bg-gradient-to-r from-gray-900 via-black to-gray-900 bg-clip-text ml-16">
                        for the ambitious world
                      </p>
                    </div>
                    
                    {/* Subtitle lines */}
                    <div>
                      <p className="text-sm text-gray-600 ml-16">
                        Get verified. Get your ID. Build a company — all from anywhere, under Bhutan's new digital frontier.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Get Started Button */}
                <div className="text-center">
                  <button
                    onClick={handleGetStarted}
                    disabled={isLoading}
                    className="bg-black hover:bg-gray-900 disabled:bg-gray-400 text-white font-medium py-3 px-8 rounded-lg transition-colors text-sm ml-16"
                  >
                    {isLoading ? 'Loading...' : 'Get Started'}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Links - bottom */}
            <div className="text-center">
              <div className="flex justify-center gap-6 text-xs text-gray-400 uppercase tracking-wider ml-16">
                <a href="#privacy" className="hover:text-gray-600 transition-colors">
                  Privacy
                </a>
                <a href="#terms" className="hover:text-gray-600 transition-colors">
                  Terms
                </a>
                <a href="#contact" className="hover:text-gray-600 transition-colors">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
