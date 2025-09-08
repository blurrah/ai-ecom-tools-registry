"use client";

import * as React from "react";
import { highlight as sh } from "sugar-high";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type CodeBlockProps = {
	code: string;
	className?: string;
};

export function CodeBlock({ code, className }: CodeBlockProps) {
	const html = React.useMemo(() => sh(code), [code]);

	return (
		<ScrollArea className="flex flex-col overflow-hidden max-h-126">
			<pre className={cn("py-2", className)}>
				<code
					dangerouslySetInnerHTML={{ __html: html }}
					className="font-geist-mono text-[13px] leading-1"
				/>
			</pre>
		</ScrollArea>
	);
}

export default CodeBlock;
