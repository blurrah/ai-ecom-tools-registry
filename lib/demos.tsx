import { promises as fs } from "fs";
import path from "path";
import type { CalculatorResult } from "@/registry/ai-tools/tools/calculator/tool";
import { calculatorTool } from "@/registry/ai-tools/tools/calculator/tool";
import type { MarkdownResult } from "@/registry/ai-tools/tools/markdown/tool";
import type { NewsSearchResult } from "@/registry/ai-tools/tools/news/tool";
import { newsSearchTool } from "@/registry/ai-tools/tools/news/tool";
import type { QRCodeResult } from "@/registry/ai-tools/tools/qrcode/tool";
import { qrCodeTool } from "@/registry/ai-tools/tools/qrcode/tool";
import { ProductSearchComponent } from "@/registry/ai-tools/tools/search-products/component";
import type { ProductSearchResult } from "@/registry/ai-tools/tools/search-products/tool";
import type { PublicStatsResult } from "@/registry/ai-tools/tools/stats/tool";
import type { TimeNowResult } from "@/registry/ai-tools/tools/time/tool";
import type { TranslateResult } from "@/registry/ai-tools/tools/translate/tool";
// Renderers
// Tool types + tools where needed
import type { GetWeatherResult } from "@/registry/ai-tools/tools/weather/tool";
import { getWeatherTool } from "@/registry/ai-tools/tools/weather/tool";
import type { WebSearchResult } from "@/registry/ai-tools/tools/websearch/tool";
import { webSearchTool } from "@/registry/ai-tools/tools/websearch/tool";

const read = (p: string) => fs.readFile(path.join(process.cwd(), p), "utf8");

const safe = async <T,>(fn: () => Promise<T>, fallback: T): Promise<T> => {
	try {
		return await fn();
	} catch {
		return fallback;
	}
};

export async function loadDemos() {
	// Weather
	const weatherFallback: GetWeatherResult = {
		location: "San Francisco",
		unit: "C",
		temperature: 21,
		condition: "Sunny",
		high: 24,
		low: 18,
		humidity: 0.45,
		windKph: 8,
		icon: "weather-sun",
	};
	const weatherDemo = await safe<GetWeatherResult>(
		// @ts-expect-error - getWeatherTool is not typed
		() => getWeatherTool.execute({ location: "San Francisco", unit: "C" }),
		weatherFallback,
	);

	// News
	const newsFallback: NewsSearchResult = {
		topic: "AI",
		items: [
			{
				id: "ai-1",
				title: "AI breakthrough announced",
				url: "https://example.com/ai-1",
				publishedAt: new Date().toISOString(),
			},
			{
				id: "ai-2",
				title: "New model sets benchmark",
				url: "https://example.com/ai-2",
				publishedAt: new Date().toISOString(),
			},
			{ id: "ai-3", title: "Tooling ecosystem expands" },
		],
	};
	const newsDemo = await safe<NewsSearchResult>(
		// @ts-expect-error - newsSearchTool is not typed
		() => newsSearchTool.execute({ topic: "AI", limit: 5 }),
		newsFallback,
	);

	// Calculator
	const calcFallback: CalculatorResult = {
		a: 7,
		b: 3,
		operator: "+",
		result: 10,
	};
	const calcDemo = await safe<CalculatorResult>(
		// @ts-expect-error - calculatorTool is not typed
		() => calculatorTool.execute({ a: 7, b: 3, operator: "+" }),
		calcFallback,
	);

	// Translate
	const translateFallback: TranslateResult = {
		text: "Hello, world!",
		targetLanguage: "es",
		translated: "¡Hola, mundo!",
	};
	const translateDemo = translateFallback;

	// Time Now
	const timeFallback: TimeNowResult = {
		timeZone: "UTC",
		iso: new Date().toISOString(),
		formatted: new Date().toUTCString(),
	};
	const timeDemo = timeFallback;

	// Websearch — live query (no static fallback)
	let webDemo: WebSearchResult;
	try {
		// @ts-expect-error - webSearchTool is not typed
		webDemo = await webSearchTool.execute({ query: "chatgpt", limit: 5 });
	} catch {
		// If the live query fails, return an empty result set to keep UI stable
		webDemo = { query: "chatgpt", results: [] };
	}

	// Markdown
	const mdFallback: MarkdownResult = {
		markdown: `# Hello World\n\nThis is **markdown**.\n\n- Item one\n- Item two\n\n> Tip: You can copy the tool code from the left.`,
	};
	const mdDemo = mdFallback;

	// Public Stats (USGS) — live client-side fetch in component; no server fetch.
	const statsDemo: PublicStatsResult | null = null;

	// QR Code — no fallback, surface errors
	let qrDemo: QRCodeResult | null = null;
	let qrError: { error: string } | null = null;
	try {
		// @ts-expect-error - qrCodeTool is not typed
		qrDemo = await qrCodeTool.execute({
			data: "https://ai-tools-registry.vercel.app",
			size: 300,
		});
	} catch (err) {
		qrError = {
			error: err instanceof Error ? err.message : "QR code generation failed",
		};
	}

	// Product Search
	const productSearchFallback: ProductSearchResult = {
		products: [
			{
				product_id: "1",
				title: "Product 1",
				variants: [
					{
						variant_id: "1",
						title: "Variant 1",
						price: "100",
						currency: "USD",
					},
				],
				url: "https://example.com/product-1",
				image_url:
					"https://demo.vercel.store/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0754%2F3727%2F7491%2Ffiles%2Ft-shirt-1.png%3Fv%3D1689798965&w=3840&q=75",
				description: "Product 1 description",
				price_range: {
					currency: "USD",
					max: "100",
					min: "50",
				},
			},
			{
				product_id: "2",
				title: "Product 2",
				variants: [
					{
						variant_id: "1",
						title: "Variant 2",
						price: "100",
						currency: "USD",
					},
				],
				url: "https://example.com/product-2",
				image_url:
					"https://demo.vercel.store/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0754%2F3727%2F7491%2Ffiles%2Fcup-black.png%3Fv%3D1690003088&w=1200&q=75",
				description: "Product 2 description",
				price_range: {
					currency: "USD",
					max: "150",
					min: "100",
				},
			},
		],
	};
	const productSearchDemo = productSearchFallback;

	// Read code for copy blocks
	const [codeSearchProducts, codeSearchProductsCmp] = await Promise.all([
		read("registry/ai-tools/tools/search-products/tool.ts"),
		read("registry/ai-tools/tools/search-products/component.tsx"),
	]);

	return {
		searchProducts: {
			json: {},
			code: codeSearchProducts,
			componentCode: codeSearchProductsCmp,
			renderer: <ProductSearchComponent data={productSearchDemo} />,
		},
	};
}
