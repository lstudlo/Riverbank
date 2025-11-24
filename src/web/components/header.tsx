import { ThemeToggle } from "@/components/theme-toggle";
import { UserButton } from "@/components/user-button";
import { QuestionButton } from "@/components/question-button";
import { useTheme } from "@/hooks/use-theme";

interface HeaderProps {
	onQuestionClick: () => void;
}

export function Header({ onQuestionClick }: HeaderProps) {
	const { resolvedTheme } = useTheme();

	return (
		<header className="h-16 flex items-center justify-between shrink-0 px-4">
			{/* Logo on the left */}
			<img
				src="/banner-logo.svg"
				alt="Riverbank"
				className="h-6"
				style={{
					filter: resolvedTheme === "dark" ? "invert(1) brightness(1.2)" : "none",
				}}
			/>

			{/* Buttons on the right */}
			<div className="flex items-center gap-2">
				<QuestionButton onClick={onQuestionClick} />
				<ThemeToggle />
				<UserButton />
			</div>
		</header>
	);
}
