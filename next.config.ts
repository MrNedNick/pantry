import path from 'node:path'
import type { NextConfig } from 'next'

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // This project sits inside a folder that holds several unrelated repos, each
  // with its own lockfile. Pin the root so Turbopack never walks out of it.
  turbopack: { root: path.resolve(import.meta.dirname) },
}

export default config
