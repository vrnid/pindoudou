import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: './' 确保打包后的 index.html 使用相对路径引用 JS/CSS
  // 这对于部署到 GitHub Pages 的子目录（如 /pindoudou/）至关重要
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true, // 每次打包前清空 dist 目录
  }
})