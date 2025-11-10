import { useState, useEffect } from 'react';
import { Save, Store, Mail, Globe, Shield, Bell, DollarSign, Truck, CheckCircle, AlertCircle } from 'lucide-react';

const SettingsAdmin = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [maintenanceSaving, setMaintenanceSaving] = useState(false);
  const [maintenanceSaved, setMaintenanceSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'BuildMart Hardware Store',
    siteDescription: 'Quality hardware and tools for professionals',
    contactEmail: 'ugwanezav@gmail.com',
    contactPhone: '+250 788 123 456',
    address: 'Kigali, Rwanda',
    currency: 'USD',
    currencySymbol: '$',
    taxRate: '18',
    shippingFee: '5000',
    freeShippingThreshold: '50000',
    emailFrom: 'noreply@hardwarestore.com',
    maintenanceMode: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('adminSettings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setSaved(false);
  };

  // Real-time save for maintenance mode
  const handleMaintenanceModeChange = async (e) => {
    const { checked } = e.target;
    
    // Update state immediately
    setSettings(prev => ({ ...prev, maintenanceMode: checked }));
    setMaintenanceSaving(true);
    
    try {
      // Save to localStorage
      const updatedSettings = { ...settings, maintenanceMode: checked };
      localStorage.setItem('adminSettings', JSON.stringify(updatedSettings));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Show success indicator
      setMaintenanceSaving(false);
      setMaintenanceSaved(true);
      
      // Clear success after 2 seconds
      setTimeout(() => {
        setMaintenanceSaved(false);
      }, 2000);
      
      console.log('✅ Maintenance mode updated:', checked ? 'ON' : 'OFF');
    } catch (error) {
      setMaintenanceSaving(false);
      console.error('Failed to update maintenance mode:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Store },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'payment', name: 'Payment', icon: DollarSign },
    { id: 'shipping', name: 'Shipping', icon: Truck },
    { id: 'security', name: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Manage your store configuration</p>
        </div>
        <button onClick={handleSave} disabled={loading} className="btn btn-primary flex items-center gap-2">
          {loading ? 'Saving...' : saved ? <><CheckCircle size={20} /> Saved!</> : <><Save size={20} /> Save</>}
        </button>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                <Icon size={18} />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="card space-y-6">
        {activeTab === 'general' && (
          <>
            <h2 className="text-xl font-semibold flex items-center gap-2"><Store size={24} />General Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Site Name</label>
                <input type="text" name="siteName" value={settings.siteName} onChange={handleChange} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contact Email</label>
                <input type="email" name="contactEmail" value={settings.contactEmail} onChange={handleChange} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contact Phone</label>
                <input type="tel" name="contactPhone" value={settings.contactPhone} onChange={handleChange} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <input type="text" name="address" value={settings.address} onChange={handleChange} className="input" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea name="siteDescription" value={settings.siteDescription} onChange={handleChange} rows="3" className="input" />
              </div>
            </div>
            <div className="border-t pt-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    name="maintenanceMode" 
                    checked={settings.maintenanceMode} 
                    onChange={handleMaintenanceModeChange}
                    className="mt-1 w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">Maintenance Mode</span>
                      {maintenanceSaving && (
                        <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                          <span className="animate-spin">⏳</span> Saving...
                        </span>
                      )}
                      {maintenanceSaved && (
                        <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                          <CheckCircle size={14} /> Saved!
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Put your store in maintenance mode</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'email' && (
          <>
            <h2 className="text-xl font-semibold flex items-center gap-2"><Mail size={24} />Email Settings</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">Configure SMTP settings in server .env file for email functionality</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">From Email</label>
              <input type="email" name="emailFrom" value={settings.emailFrom} onChange={handleChange} className="input" />
            </div>
          </>
        )}

        {activeTab === 'payment' && (
          <>
            <h2 className="text-xl font-semibold flex items-center gap-2"><DollarSign size={24} />Payment Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
                <select name="currency" value={settings.currency} onChange={handleChange} className="input">
                  <option value="USD">US Dollar (USD)</option>
                  <option value="RWF">Rwandan Franc (RWF)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Currency Symbol</label>
                <input type="text" name="currencySymbol" value={settings.currencySymbol} onChange={handleChange} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
                <input type="number" name="taxRate" value={settings.taxRate} onChange={handleChange} className="input" min="0" max="100" />
              </div>
            </div>
          </>
        )}

        {activeTab === 'shipping' && (
          <>
            <h2 className="text-xl font-semibold flex items-center gap-2"><Truck size={24} />Shipping Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Shipping Fee (FRw)</label>
                <input type="number" name="shippingFee" value={settings.shippingFee} onChange={handleChange} className="input" min="0" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Free Shipping Above (FRw)</label>
                <input type="number" name="freeShippingThreshold" value={settings.freeShippingThreshold} onChange={handleChange} className="input" />
              </div>
            </div>
          </>
        )}

        {activeTab === 'security' && (
          <>
            <h2 className="text-xl font-semibold flex items-center gap-2"><Shield size={24} />Security Settings</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">Security settings like session timeout and max login attempts are configured in the server</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsAdmin;
