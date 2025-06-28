import { useState } from 'react';

const SettingsTab = () => {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    country: 'United States',
    timezone: 'America/New_York',
    language: 'en',
    notifications: {
      email: true,
      sms: true,
      push: false,
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        notifications: {
          ...formData.notifications,
          [name]: checked,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setSuccessMessage('Your settings have been updated successfully!');
      setIsSubmitting(false);
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Profile Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your personal information and account settings
        </p>
      </div>

      {successMessage && (
        <div className="rounded-md bg-green-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
          <p className="mt-1 text-sm text-gray-500">Update your personal details.</p>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
              />
            </div>

            <div className="col-span-6 sm:col-span-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
              />
            </div>

            <div className="col-span-6 sm:col-span-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone number
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
              >
                <option>United States</option>
                <option>Canada</option>
                <option>Mexico</option>
                <option>United Kingdom</option>
                <option>Australia</option>
                <option>Germany</option>
                <option>France</option>
                <option>Japan</option>
              </select>
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                Timezone
              </label>
              <select
                id="timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
              </select>
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                Language
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="ja">日本語</option>
                <option value="zh">中文</option>
              </select>
            </div>
          </div>
        </div>

        <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Notification Preferences</h3>
          <p className="mt-1 text-sm text-gray-500">Manage how you receive notifications.</p>
        </div>

        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="email-notifications"
                  name="email"
                  type="checkbox"
                  checked={formData.notifications.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded disabled:bg-gray-100"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="email-notifications" className="font-medium text-gray-700">
                  Email notifications
                </label>
                <p className="text-gray-500">Get notified via email for important updates.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="sms-notifications"
                  name="sms"
                  type="checkbox"
                  checked={formData.notifications.sms}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded disabled:bg-gray-100"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="sms-notifications" className="font-medium text-gray-700">
                  SMS notifications
                </label>
                <p className="text-gray-500">Get important updates via text message.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="push-notifications"
                  name="push"
                  type="checkbox"
                  checked={formData.notifications.push}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded disabled:bg-gray-100"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="push-notifications" className="font-medium text-gray-700">
                  Push notifications
                </label>
                <p className="text-gray-500">Get push notifications on your device.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  // Reset form to initial state
                  setFormData({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    phone: '+1 (555) 123-4567',
                    country: 'United States',
                    timezone: 'America/New_York',
                    language: 'en',
                    notifications: {
                      email: true,
                      sms: true,
                      push: false,
                    },
                  });
                }}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </form>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Account</h3>
          <p className="mt-1 text-sm text-gray-500">Manage your account settings.</p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Change Password</h4>
                <p className="text-sm text-gray-500">Update your account password</p>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Change
              </button>
            </div>

            <div className="border-t border-gray-200"></div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Enable
              </button>
            </div>

            <div className="border-t border-gray-200"></div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-red-700">Delete Account</h4>
                <p className="text-sm text-gray-500">Permanently delete your account and all associated data</p>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
