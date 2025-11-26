import { InfoIcon } from "raster-react";
import { Button } from "@/components/ui/button";

interface QuestionButtonProps {
	onClick: () => void;
}

export function QuestionButton({ onClick }: QuestionButtonProps) {
	return (
		<Button variant="outline" size="icon" aria-label="How it works" onClick={onClick}>
			<InfoIcon size={32} className="size-8" />
		</Button>
	);
}
