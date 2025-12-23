import type { Meta, StoryObj } from '@storybook/react'
import Container from './Container'

const meta: Meta<typeof Container> = {
  title: 'UI/Container',
}
export default meta

type Story = StoryObj<typeof Container>

export const Default: Story = {
  render: () => (
    <Container>
      <div style={{ background: '#f8fafc', padding: 24, borderRadius: 8 }}>
        <h3 style={{ margin: 0 }}>Container Example</h3>
        <p style={{ marginTop: 8, color: '#64748b' }}>This demonstrates the centered container with consistent padding.</p>
      </div>
    </Container>
  ),
}
