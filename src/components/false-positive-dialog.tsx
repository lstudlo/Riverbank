import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface FalsePositiveDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	message: string;
	nickname: string;
	country: string;
	submitting: boolean;
	onSubmit: () => void;
}

export function FalsePositiveDialog({
	open,
	onOpenChange,
	message,
	nickname,
	country,
	submitting,
	onSubmit,
}: FalsePositiveDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Report False Detection</AlertDialogTitle>
					<AlertDialogDescription className="space-y-4">
						<p>
							If you believe your message was incorrectly flagged as inappropriate, you can report it for review.
						</p>
						<div className="bg-muted p-4 rounded-none space-y-2">
							<p className="font-medium text-sm text-foreground">Your Message:</p>
							<p className="font-serif text-foreground italic">"{message}"</p>
							{nickname && (
								<p className="text-sm text-muted-foreground">Nickname: {nickname}</p>
							)}
							{country && (
								<p className="text-sm text-muted-foreground">Country: {country}</p>
							)}
						</div>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div className="flex justify-end gap-3">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={submitting}
					>
						Cancel
					</Button>
					<AlertDialogAction
						onClick={onSubmit}
						disabled={submitting}
					>
						{submitting ? "Submitting..." : "Submit"}
					</AlertDialogAction>
				</div>
			</AlertDialogContent>
		</AlertDialog>
	);
}
