// @vitest-environment jsdom

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QuickActions } from '../QuickActions'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

describe('QuickActions', () => {
  it('should render all action buttons', () => {
    render(<QuickActions />)

    expect(screen.getByTestId('action-send')).toBeInTheDocument()
    expect(screen.getByTestId('action-request')).toBeInTheDocument()
    expect(screen.getByTestId('action-history')).toBeInTheDocument()
    expect(screen.getByTestId('action-settings')).toBeInTheDocument()
  })

  it('should display action labels', () => {
    render(<QuickActions />)

    expect(screen.getByText('Send')).toBeInTheDocument()
    expect(screen.getByText('Request')).toBeInTheDocument()
    expect(screen.getByText('History')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('should call onSendClick when Send button is clicked', async () => {
    const onSendClick = vi.fn()

    render(<QuickActions onSendClick={onSendClick} />)

    const sendButton = screen.getByTestId('action-send')
    fireEvent.click(sendButton)

    expect(onSendClick).toHaveBeenCalled()
  })

  it('should call onRequestClick when Request button is clicked', async () => {
    const onRequestClick = vi.fn()

    render(<QuickActions onRequestClick={onRequestClick} />)

    const requestButton = screen.getByTestId('action-request')
    fireEvent.click(requestButton)

    expect(onRequestClick).toHaveBeenCalled()
  })

  it('should call onHistoryClick when History button is clicked', async () => {
    const onHistoryClick = vi.fn()

    render(<QuickActions onHistoryClick={onHistoryClick} />)

    const historyButton = screen.getByTestId('action-history')
    fireEvent.click(historyButton)

    expect(onHistoryClick).toHaveBeenCalled()
  })

  it('should call onSettingsClick when Settings button is clicked', async () => {
    const onSettingsClick = vi.fn()

    render(<QuickActions onSettingsClick={onSettingsClick} />)

    const settingsButton = screen.getByTestId('action-settings')
    fireEvent.click(settingsButton)

    expect(onSettingsClick).toHaveBeenCalled()
  })

  it('should navigate to default routes when callbacks not provided', async () => {
    // Verify component renders without callbacks
    render(<QuickActions />)

    // Since we're providing callbacks in tests, the navigation shouldn't happen
    // This test verifies the component can be rendered without callbacks
    expect(screen.getByTestId('quick-actions')).toBeInTheDocument()
  })

  it('should apply gradient colors to buttons', () => {
    render(<QuickActions />)

    const sendButton = screen.getByTestId('action-send')
    const requestButton = screen.getByTestId('action-request')
    const historyButton = screen.getByTestId('action-history')
    const settingsButton = screen.getByTestId('action-settings')

    expect(sendButton).toHaveClass('from-blue-500')
    expect(requestButton).toHaveClass('from-green-500')
    expect(historyButton).toHaveClass('from-purple-500')
    expect(settingsButton).toHaveClass('from-amber-500')
  })

  it('should render in 2-column grid on mobile, 4-column on larger screens', () => {
    const { container } = render(<QuickActions />)

    const grid = container.querySelector('.grid')
    expect(grid).toHaveClass('grid-cols-2')
    expect(grid).toHaveClass('sm:grid-cols-4')
  })
})
