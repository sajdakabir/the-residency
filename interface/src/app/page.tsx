'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [showApplication, setShowApplication] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    country: ''
  })

  const handleGetStarted = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setShowApplication(true)
    }, 1500)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      setShowApplication(false)
    }
  }

  const steps = [
    { number: 1, title: 'Personal Information', active: currentStep === 1, completed: currentStep > 1 },
    { number: 2, title: 'KYC Verification', active: currentStep === 2, completed: currentStep > 2 },
    { number: 3, title: 'Entity Setup', active: currentStep === 3, completed: currentStep > 3 },
    { number: 4, title: 'Review & Submit', active: currentStep === 4, completed: false }
  ]

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
        {!showApplication ? (
          /* Landing Page with Image */
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

            {/* Right side - Landing Content */}
            <div className="w-96 flex flex-col">
              <div className="flex-1 flex items-center justify-center py-12">
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
              <div className="text-center pb-8">
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
        ) : (
          /* Application Form without Image */
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-2xl">
            <div className="p-6 border-b">
              <h1 className="text-xl font-semibold text-gray-900 mb-1">
                Apply for Digital Residency
              </h1>
              <p className="text-sm text-gray-600">
                Complete your application to become a verified digital resident
              </p>
            </div>

            {/* Progress Steps */}
            <div className="px-6 py-4 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      step.completed 
                        ? 'bg-blue-600 text-white' 
                        : step.active 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step.completed ? '✓' : step.number}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-12 h-0.5 mx-2 ${
                        step.completed ? 'bg-blue-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 min-h-96">
              {currentStep === 1 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Step 1: Personal Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country of Residence
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option value="">Select your country</option>
                        <option value="US">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="JP">Japan</option>
                        <option value="SG">Singapore</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Step 2: KYC Verification
                  </h2>
                  <p className="text-gray-600 text-sm">KYC verification form will go here...</p>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Step 3: Entity Setup
                  </h2>
                  <p className="text-gray-600 text-sm">Entity setup form will go here...</p>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Step 4: Review & Submit
                  </h2>
                  <p className="text-gray-600 text-sm">Review and submit form will go here...</p>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="p-6 border-t bg-gray-50 flex justify-between">
              <button
                onClick={handlePrevious}
                className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
              >
                ← Previous
              </button>
              
              <button
                onClick={handleContinue}
                disabled={currentStep === 1 && (!formData.fullName || !formData.email || !formData.country)}
                className="bg-gray-900 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {currentStep === 4 ? 'Submit' : 'Continue'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
