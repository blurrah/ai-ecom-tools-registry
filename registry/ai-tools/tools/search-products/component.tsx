"use client";

import Image from "next/image";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "../../ui/carousel";
import type { ProductSearchResult } from "./tool";

function formatPrice(price?: number) {
	if (!price) return "N/A";
	return price.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
	});
}

export function ProductSearchComponent({
	data,
	onProductAddToCart,
	onProductGetDetails,
}: {
	data: ProductSearchResult;
	onProductAddToCart?: (
		product: ProductSearchResult["products"][number],
	) => void;
	onProductGetDetails?: (
		product: ProductSearchResult["products"][number],
	) => void;
}) {
	return (
		<Card className="w-full max-w-3xl @container/card">
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span>Products</span>
					<span className="text-muted-foreground text-sm ml-auto">
						10 found
					</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Carousel
					opts={{
						align: "start",
					}}
					className="w-full mr-4"
				>
					<CarouselContent>
						{data.products.map((product) => (
							<CarouselItem
								className="@xl/card:basis-1/2"
								key={product.product_id}
							>
								<Card>
									<CardContent>
										{product.image_url && (
											<Image
												src={product.image_url}
												alt={product.title}
												width={300}
												height={300}
												className="w-full h-48 rounded-md object-cover mb-3"
											/>
										)}
										<div className="flex flex-1 flex-col space-y-2">
											<h5 className="font-medium text-sm line-clamp-2">
												{product.title}
											</h5>

											<div className="flex items-center justify-between">
												<span className="font-semibold text-base">
													Between{" "}
													{formatPrice(Number(product.price_range?.min))} and{" "}
													{formatPrice(Number(product.price_range?.max))}
												</span>
											</div>

											{product.description && (
												<p className="line-clamp-3 text-muted-foreground text-xs">
													{product.description}
												</p>
											)}

											<div className="mt-auto flex flex-col gap-2">
												{product.url && (
													<a
														href={product.url}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-block font-medium text-primary text-sm hover:underline"
													>
														View Product →
													</a>
												)}
												<Button
													size="sm"
													className="w-full"
													onClick={() => {
														onProductAddToCart?.(product);
													}}
												>
													Add to Cart
												</Button>
												<Button
													size="sm"
													className="w-full"
													variant="outline"
													onClick={() => {
														onProductGetDetails?.(product);
													}}
												>
													Get product details
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselNext />
					<CarouselPrevious />
				</Carousel>
			</CardContent>
		</Card>
	);
}
