export function Footer() {
	return (
		<footer className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center bg-transparent">
			<div className="flex items-center gap-4 text-background text-xs">
				<span>&copy; {new Date().getFullYear()} Riverbank</span>
				<span className="opacity-60">|</span>
				<a href="/terms" className="hover:opacity-80 transition-opacity">Terms</a>
				<a href="/privacy" className="hover:opacity-80 transition-opacity">Privacy</a>
			</div>
		</footer>
	);
}
