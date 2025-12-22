import { describe, it, expect, beforeEach } from 'vitest'
import MockUserServiceClient from '@/lib/mockUserClient'

describe('MockUserServiceClient', () => {
  let client: MockUserServiceClient

  beforeEach(() => {
    client = new MockUserServiceClient()
  })

  it('register returns AuthResponse with accessToken and user', async () => {
    const resp = await client.register({ email: 'a@b.com', password: 'P@ss1', firstName: 'Test', lastName: 'User' })
    expect(resp.accessToken).toBeDefined()
    expect(resp.user).toBeDefined()
    expect(resp.user.email).toBe('a@b.com')
  })

  it('login returns token and user', async () => {
    const r = await client.login({ email: 'login@example.com', password: 'pass' })
    expect(r.accessToken).toBeDefined()
    expect(r.user).toBeDefined()
  })

  it('getMyProfile returns a profile', async () => {
    const p = await client.getMyProfile()
    expect(p).toHaveProperty('id')
    expect(p).toHaveProperty('email')
  })
})