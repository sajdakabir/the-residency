'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type UserData = {
  id: string;
  fullName: string;
  email: string;
  passportNumber?: string;
  kyc?: {
    status: string;
    submittedAt: string;
    selfieUrl?: string;
    address?: string;
    country?: string;
  } | null;
  hasKyc: boolean;
  kycStatus: string;
  nftTokenId?: string;
  nftContract?: string;
  applicationDate?: string;
  approvalDate?: string;
  residencyId?: string;
};

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  
  // Entity registration state
  const [showCompanyForm, setShowCompanyForm] = useState(false)
  const [currentFormStep, setCurrentFormStep] = useState(1)
  const [companyFormData, setCompanyFormData] = useState({
    // Section 1: Basic Company Info
    companyName: '',
    companyType: '',
    businessActivity: '',
    jurisdiction: 'Bhutan',
    virtualOfficeOptIn: false,
    // Section 2: Ownership & Control
    ownerDirector: '', // Will be auto-filled from user data
    coFounders: [] as Array<{id: number, name: string, email: string}>,
    governanceModel: '',
    // Section 3: Documentation
    bylawsFile: null as File | null,
    termsAccepted: false,
    // Section 4: Payment
    bitcoinAddress: '',
    paymentConfirmed: false
  })
  const [newCoFounder, setNewCoFounder] = useState({ name: '', email: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [companyData, setCompanyData] = useState<any>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          router.push('/');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data.data);
        
        // Auto-fill owner/director name from user data
        setCompanyFormData(prev => ({
          ...prev,
          ownerDirector: data.data.fullName
        }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setError(errorMessage);
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleCompanyFormChange = (field: string, value: any) => {
    setCompanyFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addCoFounder = () => {
    if (newCoFounder.name && newCoFounder.email) {
      setCompanyFormData(prev => ({
        ...prev,
        coFounders: [...prev.coFounders, { ...newCoFounder, id: Date.now() }]
      }))
      setNewCoFounder({ name: '', email: '' })
    }
  }

  const removeCoFounder = (id: number) => {
    setCompanyFormData(prev => ({
      ...prev,
      coFounders: prev.coFounders.filter(cf => cf.id !== id)
    }))
  }

  const handleFormSubmit = () => {
    // Mock company registration
    const mockCompanyData = {
      registrationNumber: 'BT-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      taxId: 'TAX-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      registrationDate: new Date().toLocaleDateString(),
      status: 'Active',
      ...companyFormData
    }
    setCompanyData(mockCompanyData)
    setIsSubmitted(true)
    setShowCompanyForm(false)
  }

  const downloadCertificate = () => {
    // Mock PDF download
    alert('Digital Certificate would be downloaded here (PDF generation not implemented in MVP)')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error || 'User data not found'}</div>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: 'home' },
    { id: 'kyc', label: 'KYC Status', icon: 'check' },
    { id: 'nft', label: 'Residency NFT', icon: 'badge' },
    { id: 'company', label: 'Entities', icon: 'building' },
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
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex w-full max-w-5xl h-auto min-h-[600px] max-h-[80vh]">
          {/* Left side - Sidebar */}
          <div className="w-80 bg-gray-50 border-r flex-shrink-0">
            <div className="p-6 h-full">
              {/* User Profile */}
              <div className="mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-semibold text-blue-600">
                    {userData.fullName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{userData.fullName}</h2>
                <p className="text-sm text-gray-600">{userData.email}</p>
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
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 p-8 px-12 overflow-y-auto">
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
                          <p className="text-sm font-medium text-green-900">KYC Status:</p>
                          <p className={`text-sm font-medium ${
                            userData.kycStatus === 'approved' ? 'text-green-600' : 
                            userData.kycStatus === 'pending' ? 'text-yellow-600' : 
                            userData.kycStatus === 'rejected' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {userData.kycStatus.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">NFT Minted</h3>
                          <p className="text-xs text-gray-600">Your digital identity is ready</p>
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
                          <div className="text-xs opacity-80">{userData?.nftTokenId || 'N/A'}</div>
                        </div>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">Druk Digital Residency</h3>
                      <p className="text-sm text-gray-600">Kingdom of Bhutan • 2024</p>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Token ID:</span>
                        <span className="text-gray-900 font-medium">{userData?.nftTokenId || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Contract:</span>
                        <span className="text-gray-900 font-mono text-xs">{userData?.nftContract || 'N/A'}</span>
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
                  {!showCompanyForm && !isSubmitted && (
                    <div className="ml-8">
                      <h1 className="text-xl font-semibold text-gray-900 mb-2">
                        Entity Information
                      </h1>
                      <p className="text-sm text-gray-600 mb-6">
                        Register your digital entity in Bhutan's innovative business environment.
                      </p>
                      
                      <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Why Register in Bhutan?</h3>
                        <ul className="text-sm text-gray-700 space-y-2">
                          <li>• Full digital incorporation process</li>
                          <li>• Blockchain-verified certificates</li>
                          <li>• Crypto-friendly regulations</li>
                          <li>• International market access</li>
                          <li>• Virtual office solutions</li>
                        </ul>
                      </div>

                      <button
                        onClick={() => setShowCompanyForm(true)}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
                      >
                        Apply for Entity Registration
                      </button>
                    </div>
                  )}

                  {showCompanyForm && (
                    <div className="ml-8">
                      <div className="flex items-center justify-between mb-6">
                        <h1 className="text-xl font-semibold text-gray-900">
                          Entity Registration
                        </h1>
                        <button
                          onClick={() => setShowCompanyForm(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Progress Steps */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between">
                          {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                currentFormStep >= step 
                                  ? 'bg-gray-900 text-white' 
                                  : 'bg-gray-200 text-gray-500'
                              }`}>
                                {step}
                              </div>
                              {step < 4 && (
                                <div className={`w-12 h-0.5 mx-2 ${
                                  currentFormStep > step ? 'bg-gray-900' : 'bg-gray-200'
                                }`} />
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-600">
                          <span>Basic Info</span>
                          <span>Ownership</span>
                          <span>Documentation</span>
                          <span>Payment</span>
                        </div>
                      </div>

                      {/* Step 1: Basic Company Info */}
                      {currentFormStep === 1 && (
                        <div className="space-y-4">
                          <h2 className="text-lg font-medium text-gray-900">Section 1: Basic Company Info</h2>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Company Name *
                            </label>
                            <input
                              type="text"
                              value={companyFormData.companyName}
                              onChange={(e) => handleCompanyFormChange('companyName', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
                              placeholder="Enter your company name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Company Type *
                            </label>
                            <select
                              value={companyFormData.companyType}
                              onChange={(e) => handleCompanyFormChange('companyType', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
                            >
                              <option value="">Select company type</option>
                              <option value="LLC">LLC</option>
                              <option value="DAO">DAO</option>
                              <option value="SoloOp">SoloOp</option>
                              <option value="Co-operative">Co-operative</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Business Activity *
                            </label>
                            <textarea
                              value={companyFormData.businessActivity}
                              onChange={(e) => handleCompanyFormChange('businessActivity', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
                              placeholder="Describe what your company does"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Jurisdiction
                            </label>
                            <select
                              value={companyFormData.jurisdiction}
                              onChange={(e) => handleCompanyFormChange('jurisdiction', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
                            >
                              <option value="Bhutan">Bhutan</option>
                              <option value="Future">Future Jurisdictions</option>
                            </select>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="virtualOffice"
                              checked={companyFormData.virtualOfficeOptIn}
                              onChange={(e) => handleCompanyFormChange('virtualOfficeOptIn', e.target.checked)}
                              className="mr-2"
                            />
                            <label htmlFor="virtualOffice" className="text-sm text-gray-700">
                              Opt-in for Virtual Office Address
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Step 2: Ownership & Control */}
                      {currentFormStep === 2 && (
                        <div className="space-y-4">
                          <h2 className="text-lg font-medium text-gray-900">Section 2: Ownership & Control</h2>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Owner/Director
                            </label>
                            <input
                              type="text"
                              value={companyFormData.ownerDirector}
                              readOnly
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                            />
                            <p className="text-xs text-gray-500 mt-1">Auto-filled from your e-Residency profile</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Co-founders (Optional)
                            </label>
                            
                            {companyFormData.coFounders.map((coFounder) => (
                              <div key={coFounder.id} className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-gray-700 flex-1">
                                  {coFounder.name} ({coFounder.email})
                                </span>
                                <button
                                  onClick={() => removeCoFounder(coFounder.id)}
                                  className="text-red-500 hover:text-red-700 text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}

                            <div className="space-y-2 mt-2">
                              <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                  type="text"
                                  placeholder="Co-founder name"
                                  value={newCoFounder.name}
                                  onChange={(e) => setNewCoFounder(prev => ({...prev, name: e.target.value}))}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
                                />
                                <input
                                  type="email"
                                  placeholder="Co-founder email"
                                  value={newCoFounder.email}
                                  onChange={(e) => setNewCoFounder(prev => ({...prev, email: e.target.value}))}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
                                />
                              </div>
                              <button
                                onClick={addCoFounder}
                                className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors"
                              >
                                Add Co-founder
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Governance Model *
                            </label>
                            <select
                              value={companyFormData.governanceModel}
                              onChange={(e) => handleCompanyFormChange('governanceModel', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
                            >
                              <option value="">Select governance model</option>
                              <option value="Centralized">Centralized</option>
                              <option value="Multi-sig">Multi-sig</option>
                              <option value="Token Voting">Token Voting (for DAOs)</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Documentation */}
                      {currentFormStep === 3 && (
                        <div className="space-y-4">
                          <h2 className="text-lg font-medium text-gray-900">Section 3: Documentation</h2>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Upload Bylaws / Charter (Optional)
                            </label>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => handleCompanyFormChange('bylawsFile', e.target.files?.[0] || null)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX files only</p>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start">
                              <input
                                type="checkbox"
                                id="termsAccepted"
                                checked={companyFormData.termsAccepted}
                                onChange={(e) => handleCompanyFormChange('termsAccepted', e.target.checked)}
                                className="mt-1 mr-3"
                              />
                              <label htmlFor="termsAccepted" className="text-sm text-gray-700">
                                I agree to Bhutan's digital incorporation rules and understand that this registration will be recorded on the blockchain for transparency and verification purposes.
                              </label>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 4: Payment */}
                      {currentFormStep === 4 && (
                        <div className="space-y-6">
                          <h2 className="text-lg font-medium text-gray-900">Section 4: Payment</h2>
                          
                          {/* Pricing Summary */}
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Order Summary</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Entity Registration Fee</span>
                                <span className="text-gray-900">$299.00</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Processing Fee</span>
                                <span className="text-gray-900">$9.00</span>
                              </div>
                              {companyFormData.virtualOfficeOptIn && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Virtual Office (Annual)</span>
                                  <span className="text-gray-900">$120.00</span>
                                </div>
                              )}
                              <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between font-medium">
                                  <span className="text-gray-900">Total (USD)</span>
                                  <span className="text-gray-900">
                                    ${companyFormData.virtualOfficeOptIn ? '428.00' : '308.00'}
                                  </span>
                                </div>
                                <div className="flex justify-between mt-1">
                                  <span className="text-gray-600 text-xs">Bitcoin Amount</span>
                                  <span className="text-gray-900 text-xs font-mono">
                                    ≈ {companyFormData.virtualOfficeOptIn ? '0.00614' : '0.00442'} BTC
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Payment Form */}
                          <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-900">Bitcoin Payment</h3>
                            
                            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                              <h4 className="text-sm font-medium text-orange-900 mb-2">Payment Instructions</h4>
                              <p className="text-xs text-orange-700 mb-3">
                                Send exactly <strong>{companyFormData.virtualOfficeOptIn ? '0.00614' : '0.00442'} BTC</strong> to the address below. Payment will be confirmed automatically.
                              </p>
                              <div className="bg-white rounded-md p-3 border border-orange-200">
                                <div className="text-xs text-gray-500 mb-1">Send to this address:</div>
                                <div className="font-mono text-sm text-gray-900 break-all">
                                  bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                                </div>
                                <button 
                                  onClick={() => navigator.clipboard.writeText('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh')}
                                  className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                                >
                                  Copy Address
                                </button>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Your Bitcoin Address *
                              </label>
                              <input
                                type="text"
                                value={companyFormData.bitcoinAddress}
                                onChange={(e) => handleCompanyFormChange('bitcoinAddress', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none font-mono"
                                placeholder="Enter your Bitcoin address for refunds"
                              />
                              <p className="text-xs text-gray-500 mt-1">We'll use this address for any refunds if needed</p>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="paymentConfirmed"
                                checked={companyFormData.paymentConfirmed}
                                onChange={(e) => handleCompanyFormChange('paymentConfirmed', e.target.checked)}
                                className="mr-2"
                              />
                              <label htmlFor="paymentConfirmed" className="text-sm text-gray-700">
                                I have sent the Bitcoin payment to the address above
                              </label>
                            </div>

                            {/* Security Notice */}
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span className="text-xs text-gray-600">
                                  Bitcoin payments are irreversible. Please double-check the address.
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Form Navigation */}
                      <div className="flex justify-between pt-6 border-t">
                        <button
                          onClick={() => currentFormStep > 1 ? setCurrentFormStep(currentFormStep - 1) : setShowCompanyForm(false)}
                          className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                        >
                          {currentFormStep > 1 ? '← Previous' : 'Cancel'}
                        </button>
                        
                        <button
                          onClick={() => {
                            if (currentFormStep < 4) {
                              setCurrentFormStep(currentFormStep + 1)
                            } else {
                              handleFormSubmit()
                            }
                          }}
                          disabled={
                            (currentFormStep === 1 && (!companyFormData.companyName || !companyFormData.companyType || !companyFormData.businessActivity)) ||
                            (currentFormStep === 2 && !companyFormData.governanceModel) ||
                            (currentFormStep === 3 && !companyFormData.termsAccepted) ||
                            (currentFormStep === 4 && (!companyFormData.bitcoinAddress || !companyFormData.paymentConfirmed))
                          }
                          className="bg-gray-900 text-white px-6 py-2 rounded-md font-medium text-sm hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          {currentFormStep === 4 ? 'Submit Registration' : 'Continue →'}
                        </button>
                      </div>
                    </div>
                  )}

                  {isSubmitted && companyData && (
                    <div className="ml-8 space-y-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                          Entity Registered Successfully!
                        </h2>
                        <p className="text-sm text-gray-600">
                          Your entity has been incorporated in Bhutan's digital registry.
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Company Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Company Name:</span>
                            <span className="text-gray-900 font-medium">{companyData.companyName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Registration Number:</span>
                            <span className="text-gray-900 font-medium">{companyData.registrationNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Tax ID:</span>
                            <span className="text-gray-900 font-medium">{companyData.taxId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Registration Date:</span>
                            <span className="text-gray-900 font-medium">{companyData.registrationDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Status:</span>
                            <span className="text-green-600 font-medium">{companyData.status}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={downloadCertificate}
                          className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                          Download Digital Certificate
                        </button>
                        <button
                          onClick={() => {
                            setIsSubmitted(false)
                            setCompanyData(null)
                            setCompanyFormData({
                              companyName: '',
                              companyType: '',
                              businessActivity: '',
                              jurisdiction: 'Bhutan',
                              virtualOfficeOptIn: false,
                              ownerDirector: '',
                              coFounders: [],
                              governanceModel: '',
                              bylawsFile: null,
                              termsAccepted: false,
                              bitcoinAddress: '',
                              paymentConfirmed: false
                            })
                            setCurrentFormStep(1)
                          }}
                          className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                          Register Another Company
                        </button>
                      </div>
                    </div>
                  )}
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