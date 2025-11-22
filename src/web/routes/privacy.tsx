import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export const Route = createFileRoute('/privacy')({
	component: PrivacyPolicy,
})

function PrivacyPolicy() {
	// Set document title
	useEffect(() => {
		document.title = "Privacy Policy - Riverbank";
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
					<h1>Privacy Policy</h1>
					<p className="text-muted-foreground">Last updated: November 22, 2025</p>

					<section>
						<h2>1. Introduction</h2>
						<p>
							Welcome to Riverbank. We respect your privacy and are committed to protecting your personal
							information. This Privacy Policy explains how we collect, use, and safeguard your data when
							you use our Service.
						</p>
					</section>

					<section>
						<h2>2. Information We Collect</h2>

						<h3>2.1 Information You Provide</h3>
						<ul>
							<li><strong>Messages:</strong> The text content of bottles you throw into the river</li>
							<li><strong>Optional Information:</strong> Nickname and country (if you choose to provide them)</li>
						</ul>

						<h3>2.2 Automatically Collected Information</h3>
						<ul>
							<li><strong>IP Address:</strong> Collected for abuse prevention and content moderation</li>
							<li><strong>Usage Data:</strong> Information about how you interact with the Service (likes, reports)</li>
							<li><strong>Browser Information:</strong> Browser type, device type, and operating system</li>
							<li><strong>Timestamps:</strong> When you post messages and interact with content</li>
						</ul>

						<h3>2.3 Local Storage</h3>
						<ul>
							<li><strong>Theme Preference:</strong> Your dark/light mode preference is stored locally in your browser</li>
							<li><strong>Consent Status:</strong> Your community guidelines consent is stored locally</li>
						</ul>
					</section>

					<section>
						<h2>3. How We Use Your Information</h2>
						<p>We use the collected information for the following purposes:</p>
						<ul>
							<li><strong>Service Delivery:</strong> To provide the message-in-a-bottle exchange functionality</li>
							<li><strong>Content Moderation:</strong> To detect and prevent harmful, abusive, or illegal content using AI-powered moderation</li>
							<li><strong>Abuse Prevention:</strong> To prevent spam, harassment, and misuse of the Service</li>
							<li><strong>Analytics:</strong> To understand how users interact with the Service and improve features</li>
							<li><strong>Legal Compliance:</strong> To comply with applicable laws and respond to legal requests</li>
						</ul>
					</section>

					<section>
						<h2>4. AI Content Moderation</h2>
						<p>
							Riverbank uses AI-powered content moderation (Llama 3.1 8B model) to automatically screen
							messages for harmful content. Your messages may be analyzed by this AI system to ensure
							compliance with our community guidelines. Messages flagged as inappropriate are not posted.
						</p>
					</section>

					<section>
						<h2>5. Data Sharing and Disclosure</h2>
						<p>We do not sell your personal information. We may share information in the following circumstances:</p>
						<ul>
							<li><strong>Public Display:</strong> Messages you post (with optional nickname/country) are visible to all users</li>
							<li><strong>Service Providers:</strong> With Cloudflare and other infrastructure providers necessary to operate the Service</li>
							<li><strong>Legal Requirements:</strong> When required by law or to protect rights, safety, and security</li>
							<li><strong>AI Moderation:</strong> Message content is processed by AI moderation services to ensure safety</li>
						</ul>
					</section>

					<section>
						<h2>6. Data Retention</h2>
						<p>
							We retain your information as follows:
						</p>
						<ul>
							<li><strong>Messages:</strong> Stored indefinitely unless removed for violations or by user request</li>
							<li><strong>IP Addresses:</strong> Retained for moderation and abuse prevention purposes</li>
							<li><strong>Interaction Data:</strong> Likes and reports are stored with messages</li>
						</ul>
					</section>

					<section>
						<h2>7. Your Rights</h2>
						<p>Depending on your location, you may have the following rights:</p>
						<ul>
							<li><strong>Access:</strong> Request information about data we hold about you</li>
							<li><strong>Deletion:</strong> Request deletion of your messages (subject to verification)</li>
							<li><strong>Correction:</strong> Request correction of inaccurate information</li>
							<li><strong>Objection:</strong> Object to processing of your data in certain circumstances</li>
						</ul>
						<p>
							Note: Due to the anonymous nature of the Service, it may be difficult to verify ownership
							of specific messages. We will make reasonable efforts to accommodate requests.
						</p>
					</section>

					<section>
						<h2>8. Cookies and Tracking</h2>
						<p>
							Riverbank uses minimal tracking:
						</p>
						<ul>
							<li><strong>Local Storage:</strong> Used only for theme preferences and consent status</li>
							<li><strong>No Third-Party Cookies:</strong> We do not use third-party advertising or tracking cookies</li>
							<li><strong>No Analytics Cookies:</strong> We do not use Google Analytics or similar services (at this time)</li>
						</ul>
					</section>

					<section>
						<h2>9. Children's Privacy</h2>
						<p>
							The Service is not intended for children under 13 years of age. We do not knowingly collect
							personal information from children under 13. If you believe a child has provided information
							to us, please contact us so we can delete it.
						</p>
					</section>

					<section>
						<h2>10. International Data Transfers</h2>
						<p>
							Your information may be transferred to and processed in countries other than your own.
							We use Cloudflare's global infrastructure, which may store data in multiple regions.
							We ensure appropriate safeguards are in place for international transfers.
						</p>
					</section>

					<section>
						<h2>11. Security</h2>
						<p>
							We implement reasonable security measures to protect your information, including:
						</p>
						<ul>
							<li>Secure HTTPS connections</li>
							<li>Rate limiting and abuse prevention</li>
							<li>AI-powered content screening</li>
							<li>Regular security reviews</li>
						</ul>
						<p>
							However, no method of transmission over the internet is 100% secure. We cannot guarantee
							absolute security.
						</p>
					</section>

					<section>
						<h2>12. Changes to This Policy</h2>
						<p>
							We may update this Privacy Policy from time to time. Changes will be posted on this page
							with an updated "Last updated" date. Continued use of the Service after changes constitutes
							acceptance of the updated policy.
						</p>
					</section>

					<section>
						<h2>13. GDPR Compliance (European Users)</h2>
						<p>
							If you are located in the European Economic Area (EEA), you have additional rights under
							the General Data Protection Regulation (GDPR), including:
						</p>
						<ul>
							<li>The right to access your personal data</li>
							<li>The right to rectification of inaccurate data</li>
							<li>The right to erasure ("right to be forgotten")</li>
							<li>The right to restrict processing</li>
							<li>The right to data portability</li>
							<li>The right to object to processing</li>
						</ul>
					</section>

					<section>
						<h2>14. California Privacy Rights (CCPA)</h2>
						<p>
							If you are a California resident, you have rights under the California Consumer Privacy Act,
							including the right to know what personal information is collected and the right to delete
							personal information.
						</p>
					</section>

					<section>
						<h2>15. Contact Us</h2>
						<p>
							If you have questions about this Privacy Policy or wish to exercise your privacy rights,
							please contact us through the Service or visit{' '}
							<a href="https://riverbank.day" className="text-blue-600 dark:text-blue-400 hover:underline">riverbank.day</a>.
						</p>
					</section>
				</article>
			</main>

			<Footer />
		</div>
	)
}
