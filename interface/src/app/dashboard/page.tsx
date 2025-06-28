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
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'kyc', label: 'KYC Status', icon: '✓' },
    { id: 'nft', label: 'Residency NFT', icon: '🎭' },
    { id: 'company', label: 'Company Info', icon: '🏢' },
    { id: 'documents', label: 'Documents', icon: '📄' }
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
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex w-full max-w-6xl min-h-[600px]">
          {/* Left side - Sidebar */}
          <div className="w-80 bg-gray-50 border-r">
            <div className="p-8">
              {/* User Profile */}
              <div className="mb-10">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl font-semibold text-blue-600">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{userData.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{userData.email}</p>
                <div className="mt-3 inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Digital Resident
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-3">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Right side - Main Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-8">
              {activeSection === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-3">
                      Welcome to your Dashboard
                    </h1>
                    <p className="text-base text-gray-600">
                      Manage your digital residency and access all your documents.
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 gap-6">
                    <div className="bg-green-50 rounded-xl p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xl">✓</span>
                        </div>
                        <div>
                          <p className="text-lg font-medium text-green-900">KYC Approved</p>
                          <p className="text-sm text-green-700">Verified on {userData.approvalDate}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-xl">🎭</span>
                        </div>
                        <div>
                          <p className="text-lg font-medium text-blue-900">NFT Minted</p>
                          <p className="text-sm text-blue-700">Token {userData.nftTokenId}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'kyc' && (
                <div className="space-y-8">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-3">
                      KYC Status
                    </h1>
                    <p className="text-base text-gray-600">
                      Your identity verification status and details.
                    </p>
                  </div>

                  {/* KYC Status Card */}
                  <div className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-medium text-gray-900">Approved</h3>
                        <p className="text-base text-gray-600">Your identity has been successfully verified</p>
                      </div>
                    </div>

                    <div className="space-y-4 text-base">
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
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Verification Steps Completed:</h4>
                    <div className="space-y-3">
                      {[
                        'Personal Information',
                        'Document Verification',
                        'Identity Verification (Selfie)',
                        'Compliance Questions'
                      ].map((step, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-base text-gray-700">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'nft' && (
                <div className="space-y-8">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-3">
                      E-Residency NFT
                    </h1>
                    <p className="text-base text-gray-600">
                      Your digital residency certificate as an NFT.
                    </p>
                  </div>

                  {/* NFT Display */}
                  <div className="border border-gray-200 rounded-xl p-6">
                    <div className="text-center mb-6">
                      <div className="w-40 h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mx-auto mb-6 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="text-4xl mb-2">🏔️</div>
                          <div className="text-sm font-medium">DRUK</div>
                          <div className="text-xs opacity-80">{userData.nftTokenId}</div>
                        </div>
                      </div>
                      <h3 className="text-xl font-medium text-gray-900">Druk Digital Residency</h3>
                      <p className="text-base text-gray-600">Kingdom of Bhutan • 2024</p>
                    </div>

                    <div className="space-y-4 text-base">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Token ID:</span>
                        <span className="text-gray-900 font-medium">{userData.nftTokenId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Contract:</span>
                        <span className="text-gray-900 font-mono text-sm">{userData.nftContract}</span>
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

                    <div className="mt-6 pt-6 border-t">
                      <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors">
                        View on OpenSea
                      </button>
                    </div>
                  </div>

                  {/* NFT Benefits */}
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h4 className="text-lg font-medium text-blue-900 mb-4">NFT Benefits:</h4>
                    <ul className="text-base text-blue-700 space-y-2">
                      <li>• Proof of digital residency ownership</li>
                      <li>• Transferable digital asset</li>
                      <li>• Access to exclusive Druk community</li>
                      <li>• Voting rights in governance</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeSection === 'company' && (
                <div className="space-y-8">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-3">
                      Company Information
                    </h1>
                    <p className="text-base text-gray-600">
                      Coming soon - Set up your Druk digital company.
                    </p>
                  </div>
                </div>
              )}

              {activeSection === 'documents' && (
                <div className="space-y-8">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-3">
                      Documents
                    </h1>
                    <p className="text-base text-gray-600">
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