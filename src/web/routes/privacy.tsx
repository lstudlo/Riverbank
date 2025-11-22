import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import privacyData from "@/lib/data/privacy.json"

export const Route = createFileRoute('/privacy')({
	component: PrivacyPolicy,
})

function PrivacyPolicy() {
	// Set document title
	useEffect(() => {
		document.title = "Privacy Policy - Riverbank";
	}, []);

	return (
		<div className="min-h-screen bg-background font-sans flex flex-col transition-colors">
			<Header />

			<main className="flex-1 flex flex-col items-center justify-start px-4 py-12">
				<div className="w-full max-w-3xl">
					<Link to="/">
						<Button variant="ghost" className="mb-8 -ml-4 text-muted-foreground hover:text-foreground">
							<ChevronLeft className="mr-2 h-4 w-4" />
							Back to Home
						</Button>
					</Link>

					<div className="bg-muted/30 rounded-2xl border border-border/50 p-8 md:p-12 backdrop-blur-sm">
						<header className="mb-8 text-center border-b border-border/30 pb-6">
							<h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-2">
								{privacyData.title}
							</h1>
							<p className="text-sm text-muted-foreground">
								Last updated: {privacyData.last_updated}
							</p>
						</header>

						<div className="space-y-8">
							{privacyData.content.map((section, index) => (
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
			</main>

			<Footer />
		</div>
	)
}
