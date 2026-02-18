import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
	// base: './', (- for workflow and render)
	base: './', // Use relative paths for assets
	plugins: [react()],
})
