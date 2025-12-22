'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

export interface Wallet {
  id: string
  name: string
  type: 'PERSONAL' | 'MERCHANT' | 'ESCROW'
  status: 'active' | 'frozen' | 'inactive'
  isDefault: boolean
}

interface WalletSettingsFormProps {
  wallet: Wallet
  onSave: (changes: Partial<Wallet>) => void
  onDelete: () => void
  isLoading?: boolean
}

export function WalletSettingsForm({
  wallet,
  onSave,
  onDelete,
  isLoading = false,
}: WalletSettingsFormProps) {
  const [name, setName] = useState(wallet.name)
  const [type, setType] = useState(wallet.type)
  const [isDefault, setIsDefault] = useState(wallet.isDefault)
  const [isFrozen, setIsFrozen] = useState(wallet.status === 'frozen')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const hasChanges =
    name !== wallet.name ||
    type !== wallet.type ||
    isDefault !== wallet.isDefault ||
    isFrozen !== (wallet.status === 'frozen')

  const handleSave = () => {
    setLocalError(null)
    setSuccessMessage(null)

    if (!name.trim()) {
      setLocalError('Wallet name cannot be empty')
      return
    }

    const changes: Partial<Wallet> = {}
    if (name !== wallet.name) changes.name = name.trim()
    if (type !== wallet.type) changes.type = type
    if (isDefault !== wallet.isDefault) changes.isDefault = isDefault
    if (isFrozen !== (wallet.status === 'frozen')) {
      changes.status = isFrozen ? 'frozen' : 'active'
    }

    onSave(changes)
    setSuccessMessage('Wallet settings updated successfully')
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  const handleDeleteClick = () => {
    if (wallet.isDefault) {
      setLocalError('Cannot delete the default wallet. Set another wallet as default first.')
      return
    }
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(false)
    onDelete()
  }

  return (
    <div className="space-y-6" data-testid="wallet-settings-form">
      {/* Error Message */}
      {localError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3"
          data-testid="settings-error-message"
        >
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{localError}</p>
        </motion.div>
      )}

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
          data-testid="settings-success-message"
        >
          <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
        </motion.div>
      )}

      {/* Wallet Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Wallet Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          placeholder="Enter wallet name"
          data-testid="wallet-name-input"
        />
      </div>

      {/* Wallet Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Wallet Type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'PERSONAL' | 'MERCHANT' | 'ESCROW')}
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          data-testid="wallet-type-select"
        >
          <option value="PERSONAL">Personal</option>
          <option value="MERCHANT">Merchant</option>
          <option value="ESCROW">Escrow</option>
        </select>
      </div>

      {/* Set as Default Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Set as Default Wallet
        </label>
        <motion.button
          type="button"
          onClick={() => setIsDefault(!isDefault)}
          disabled={isLoading}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
            isDefault
              ? 'bg-indigo-600 dark:bg-indigo-500'
              : 'bg-gray-300 dark:bg-slate-600'
          } disabled:opacity-50`}
          data-testid="wallet-default-toggle"
        >
          <motion.span
            layout
            className="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg"
            animate={{ x: isDefault ? 28 : 4 }}
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
          />
        </motion.button>
      </div>

      {/* Freeze/Unfreeze Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isFrozen ? 'Wallet is Frozen' : 'Wallet is Active'}
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {isFrozen
              ? 'Frozen wallets cannot send or receive funds'
              : 'Active wallets can send and receive funds'}
          </p>
        </div>
        <motion.button
          type="button"
          onClick={() => setIsFrozen(!isFrozen)}
          disabled={isLoading}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
            isFrozen
              ? 'bg-yellow-500 dark:bg-yellow-600'
              : 'bg-green-500 dark:bg-green-600'
          } disabled:opacity-50`}
          data-testid="wallet-freeze-toggle"
        >
          <motion.span
            layout
            className="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg"
            animate={{ x: isFrozen ? 28 : 4 }}
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
          />
        </motion.button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={!hasChanges || isLoading}
          className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          data-testid="wallet-save-button"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDeleteClick}
          disabled={isLoading}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          data-testid="wallet-delete-button"
        >
          Delete
        </motion.button>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          data-testid="wallet-delete-confirm"
        >
          <p className="text-sm font-medium text-red-900 dark:text-red-200 mb-3">
            Are you sure? This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDeleteConfirm}
              className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
            >
              Delete Wallet
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 px-3 py-2 bg-gray-300 dark:bg-slate-700 hover:bg-gray-400 dark:hover:bg-slate-600 text-gray-900 dark:text-white text-sm font-medium rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default WalletSettingsForm
