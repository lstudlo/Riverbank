import { ThemeToggle } from "@/components/theme-toggle";
import { UserButton } from "@/components/user-button";

export function Header() {
	return (
		<header className="h-12 flex items-center justify-between border-b border-border shrink-0 px-4">
			<ThemeToggle />
			<h1 className="text-xl font-serif font-light text-foreground tracking-wide">
				Riverbank
			</h1>
			<UserButton />
		</header>
	);
}
