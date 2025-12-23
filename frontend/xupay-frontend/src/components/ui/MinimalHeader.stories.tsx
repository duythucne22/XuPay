import type { Meta, StoryObj } from '@storybook/react'
import MinimalHeader from './MinimalHeader'

const meta: Meta<typeof MinimalHeader> = {
  title: 'UI/MinimalHeader',
}
export default meta

type Story = StoryObj<typeof MinimalHeader>

export const Default: Story = {
  render: () => <MinimalHeader />,
}
