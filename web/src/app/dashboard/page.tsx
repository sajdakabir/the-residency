'use client';

import { useState } from 'react';
import Link from 'next/link';
import OverviewTab from './components/OverviewTab';
import ApplicationsTab from './components/ApplicationsTab';
import DocumentsTab from './components/DocumentsTab';
import SettingsTab from './components/SettingsTab';

interface Tab {
  id: string;
  name: string;
  component: React.ReactNode;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs: Tab[] = [
    { id: 'overview', name: 'Overview', component: <OverviewTab /> },
    { id: 'applications', name: 'My Applications', component: <ApplicationsTab /> },
    { id: 'documents', name: 'Documents', component: <DocumentsTab /> },
    { id: 'settings', name: 'Settings', component: <SettingsTab /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, Resident</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your e-Residency and applications</p>
            </div>
            <div className="flex space-x-3">
              <Link 
                href="/verify/res_123"
                target="_blank"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View My e-Residency
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </main>
    </div>
  );
}
