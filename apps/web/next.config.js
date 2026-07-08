/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	output: 'standalone',
	images: {
		// allow loading from API and common CDNs used by project
		domains: [
			'images.unsplash.com',
			'cdn.jsdelivr.net',
			new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').host,
		].filter(Boolean),
		formats: ['image/avif', 'image/webp'],
		minimumCacheTTL: 60,
	},
	experimental: {
		// keep app dir enabled (used by project)
		serverActions: true,
	},
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{ key: 'X-Frame-Options', value: 'DENY' },
					{ key: 'X-Content-Type-Options', value: 'nosniff' },
					{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
				],
			},
			{
				source: '/_next/static/(.*)',
				headers: [
					{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
				],
			},
			{
				source: '/static/(.*)',
				headers: [
					{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
				],
			},
		];
	},
};

export default nextConfig;
