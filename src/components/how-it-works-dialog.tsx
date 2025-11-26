import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface HowItWorksDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function HowItWorksDialog({
	open,
	onOpenChange,
}: HowItWorksDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='border-primary border-4 max-w-2xl max-h-[80vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle className='text-center'>About Riverbank</DialogTitle>
					<DialogDescription className="space-y-4 text-left">
						<div>
							<h3 className="text-base font-medium mb-2 text-foreground">What is Riverbank?</h3>
							<p className="text-sm">
								Riverbank is a digital message-in-a-bottle platform where you can share anonymous thoughts,
								feelings, and messages with people around the world. Write your message, throw it into the
								digital river, and receive random bottles from the global community in return.
							</p>
						</div>

						<div>
							<h3 className="text-base font-medium mb-2 text-foreground">How does it work?</h3>
							<ol className="list-decimal list-inside text-sm space-y-2">
								<li><strong>Write your message:</strong> Compose a message between 15-300 characters. Share a thought, feeling, question, or reflection.</li>
								<li><strong>Add optional details:</strong> You can include a nickname and country/region, but it's entirely optional. Messages are anonymous by default.</li>
								<li><strong>Throw into the river:</strong> Submit your message and watch it drift away into the digital river.</li>
								<li><strong>Receive random bottles:</strong> Based on your message length, you'll receive 1-3 random bottles from other users:
									<ul className="list-disc list-inside ml-4 mt-1 space-y-1">
										<li>15-60 characters: 1 bottle</li>
										<li>61-150 characters: 2 bottles</li>
										<li>151-300 characters: 3 bottles</li>
									</ul>
								</li>
								<li><strong>Engage with messages:</strong> Like messages that resonate with you or report inappropriate content to help maintain a safe community.</li>
							</ol>
						</div>

						<div>
							<h3 className="text-base font-medium mb-2 text-foreground">Community Safety</h3>
							<p className="text-sm">
								Riverbank uses AI-powered content moderation to ensure a safe, respectful environment.
								All messages are automatically screened for harmful content before being posted. Users
								can also report inappropriate bottles, which are reviewed for community guideline violations.
							</p>
						</div>

						<div>
							<h3 className="text-base font-medium mb-2 text-foreground">Privacy &amp; Anonymity</h3>
							<p className="text-sm">
								Your privacy matters. Messages are anonymous by default. While we collect minimal data
								(like IP addresses) for moderation purposes, we never share personal information.
								Read our <a href="/privacy" className="underline hover:text-foreground text-primary transition-colors">Privacy Policy</a> for details.
							</p>
						</div>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="sm:justify-center">
					<Button onClick={() => onOpenChange(false)}>
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
