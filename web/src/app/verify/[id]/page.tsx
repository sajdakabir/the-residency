'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import QRCode from 'qrcode';

interface ResidentData {
  id: string;
  fullName: string;
  email: string;
  passportNumber: string;
  country: string;
  residencyType: string;
  status: string;
  issuedAt: string;
}

export default function VerifyResident() {
  const params = useParams();
  const router = useRouter();
  const [resident, setResident] = useState<ResidentData | null>(null);
  const [qrCode, setQrCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResident = async () => {
      try {
        const response = await fetch(`/api/verify/${params.id}`);
        if (!response.ok) {
          throw new Error('Resident not found');
        }
        const data = await response.json();
        setResident(data);
        
        // Generate QR code
        const verificationUrl = `${window.location.origin}/verify/${params.id}`;
        const qrDataUrl = await QRCode.toDataURL(verificationUrl, { width: 200 });
        setQrCode(qrDataUrl);
      } catch (err) {
        console.error('Error fetching resident:', err);
        setError('Failed to load resident data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResident();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resident data...</p>
        </div>
      </div>
    );
  }

  if (error || !resident) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Resident not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-600 to-indigo-700">
            <h1 className="text-2xl font-bold text-white">
              {resident.residencyType === 'bhutan' ? 'Bhutan' : 'Draper Nation'} e-Residency
            </h1>
            <p className="mt-1 text-sm text-indigo-100">
              Digital Residency Verification
            </p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Resident Information</h2>
                    <dl className="mt-2 border-b border-gray-200 pb-5">
                      <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {resident.fullName}
                        </dd>
                      </div>
                      <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Passport Number</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {resident.passportNumber}
                        </dd>
                      </div>
                      <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Country</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {resident.country}
                        </dd>
                      </div>
                      <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${resident.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {resident.status === 'verified' ? 'Verified' : 'Pending'}
                          </span>
                        </dd>
                      </div>
                      <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Issued On</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {new Date(resident.issuedAt).toLocaleDateString()}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg">
                <div className="mb-4 p-2 bg-white rounded">
                  {qrCode && (
                    <img 
                      src={qrCode} 
                      alt="Verification QR Code" 
                      className="w-48 h-48"
                    />
                  )}
                </div>
                <p className="text-xs text-center text-gray-500 mt-2">
                  Scan to verify this e-Residency
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print ID
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-4 bg-gray-50 text-right sm:px-6">
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
