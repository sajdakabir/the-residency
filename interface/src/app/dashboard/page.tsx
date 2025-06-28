'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type KycStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected' | 'in_review';

type KycData = {
  hasKyc: boolean;
  status: KycStatus;
  submittedAt?: string;
  reviewedAt?: string | null;
  comments?: string | null;
  user?: {
    fullName: string;
    email: string;
  } | null;
};

type UserData = {
  id: string;
  fullName: string;
  email: string;
  passportNumber?: string;
  kycStatus: KycStatus;
  nftTokenId?: string;
  nftContract?: string;
  applicationDate?: string;
  approvalDate?: string;
  residencyId?: string;
};

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [kycData, setKycData] = useState<KycData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isKycLoading, setIsKycLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchKycStatus = async (userId: string) => {
    try {
      setIsKycLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/kyc/status/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch KYC status');
      }
      const data = await response.json();
      if (data.success && data.data) {
        setKycData(data.data);
      }
    } catch (error) {
      console.error('Error fetching KYC status:', error);
    } finally {
      setIsKycLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          router.push('/');
          return;
        }

        // Fetch user data
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me/${userId}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userResponse.json();
        setUserData(userData.data);

        // Fetch KYC status
        await fetchKycStatus(userId);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setError(errorMessage);
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

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
    { id: 'kyc', label: 'KYC Status', icon: 'check', count: kycData?.status === 'pending' ? '!' : undefined },
    { id: 'nft', label: 'Residency NFT', icon: 'badge' },
    { id: 'company', label: 'Company Info', icon: 'building' },
    { id: 'documents', label: 'Documents', icon: 'document' }
  ] as const;

  const getStatusBadge = (status: KycStatus) => {
    const statusConfig = {
      not_submitted: { label: 'Not Submitted', color: 'bg-gray-100 text-gray-800' },
      pending: { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Approved', color: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
      in_review: { label: 'In Review', color: 'bg-blue-100 text-blue-800' },
    };
    const config = statusConfig[status] || statusConfig.not_submitted;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const renderIcon = (iconType: string, count?: string) => {
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
          <div className="relative">
            <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {count && (
              <span className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">
                {count}
              </span>
            )}
          </div>
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

  const renderKycStatus = () => {
    if (isKycLoading) {
      return (
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      );
    }

    if (!kycData) return null;

    return (
      <div className="space-y-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">KYC Status</h3>
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Current Status</p>
                  <div className="mt-1">
                    {getStatusBadge(kycData.status)}
                  </div>
                </div>
                {kycData.status === 'approved' && kycData.reviewedAt && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">Approved On</p>
                    <p className="text-sm text-gray-900">
                      {new Date(kycData.reviewedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {kycData.status === 'rejected' && kycData.comments && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500">Comments</p>
                  <p className="mt-1 text-sm text-gray-900">{kycData.comments}</p>
                </div>
              )}

              {kycData.status === 'not_submitted' && (
                <div className="mt-6">
                  <button
                    onClick={() => router.push('/')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Start KYC Verification
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

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
                    {userData.fullName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userData.fullName}!</h1>
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
                    <span className="text-base">{renderIcon(item.icon, item.count)}</span>
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

              {activeSection === 'kyc' && renderKycStatus()}

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