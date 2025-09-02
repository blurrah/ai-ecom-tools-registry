import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "images.unsplash.com",
			},
			{
				hostname: "avatars.githubusercontent.com",
			},
			{
				hostname: "example.com",
			},
			{
				hostname: "cdn.shopify.com",
			},
			{
				hostname: "demo.vercel.store",
			},
		],
	},
};

export default nextConfig;
