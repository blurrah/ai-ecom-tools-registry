import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { tool } from "ai";
import { z } from "zod";
import { getMcpClient } from "./client.js";

// Auto-generated wrapper for MCP tool: search_shop_catalog
// Source: https://madeincookware.myshopify.com/api/mcp
export const search_shop_catalogToolWithClient = (
	getClient: () => Promise<Client> | Client,
) =>
	tool({
		description: `Search for products from the online store, hosted on Shopify.

This tool can be used to search for products using natural language queries, specific filter criteria, or both.

Best practices:
- Searches return available_filters which can be used for refined follow-up searches
- When filtering, use ONLY the filters from available_filters in follow-up searches
- For specific filter searches (category, variant option, product type, etc.), use simple terms without the filter name (e.g., "red" not "red color")
- For filter-specific searches (e.g., "find burton in snowboards" or "show me all available products in gray / green color"), use a two-step approach:
  1. Perform a normal search to discover available filters
  2. If relevant filters are returned, do a second search using the proper filter (productType, category, variantOption, etc.) with just the specific search term
- Results are paginated, with initial results limited to improve experience
- Use the after parameter with endCursor to fetch additional pages when users request more results

The response includes product details, available variants, filter options, and pagination info.
`,
		inputSchema: z.object({
			query: z.string().describe("A natural language query."),
			filters: z
				.array(
					z.object({
						available: z
							.boolean()
							.describe("Filter on if the product is available for sale")
							.default(true),
						category: z
							.object({
								id: z.string().describe("Category ID to filter by").optional(),
							})
							.describe("Category ID to filter by")
							.optional(),
						price: z
							.object({
								min: z
									.number()
									.describe(
										"Minimum price to filter by, represented as a float, e.g. 50.0",
									)
									.optional(),
								max: z
									.number()
									.describe(
										"Maximum price to filter by, represented as a float, e.g. 100.0",
									)
									.optional(),
							})
							.describe("Price range to filter by")
							.optional(),
						productMetafield: z
							.object({
								key: z
									.string()
									.describe("The key of the metafield to filter by")
									.optional(),
								namespace: z
									.string()
									.describe("The namespace of the metafield to filter by")
									.optional(),
								value: z
									.string()
									.describe("The value of the metafield to filter by")
									.optional(),
							})
							.describe("Filter on a product metafield")
							.optional(),
						productType: z
							.string()
							.describe("Product type to filter by")
							.optional(),
						productVendor: z
							.string()
							.describe("Product vendor to filter by")
							.optional(),
						tag: z.string().describe("Tag to filter by").optional(),
						taxonomyMetafield: z
							.object({
								key: z.string().optional(),
								namespace: z.string().optional(),
								value: z.string().optional(),
							})
							.describe("Taxonomy metafield to filter by")
							.optional(),
						variantMetafield: z
							.object({
								key: z
									.string()
									.describe("The key of the metafield to filter by")
									.optional(),
								namespace: z
									.string()
									.describe("The namespace of the metafield to filter by")
									.optional(),
								value: z
									.string()
									.describe("The value of the metafield to filter by")
									.optional(),
							})
							.describe("Variant metafield to filter by")
							.optional(),
						variantOption: z
							.object({
								name: z
									.string()
									.describe("Name of the variant option to filter by")
									.optional(),
								value: z
									.string()
									.describe("Value of the variant option to filter by")
									.optional(),
							})
							.describe("Variant option to filter by")
							.optional(),
					}),
				)
				.describe(
					`Filters to apply to the search. Only apply filters from the available_filters returned in a previous response.`,
				)
				.optional(),
			country: z
				.string()
				.describe(
					`ISO 3166-1 alpha-2 country code for which to return localized results (e.g., 'US', 'CA', 'GB').`,
				)
				.optional(),
			language: z
				.string()
				.describe(
					`ISO 639-1 language code for which to return localized results (e.g., 'EN', 'FR', 'DE').`,
				)
				.optional(),
			limit: z
				.number()
				.int()
				.describe(
					`Maximum number of products to return. Defaults to 10, maximum is 250. For better user experience, use the default of 10 and ask the user if they want to see more results.`,
				)
				.default(10),
			after: z
				.string()
				.describe(
					`Pagination cursor to fetch the next page of results. Use the endCursor from the previous response. Only use this when the user explicitly asks to see more results.`,
				)
				.optional(),
			context: z
				.string()
				.describe(
					`Additional information about the request such as user demographics, mood, location, or other relevant details that could help in tailoring the response appropriately.`,
				),
		}),

		execute: async (args): Promise<ProductSearchResult> => {
			const client = await getClient();
			const result = (await client.callTool({
				name: "search_shop_catalog",
				arguments: args,
			})) as { content: ProductSearchResult };

			return result.content;
		},
	});

const productSchema = z.object({
	product_id: z.string(),
	title: z.string(),
	variants: z
		.array(
			z.object({
				variant_id: z.string(),
				title: z.string(),
				price: z.string(),
				currency: z.string(),
				image_url: z.string().optional(),
			}),
		)
		.optional(),
	url: z.string().optional(),
	image_url: z.string().optional(),
	description: z.string().optional(),
	price_range: z
		.object({
			currency: z.string(),
			max: z.string(),
			min: z.string(),
		})
		.optional(),
});

export interface ProductSearchResult {
	text: string;
	products: Array<Product>;
}

type Product = z.infer<typeof productSchema>;

export default search_shop_catalogToolWithClient(getMcpClient);
