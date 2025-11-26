import { motion, AnimatePresence } from "motion/react"

interface AboutSectionProps {
	isOpen: boolean;
	onToggle: () => void;
}

export function AboutSection({ isOpen }: AboutSectionProps) {

	return (
		<section className="w-full max-w-lg mx-auto mb-4" aria-labelledby="about-heading">

			<AnimatePresence>
				{isOpen && (
					<motion.div
						id="about-content"
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "400px" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
						className="overflow-hidden"
					>
						<div className="h-full overflow-y-auto p-6 bg-muted/30 rounded-none border">
							<article className="prose prose-sm dark:prose-invert max-w-none">
								<h2 id="about-heading" className="text-lg font-semibold mb-4">About Riverbank</h2>

								<section>
									<h3 className="text-base font-medium mb-2">What is Riverbank?</h3>
									<p className="text-sm text-muted-foreground mb-4">
										Riverbank is a digital message-in-a-bottle platform where you can share anonymous thoughts,
										feelings, and messages with people around the world. Write your message, throw it into the
										digital river, and receive random bottles from the global community in return.
									</p>
								</section>

								<section>
									<h3 className="text-base font-medium mb-2">How does it work?</h3>
									<ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2 mb-4">
										<li><strong>Write your message:</strong> Compose a message between 15-300 characters. Share a thought, feeling, question, or reflection.</li>
										<li><strong>Add optional details:</strong> You can include a nickname and country/region, but it's entirely optional. Messages are anonymous by default.</li>
										<li><strong>Throw into the river:</strong> Submit your message and watch it drift away into the digital river.</li>
										<li><strong>Receive random bottles:</strong> Based on your message length, you'll receive 1-3 random bottles from other users:
											<ul className="list-disc list-inside ml-4 mt-1">
												<li>15-60 characters: 1 bottle</li>
												<li>61-150 characters: 2 bottles</li>
												<li>151-300 characters: 3 bottles</li>
											</ul>
										</li>
										<li><strong>Engage with messages:</strong> Like messages that resonate with you or report inappropriate content to help maintain a safe community.</li>
									</ol>
								</section>

								<section>
									<h3 className="text-base font-medium mb-2">Community Safety</h3>
									<p className="text-sm text-muted-foreground mb-4">
										Riverbank uses AI-powered content moderation to ensure a safe, respectful environment.
										All messages are automatically screened for harmful content before being posted. Users
										can also report inappropriate bottles, which are reviewed for community guideline violations.
									</p>
								</section>

								<section>
									<h3 className="text-base font-medium mb-2">Privacy &amp; Anonymity</h3>
									<p className="text-sm text-muted-foreground">
										Your privacy matters. Messages are anonymous by default. While we collect minimal data
										(like IP addresses) for moderation purposes, we never share personal information.
										Read our <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a> for details.
									</p>
								</section>
							</article>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</section>
	)
}
