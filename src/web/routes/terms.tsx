import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon } from "raster-react"
import termsData from "@/lib/data/terms.json"

export const Route = createFileRoute('/terms')({
	component: TermsOfService,
})

function TermsOfService() {
	// Set document title
	useEffect(() => {
		document.title = "Terms of Service - Riverbank";
	}, []);

	return (
		<div className="min-h-screen bg-background font-sans flex flex-col transition-colors">
			<Header />

			<main className="flex-1 flex flex-col items-center justify-start px-4 py-12">
				<div className="w-full max-w-3xl flex flex-col h-full flex-1">
					<Link to="/">
						<Button variant="ghost" className="mb-8 -ml-4 text-muted-foreground hover:text-foreground">
							<ChevronLeftIcon size={16} className="mr-2 size-4" />
							Back to Home
						</Button>
					</Link>

					<div className="bg-muted/30 rounded-none border border-border/50 backdrop-blur-sm flex flex-col h-auto">
						<header className="shrink-0 px-8 md:px-12 pt-8 md:pt-12 pb-6 text-center border-b border-border/30">
							<h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-2">
								{termsData.title}
							</h1>
							<p className="text-sm text-muted-foreground">
								Last updated: {termsData.last_updated}
							</p>
						</header>

						<div className="flex-1 overflow-y-auto px-8 md:px-12 py-8">
							<div className="space-y-8">
								{termsData.content.map((section, index) => (
									<section key={index} className="space-y-3">
										<h2 className="text-xl font-semibold text-foreground/90">
											{section.heading}
										</h2>
										<div className="text-foreground/70 leading-relaxed whitespace-pre-line text-sm md:text-base">
											{section.body}
										</div>
									</section>
								))}
							</div>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	)
}
