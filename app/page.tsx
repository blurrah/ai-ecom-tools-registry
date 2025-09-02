import * as React from "react";
import { AddCommand } from "@/components/add-command";
import { OpenInV0 } from "@/components/open-in-v0";
import PageWideScrollMask from "@/components/page-wide-adaptive-mask";
import { ToolDemoCard } from "@/components/tool-demo-card";
import { loadDemos } from "@/lib/demos";
import type { ExtendedRegistryItem } from "@/lib/registry-schemas";
import { Button } from "@/registry/ai-tools/ui/button";
import registry from "@/registry.json";

const getRegistryItemFromJson = React.cache(
	(name: string): ExtendedRegistryItem | null => {
		// Be permissive here so the homepage renders even if a registry item
		// doesn't strictly match the shadcn schema (useful while iterating).
		// @ts-expect-error registry.items is not typed
		return registry.items.find((item) => item.name === name) ?? null;
	},
);

const toolNames = [
	"search-products",
	"stats",
	"weather",
	"news",
	"calculator",
	"translate",
	"time",
	"websearch",
	"markdown",
	"qrcode",
];

export default async function Home() {
	const demos = await loadDemos();

	const items = toolNames
		.map((name) => ({ name, item: getRegistryItemFromJson(name) }))
		.filter(
			(x): x is { name: string; item: ExtendedRegistryItem } => x.item !== null,
		);

	const pack = getRegistryItemFromJson("tool-pack");

	return (
		<main className="max-w-[1600px] mx-auto flex flex-col px-4 py-8 flex-1 gap-10 md:gap-12">
			<section className="flex flex-col gap-3">
				<h1 className="text-2xl md:text-3xl font-semibold">
					AI Ecommerce Tools Registry
				</h1>
				<p className="text-sm text-muted-foreground">
					Based on the AI Tools Registry by{" "}
					<a
						href="https://github.com/xn1cklas"
						target="_blank"
						rel="noreferrer"
						className="underline"
					>
						xn1cklas
					</a>
					.
				</p>
				<p className="text-sm text-muted-foreground">
					Install AI SDK tools into your project with the shadcn CLI. Some tools
					include UI components to render the result in your chat view. <br />
					To learn how to use tools, check out the AI SDK docs.
				</p>
				<p className="text-sm text-muted-foreground">
					To add your own tools to the AI Tools Registry, file a PR on our
					public{" "}
					<a
						href="https://github.com/xn1cklas/ai-tools-registry"
						target="_blank"
						rel="noreferrer"
						className="underline"
					>
						GitHub repository
					</a>
					.
				</p>
				{pack && (
					<div className="flex items-center gap-2 mt-2 flex-wrap">
						<AddCommand name={pack.name} />
						<OpenInV0 name={pack.name} />
						<Button
							variant="ghost"
							className="text-xs text-muted-foreground"
							asChild
						>
							<a
								href="https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling"
								target="_blank"
								rel="noreferrer"
							>
								Docs: AI SDK Tool Calling →
							</a>
						</Button>
					</div>
				)}
			</section>

			<section className="grid grid-cols-1 gap-6">
				{/* Public Stats */}
				{(() => {
					const item = getRegistryItemFromJson("search-products");
					if (!item || !demos.searchProducts) return null;
					return (
						<ToolDemoCard
							key={item.name}
							registryItem={item}
							json={demos.searchProducts.json}
							code={demos.searchProducts.code}
							componentCode={demos.searchProducts.componentCode}
							renderer={demos.searchProducts.renderer}
							heading="Shopify Product Search"
							subheading="Search for products using Shopify"
						/>
					);
				})()}
			</section>

			<section className="flex flex-col gap-4">
				<div className="text-sm font-medium">All Tools</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{items.map(({ item }) => (
						<div
							key={item.name}
							className="border rounded-lg p-4 bg-muted/30 flex flex-col gap-3"
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="text-sm font-medium">{item.title}</div>
								</div>
							</div>
							<div className="text-sm text-muted-foreground line-clamp-2 min-h-[2lh]">
								{item.description}
							</div>
							<div className="flex gap-2 mt-auto">
								<AddCommand name={item.name} creator={item.creators?.[0]} />
								<OpenInV0 name={item.name} />
							</div>
						</div>
					))}
				</div>
			</section>
			<PageWideScrollMask />
		</main>
	);
}
