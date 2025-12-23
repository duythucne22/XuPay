import type { Meta, StoryObj } from '@storybook/react'
import MinimalFooter from './MinimalFooter'

const meta: Meta<typeof MinimalFooter> = {
  title: 'UI/MinimalFooter',
}
export default meta

type Story = StoryObj<typeof MinimalFooter>

export const Default: Story = {
  render: () => <MinimalFooter />,
}
