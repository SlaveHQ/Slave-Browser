import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/styles/global.css'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import { Toaster } from '@/components/ui/sonner'
import { AnalyticsProvider } from '@/lib/analytics/AnalyticsProvider.tsx'
import { AuthProvider } from '@/lib/auth/AuthProvider'
import { QueryProvider } from '@/lib/graphql/QueryProvider'
import { sentryRootErrorHandler } from '@/lib/sentry/sentryRootErrorHandler.ts'
import { App } from './App'

const store = new Map<string, any>()
const createMockStorageArea = () => ({
  get: (keys: any, cb?: any) => {
    const res: Record<string, any> = {}
    const keyList = typeof keys === 'string' ? [keys] : Array.isArray(keys) ? keys : Object.keys(keys || {})
    for (const k of keyList) {
      if (store.has(k)) res[k] = store.get(k)
    }
    if (cb) cb(res)
    return Promise.resolve(res)
  },
  set: (items: Record<string, any>, cb?: any) => {
    for (const [k, v] of Object.entries(items)) store.set(k, v)
    if (cb) cb()
    return Promise.resolve()
  },
  remove: (keys: any, cb?: any) => {
    const keyList = typeof keys === 'string' ? [keys] : Array.isArray(keys) ? keys : []
    for (const k of keyList) store.delete(k)
    if (cb) cb()
    return Promise.resolve()
  },
  clear: (cb?: any) => {
    store.clear()
    if (cb) cb()
    return Promise.resolve()
  },
  getItem: (key: string) => Promise.resolve(store.has(key) ? store.get(key) : null),
  setItem: (key: string, val: any) => { store.set(key, val); return Promise.resolve() },
  removeItem: (key: string) => { store.delete(key); return Promise.resolve() },
  onChanged: { addListener: () => {}, removeListener: () => {} },
})

const mockStorage = {
  local: createMockStorageArea(),
  sync: createMockStorageArea(),
  session: createMockStorageArea(),
  onChanged: { addListener: () => {}, removeListener: () => {} },
}

const mockRuntime = {
  id: 'browseros-agent-dev',
  getURL: (path: string) => path,
  sendMessage: () => Promise.resolve(),
  onMessage: { addListener: () => {}, removeListener: () => {} },
}

if (typeof globalThis.chrome === 'undefined' || !globalThis.chrome?.storage) {
  globalThis.chrome = {
    ...(globalThis.chrome || {}),
    storage: mockStorage,
    runtime: mockRuntime,
  } as any
}

if (typeof (globalThis as any).browser === 'undefined' || !(globalThis as any).browser?.runtime) {
  ;(globalThis as any).browser = {
    ...((globalThis as any).browser || {}),
    storage: mockStorage,
    runtime: mockRuntime,
  }
}

const $root = document.getElementById('root')

if ($root) {
  ReactDOM.createRoot($root, sentryRootErrorHandler).render(
    <React.StrictMode>
      <AuthProvider>
        <QueryProvider>
          <AnalyticsProvider>
            <ThemeProvider>
              <App />
              <Toaster />
            </ThemeProvider>
          </AnalyticsProvider>
        </QueryProvider>
      </AuthProvider>
    </React.StrictMode>,
  )
}
