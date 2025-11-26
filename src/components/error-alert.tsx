import { motion, AnimatePresence } from "motion/react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CircleAlertIcon } from "raster-react";

interface ErrorAlertProps {
	error: string | null;
	onReportError: () => void;
}

export function ErrorAlert({ error, onReportError }: ErrorAlertProps) {
	return (
		<AnimatePresence>
			{error && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.3 }}
					className="mb-6"
				>
					<Alert className='rounded-none items-center [&>svg]:translate-y-0' variant="destructive">
						<CircleAlertIcon size={16} className="size-4" />
						<AlertDescription className='flex flex-row items-center justify-between w-full'>
							{error.toLowerCase().includes("inappropriate") || error.toLowerCase().includes("content") ? (
								<>
									<span>Inappropriate content.</span>
									<Button
										variant="outline"
										size="sm"
										onClick={onReportError}
										className="ml-4"
									>
										Report Error
									</Button>
								</>
							) : (
								<span>{error}</span>
							)}
						</AlertDescription>
					</Alert>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
