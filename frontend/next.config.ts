import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: [
    '@tiptap/react',
    '@tiptap/starter-kit',
    '@tiptap/pm',
    '@tiptap/core',
    '@tiptap/extension-placeholder',
    '@tiptap/extension-task-list',
    '@tiptap/extension-task-item',
  ],
}

export default nextConfig