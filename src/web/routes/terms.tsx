import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export const Route = createFileRoute('/terms')({
	component: TermsOfService,
})

function TermsOfService() {
	// Set document title
	useEffect(() => {
		document.title = "Terms of Service - Riverbank";
	}, []);

	return (
		<div className="relative flex min-h-screen flex-col bg-gradient-to-b from-sky-100 to-blue-50 dark:from-slate-950 dark:to-slate-900">
			<Header />

			<main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
				<Link to="/">
					<Button variant="ghost" className="mb-6">
						<ChevronLeft className="mr-2 h-4 w-4" />
						Back to Home
					</Button>
				</Link>

				<article className="prose prose-slate dark:prose-invert max-w-none">
					<h1>Terms of Service</h1>
					<p className="text-muted-foreground">Last updated: November 22, 2025</p>

					<section>
						<h2>1. Acceptance of Terms</h2>
						<p>
							By accessing and using Riverbank ("the Service"), you accept and agree to be bound by the
							terms and provisions of this agreement. If you do not agree to these terms, please do not
							use the Service.
						</p>
					</section>

					<section>
						<h2>2. Description of Service</h2>
						<p>
							Riverbank is a digital platform that allows users to share anonymous messages in the form
							of "bottles" and receive random messages from other users worldwide. The Service is
							provided free of charge.
						</p>
					</section>

					<section>
						<h2>3. User Conduct and Community Guidelines</h2>
						<p>You agree to use the Service responsibly and not to:</p>
						<ul>
							<li>Post content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
							<li>Post content that infringes on intellectual property rights or privacy rights of others</li>
							<li>Impersonate any person or entity or falsely state or misrepresent your affiliation with a person or entity</li>
							<li>Post spam, advertisements, or unsolicited promotional content</li>
							<li>Attempt to harm, harass, or discriminate against individuals or groups</li>
							<li>Share personal information of yourself or others</li>
							<li>Attempt to manipulate, exploit, or abuse the Service</li>
						</ul>
					</section>

					<section>
						<h2>4. Content Moderation</h2>
						<p>
							Riverbank employs AI-powered content moderation to maintain a safe and respectful
							community. We reserve the right to:
						</p>
						<ul>
							<li>Review, monitor, and moderate all user-submitted content</li>
							<li>Remove or refuse to display content that violates these Terms</li>
							<li>Suspend or terminate accounts that repeatedly violate community guidelines</li>
							<li>Report illegal content to appropriate authorities</li>
						</ul>
					</section>

					<section>
						<h2>5. User Content and Rights</h2>
						<p>
							By posting content to Riverbank, you grant us a worldwide, non-exclusive, royalty-free
							license to use, display, and distribute your content as part of the Service. You retain
							ownership of your content.
						</p>
						<p>
							You represent and warrant that you own or have the necessary rights to post your content
							and that it does not violate any third-party rights or applicable laws.
						</p>
					</section>

					<section>
						<h2>6. Anonymity and Privacy</h2>
						<p>
							While Riverbank allows anonymous posting, we collect minimal data (such as IP addresses
							and optional nicknames/countries) for moderation and abuse prevention purposes. Please
							refer to our <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link> for
							more information.
						</p>
					</section>

					<section>
						<h2>7. Reporting and Enforcement</h2>
						<p>
							Users can report inappropriate content. Reported content will be reviewed, and appropriate
							action will be taken. Multiple reports or severe violations may result in content removal
							or account restrictions.
						</p>
					</section>

					<section>
						<h2>8. Disclaimer of Warranties</h2>
						<p>
							The Service is provided "as is" and "as available" without warranties of any kind, either
							express or implied. We do not warrant that the Service will be uninterrupted, error-free,
							or secure.
						</p>
					</section>

					<section>
						<h2>9. Limitation of Liability</h2>
						<p>
							To the fullest extent permitted by law, Riverbank and its operators shall not be liable
							for any indirect, incidental, special, consequential, or punitive damages resulting from
							your use or inability to use the Service.
						</p>
					</section>

					<section>
						<h2>10. Changes to Terms</h2>
						<p>
							We reserve the right to modify these Terms at any time. Changes will be effective
							immediately upon posting. Continued use of the Service after changes constitutes
							acceptance of the modified Terms.
						</p>
					</section>

					<section>
						<h2>11. Termination</h2>
						<p>
							We reserve the right to suspend or terminate your access to the Service at any time,
							with or without notice, for violation of these Terms or for any other reason.
						</p>
					</section>

					<section>
						<h2>12. Governing Law</h2>
						<p>
							These Terms shall be governed by and construed in accordance with applicable laws,
							without regard to conflict of law principles.
						</p>
					</section>

					<section>
						<h2>13. Contact</h2>
						<p>
							If you have questions about these Terms, please contact us through the Service or visit
							our website at <a href="https://riverbank.day" className="text-blue-600 dark:text-blue-400 hover:underline">riverbank.day</a>.
						</p>
					</section>
				</article>
			</main>

			<Footer />
		</div>
	)
}
