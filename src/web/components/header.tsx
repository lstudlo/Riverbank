import { ThemeToggle } from "@/components/theme-toggle";
import { UserButton } from "@/components/user-button";
import { useTheme } from "@/hooks/use-theme";

export function Header() {
	const { resolvedTheme } = useTheme();

	return (
		<header className="h-16 flex items-center justify-between shrink-0 px-4">
			<ThemeToggle />
			<img
				src="/banner-logo.svg"
				alt="Riverbank"
				className="h-7"
				style={{
					filter: resolvedTheme === "dark" ? "invert(1) brightness(1.2)" : "none",
				}}
			/>
			<UserButton />
		</header>
	);
}
