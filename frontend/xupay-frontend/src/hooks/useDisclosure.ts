import { useCallback, useState } from 'react'

interface DisclosureState {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onToggle: () => void
}

/**
 * Hook to manage open/close state for modals, dropdowns, etc.
 * 
 * @example
 * const { isOpen, onOpen, onClose, onToggle } = useDisclosure()
 */
export function useDisclosure(defaultOpen = false): DisclosureState {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const onOpen = useCallback(() => setIsOpen(true), [])
  const onClose = useCallback(() => setIsOpen(false), [])
  const onToggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return { isOpen, onOpen, onClose, onToggle }
}
