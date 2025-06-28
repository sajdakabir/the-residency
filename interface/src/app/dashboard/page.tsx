'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('overview')

  // Mock data - in real app this would come from API
  const userData = {
    name: 'Oliur Sahin',
    email: 'oliursahin@gmail.com',
    kycStatus: 'approved', // approved, pending, rejected
    applicationDate: '2024-01-15',
    approvalDate: '2024-01-17',
    residencyId: 'DRK-2024-001847',
    nftTokenId: '#1847',
    nftContract: '0x1234...5678'
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: 'home' },
    { id: 'kyc', label: 'KYC Status', icon: 'check' },
    { id: 'nft', label: 'Residency NFT', icon: 'badge' },
    { id: 'company', label: 'Company Info', icon: 'building' },
    { id: 'documents', label: 'Documents', icon: 'document' }
  ]

  const renderIcon = (iconType: string) => {
    const iconProps = "w-4 h-4 text-current"
    
    switch(iconType) {
      case 'home':
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        )
      case 'check':
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'badge':
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        )
      case 'building':
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        )
      case 'document':
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      default:
        return null
    }
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
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex w-full max-w-5xl min-h-[600px]">
          {/* Left side - Sidebar */}
          <div className="w-72 bg-gray-50 border-r">
            <div className="p-6">
              {/* User Profile */}
              <div className="mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-semibold text-blue-600">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{userData.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{userData.email}</p>
                <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                  Digital Resident
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-base">{renderIcon(item.icon)}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Right side - Main Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-6">
              {activeSection === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 mb-2">
                      Welcome to your Dashboard
                    </h1>
                    <p className="text-sm text-gray-600">
                      Manage your digital residency and access all your documents.
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-900">KYC Approved</p>
                          <p className="text-xs text-green-700">Verified on {userData.approvalDate}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-900">NFT Minted</p>
                          <p className="text-xs text-blue-700">Token {userData.nftTokenId}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'kyc' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 mb-2">
                      KYC Status
                    </h1>
                    <p className="text-sm text-gray-600">
                      Your identity verification status and details.
                    </p>
                  </div>

                  {/* KYC Status Card */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Approved</h3>
                        <p className="text-sm text-gray-600">Your identity has been successfully verified</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Application Date:</span>
                        <span className="text-gray-900 font-medium">{userData.applicationDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Approval Date:</span>
                        <span className="text-gray-900 font-medium">{userData.approvalDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Residency ID:</span>
                        <span className="text-gray-900 font-medium">{userData.residencyId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Verification Steps */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900">Verification Steps Completed:</h4>
                    <div className="space-y-2">
                      {[
                        'Personal Information',
                        'Document Verification',
                        'Identity Verification (Selfie)',
                        'Compliance Questions'
                      ].map((step, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-700">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'nft' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 mb-2">
                      E-Residency NFT
                    </h1>
                    <p className="text-sm text-gray-600">
                      Your digital residency certificate as an NFT.
                    </p>
                  </div>

                  {/* NFT Display */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-center mb-4">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="text-2xl mb-1">🏔️</div>
                          <div className="text-xs font-medium">DRUK</div>
                          <div className="text-xs opacity-80">{userData.nftTokenId}</div>
                        </div>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">Druk Digital Residency</h3>
                      <p className="text-sm text-gray-600">Kingdom of Bhutan • 2024</p>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Token ID:</span>
                        <span className="text-gray-900 font-medium">{userData.nftTokenId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Contract:</span>
                        <span className="text-gray-900 font-mono text-xs">{userData.nftContract}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Network:</span>
                        <span className="text-gray-900 font-medium">Ethereum</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className="text-green-600 font-medium">Minted</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                        View on OpenSea
                      </button>
                    </div>
                  </div>

                  {/* NFT Benefits */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">NFT Benefits:</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Proof of digital residency ownership</li>
                      <li>• Transferable digital asset</li>
                      <li>• Access to exclusive Druk community</li>
                      <li>• Voting rights in governance</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeSection === 'company' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 mb-2">
                      Company Information
                    </h1>
                    <p className="text-sm text-gray-600">
                      Coming soon - Set up your Druk digital company.
                    </p>
                  </div>
                </div>
              )}

              {activeSection === 'documents' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 mb-2">
                      Documents
                    </h1>
                    <p className="text-sm text-gray-600">
                      Download your certificates and official documents.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 