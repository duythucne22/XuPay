'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Bell, Lock, Eye, Volume2, Moon, Smartphone, Globe } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  transactionAlerts: boolean
  securityAlerts: boolean
  marketingEmails: boolean
}

interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private'
  showBalance: boolean
  showTransactionHistory: boolean
}

interface SystemSettings {
  darkMode: boolean
  language: 'en' | 'es' | 'fr' | 'de'
  timezone: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('notifications')
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    transactionAlerts: true,
    securityAlerts: true,
    marketingEmails: false,
  })

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'private',
    showBalance: false,
    showTransactionHistory: false,
  })

  const [system, setSystem] = useState<SystemSettings>({
    darkMode: true,
    language: 'en',
    timezone: 'UTC',
  })

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2 },
    },
  }

  const toggleSwitch = (setting: string) => {
    if (activeTab === 'notifications') {
      setNotifications((prev) => ({
        ...prev,
        [setting]: !prev[setting as keyof NotificationSettings],
      }))
    }
  }

  const privacyToggle = (setting: string) => {
    setPrivacy((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof PrivacySettings],
    }))
  }

  return (
    <motion.main
      className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <div className="w-8" />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 whitespace-nowrap border-b-2 font-semibold transition-colors ${
              activeTab === 'notifications'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 whitespace-nowrap border-b-2 font-semibold transition-colors ${
              activeTab === 'privacy'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Privacy
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2 whitespace-nowrap border-b-2 font-semibold transition-colors ${
              activeTab === 'system'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            System
          </button>
        </div>

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.div className="space-y-4" variants={itemVariants}>
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Bell size={24} /> Notification Preferences
              </h3>

              <div className="space-y-4">
                {/* Email Notifications */}
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Email Notifications</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Receive updates via email</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications}
                      onChange={() => toggleSwitch('emailNotifications')}
                      className="w-5 h-5 rounded"
                    />
                  </label>
                </div>

                {/* SMS Notifications */}
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">SMS Notifications</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Receive text message alerts</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.smsNotifications}
                      onChange={() => toggleSwitch('smsNotifications')}
                      className="w-5 h-5 rounded"
                    />
                  </label>
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Push Notifications</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Browser notifications</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.pushNotifications}
                      onChange={() => toggleSwitch('pushNotifications')}
                      className="w-5 h-5 rounded"
                    />
                  </label>
                </div>

                {/* Transaction Alerts */}
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Transaction Alerts</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Notify on all transactions</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.transactionAlerts}
                      onChange={() => toggleSwitch('transactionAlerts')}
                      className="w-5 h-5 rounded"
                    />
                  </label>
                </div>

                {/* Security Alerts */}
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Security Alerts</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Login and security updates</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.securityAlerts}
                      onChange={() => toggleSwitch('securityAlerts')}
                      className="w-5 h-5 rounded"
                    />
                  </label>
                </div>

                {/* Marketing Emails */}
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Marketing Emails</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Promotions and offers</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.marketingEmails}
                      onChange={() => toggleSwitch('marketingEmails')}
                      className="w-5 h-5 rounded"
                    />
                  </label>
                </div>
              </div>

              <button className="w-full mt-6 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-colors">
                Save Preferences
              </button>
            </div>
          </motion.div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <motion.div className="space-y-4" variants={itemVariants}>
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Eye size={24} /> Privacy Controls
              </h3>

              <div className="space-y-4">
                {/* Profile Visibility */}
                <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Profile Visibility
                  </label>
                  <select
                    value={privacy.profileVisibility}
                    onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="public">Public - Anyone can see</option>
                    <option value="friends">Friends - Friends only</option>
                    <option value="private">Private - Only me</option>
                  </select>
                </div>

                {/* Show Balance */}
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Show Wallet Balance</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Visible in public profile</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacy.showBalance}
                      onChange={() => privacyToggle('showBalance')}
                      className="w-5 h-5 rounded"
                    />
                  </label>
                </div>

                {/* Show Transaction History */}
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Show Transaction History</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Visible in public profile</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacy.showTransactionHistory}
                      onChange={() => privacyToggle('showTransactionHistory')}
                      className="w-5 h-5 rounded"
                    />
                  </label>
                </div>
              </div>

              <button className="w-full mt-6 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-colors">
                Save Settings
              </button>
            </div>
          </motion.div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <motion.div className="space-y-4" variants={itemVariants}>
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Smartphone size={24} /> System Settings
              </h3>

              <div className="space-y-4">
                {/* Language */}
                <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <Globe size={16} /> Language
                  </label>
                  <select
                    value={system.language}
                    onChange={(e) => setSystem({ ...system, language: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>

                {/* Timezone */}
                <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Timezone
                  </label>
                  <select
                    value={system.timezone}
                    onChange={(e) => setSystem({ ...system, timezone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time (EST)</option>
                    <option value="CST">Central Time (CST)</option>
                    <option value="MST">Mountain Time (MST)</option>
                    <option value="PST">Pacific Time (PST)</option>
                  </select>
                </div>

                {/* Dark Mode */}
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Moon size={18} /> Dark Mode
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Enable dark theme</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={system.darkMode}
                      onChange={() => setSystem({ ...system, darkMode: !system.darkMode })}
                      className="w-5 h-5 rounded"
                    />
                  </label>
                </div>
              </div>

              <button className="w-full mt-6 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-colors">
                Save Settings
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.main>
  )
}
