import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CommunityGuidelinesDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAccept: () => void;
}

export function CommunityGuidelinesDialog({
	open,
	onOpenChange,
	onAccept,
}: CommunityGuidelinesDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className='border-primary border-4 max-w-2xl max-h-[80vh] overflow-y-auto'>
				<AlertDialogHeader>
					<AlertDialogTitle className='text-center'>Community Guidelines</AlertDialogTitle>
					<AlertDialogDescription className="space-y-3 text-left">
						<p className={"mb-6 text-center px-4"}>
							<a href="/" className="underline hover:text-foreground text-primary p-0.5 transition-colors">Riverbank</a> is a quiet place where unspoken thoughts drift between strangers, connected by flows of the river,
						</p>
						<p className="font-medium text-primary text-center">We promote:</p>
						<ul className="list-disc list-inside space-y-1 ml-2 text-center">
							<li>Kindness and empathy</li>
							<li>Thoughtful reflections and genuine connections</li>
							<li>Respectful and constructive communication</li>
							<li>Cultural understanding and openness</li>
						</ul>
						<p className="font-medium text-red-400 text-center">We do not tolerate:</p>
						<ul className="list-disc list-inside space-y-1 ml-2 text-center">
							<li>Hate speech, harassment, or discrimination</li>
							<li>Scams, spam, or fraudulent content</li>
							<li>Personal attacks or threats</li>
							<li>Explicit or inappropriate content</li>
						</ul>
						<p className="flex justify-center text-xs text-primary mt-8">
							By continuing, you agree to our{"  "}
							<a href="/terms" className="underline hover:text-foreground text-red-400 px-1.5 transition-colors">Terms of Service</a>
							and
							<a href="/privacy" className="underline hover:text-foreground text-red-400 px-1.5 transition-colors">Privacy Policy</a>
						</p>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogAction
					className=''
					onClick={onAccept}
				>
					Accept
				</AlertDialogAction>
			</AlertDialogContent>
		</AlertDialog>
	);
}
