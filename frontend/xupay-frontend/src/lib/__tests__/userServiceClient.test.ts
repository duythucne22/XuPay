import { describe, it, expect, beforeEach, vi } from 'vitest'
import AxiosMockAdapter from 'axios-mock-adapter'
import { UserServiceClient, ApiError } from '@/lib/userServiceClient'

describe('UserServiceClient (axios behavior)', () => {
  let client: UserServiceClient
  let mock: AxiosMockAdapter

  beforeEach(() => {
    client = new UserServiceClient({ baseURL: 'http://test' })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mock = new AxiosMockAdapter((client as any).client)
    mock.reset()
  })

  it('login returns AuthResponse with token and user', async () => {
    mock.onPost('/api/auth/login').reply(200, {
      accessToken: 'tok-1',
      expiresAt: new Date().toISOString(),
      user: { id: 'u1', email: 'a@b.com', firstName: 'A', lastName: 'B', kycStatus: 'PENDING', kycTier: 'TIER_0', isActive: true, createdAt: new Date().toISOString() }
    })

    const r = await client.login({ email: 'a@b.com', password: 'x' })
    expect(r.accessToken).toBe('tok-1')
    expect(r.user.email).toBe('a@b.com')
  })

  it('getMyProfile includes Authorization header when token is set', async () => {
    // simulate browser storage
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(globalThis as any).window = {}
    const storageMock = { setItem: vi.fn(), getItem: vi.fn(() => 'tok-abc'), removeItem: vi.fn() }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(globalThis as any).localStorage = storageMock

    mock.onGet('/api/users/me/profile').reply((config) => {
      const auth = (config.headers as any).Authorization || ((config.headers as any).get && (config.headers as any).get('Authorization'))
      expect(auth).toBe('Bearer tok-abc')
      return [200, { id: 'u1', email: 'x@y.com', firstName: 'X', lastName: 'Y', kycStatus: 'PENDING', kycTier: 'TIER_0', isActive: true, isSuspended: false, fraudScore: 0, createdAt: new Date().toISOString() }]
    })

    const p = await client.getMyProfile()
    expect(p.email).toBe('x@y.com')
  })

  it('converts errors to ApiError', async () => {
    mock.onGet('/api/auth/validate').reply(500, { code: 'SERVER_ERR', message: 'boom' })

    await expect(client.validateToken()).resolves.toEqual({ valid: false })
  })

  it('setToken and clearToken use localStorage when available', () => {
    // simulate browser
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(globalThis as any).window = {}
    const storageMock = { setItem: vi.fn(), getItem: vi.fn(), removeItem: vi.fn() }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(globalThis as any).localStorage = storageMock

    client.setToken('abc')
    expect(storageMock.setItem).toHaveBeenCalledWith('accessToken', 'abc')

    client.clearToken()
    expect(storageMock.removeItem).toHaveBeenCalledWith('accessToken')
  })
})
