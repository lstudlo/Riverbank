import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CometCard } from "@/components/ui/comet-card";
import { TrendingDownIcon } from "raster-react";

type CountryOption = {
	code: string;
	name: string;
};

let countriesDataPromise: Promise<CountryOption[]> | null = null;

async function loadCountriesData() {
	if (!countriesDataPromise) {
		countriesDataPromise = import("@/lib/data/countries.json").then(
			(mod) => mod.default as CountryOption[],
		);
	}

	return countriesDataPromise;
}

interface MessageCompositionFormProps {
	message: string;
	setMessage: (message: string) => void;
	nickname: string;
	setNickname: (nickname: string) => void;
	country: string;
	setCountry: (country: string) => void;
	loading: boolean;
	canSubmit: boolean;
	showThrowAnimation: boolean;
	onThrow: () => void;
	onFocus: () => void;
}

export function MessageCompositionForm({
	message,
	setMessage,
	nickname,
	setNickname,
	country,
	setCountry,
	loading,
	canSubmit,
	showThrowAnimation,
	onThrow,
	onFocus,
}: MessageCompositionFormProps) {
	const charsRemaining = 300 - message.length;
	const minChars = 15;
	const [countriesData, setCountriesData] = useState<CountryOption[] | null>(null);
	const [isLoadingCountries, setIsLoadingCountries] = useState(false);

	const ensureCountriesLoaded = async () => {
		if (countriesData || isLoadingCountries) return;
		setIsLoadingCountries(true);
		try {
			setCountriesData(await loadCountriesData());
		} finally {
			setIsLoadingCountries(false);
		}
	};

	return (
		<motion.div
			className="mb-6 isolate"
			animate={{
				opacity: showThrowAnimation ? 0.4 : 1,
				y: showThrowAnimation ? -10 : 0,
			}}
			transition={{
				duration: 0.8,
				ease: [0.25, 0.1, 0.25, 1],
			}}
		>
			<CometCard rotateDepth={3} translateDepth={5} glareOpacity={0.5} borderRadius="rounded-none">
				<div className="bg-background">
					<div className="p-2 border-4 border-primary">
					<Textarea
						placeholder="Write your message..."
						value={message}
						onChange={(e) => setMessage(e.target.value.slice(0, 300))}
						onFocus={onFocus}
						disabled={loading}
						className="font-serif text-lg focus-visible:ring-0 bg-background dark:bg-background border-0 shadow-none resize-none min-h-[120px]"
					/>

					<div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
						<span className="text-muted-foreground">
							{message.trim().length < minChars && message.trim().length > 0 && (
								<span className="text-amber-600">Min {minChars} chars</span>
							)}
							{message.trim().length >= 151 && <span className="text-green-600">3 bottles</span>}
							{message.trim().length >= 61 && message.trim().length < 151 && <span className="text-blue-600">2 bottles</span>}
							{message.trim().length >= minChars && message.trim().length < 61 && <span>1 bottle</span>}
						</span>
						<span className={charsRemaining < 30 ? "text-red-600" : ""}>
							{message.length} / 300
						</span>
					</div>
				</div>

				<div className={"border-4 border-t-0 border-primary h-auto flex flex-col"}>
					<div className="flex border-2 border-primary border-t-0 border-l-0 border-r-0">
						<Input
							type="text"
							placeholder="Nickname (optional)"
							value={nickname}
							onChange={(e) => setNickname(e.target.value.slice(0, 30))}
							disabled={loading}
							className="flex-[1_1_0%] min-w-0 rounded-none outline-0 text-sm shadow-none border-0 border-r-2 bg-background border-primary text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-primary"
						/>
						<Select
							value={country}
							onValueChange={setCountry}
							onOpenChange={(open) => {
								if (open) {
									void ensureCountriesLoaded();
								}
							}}
							disabled={loading}
						>
							<SelectTrigger className="flex-[1_1_0%] min-w-0 rounded-none border-0 text-sm shadow-none bg-background border-border text-foreground">
								<SelectValue placeholder="Region (optional)" />
							</SelectTrigger>
							<SelectContent>
								{countriesData
									? countriesData.map(c => (
										<SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>
									))
									: (
										<SelectItem value="__loading__" disabled>
											{isLoadingCountries ? "Loading regions..." : "Open to load regions"}
										</SelectItem>
									)}
							</SelectContent>
						</Select>
					</div>

					{/* Throw button */}
					<Button
						onClick={onThrow}
						variant={"default"}
						disabled={loading || !canSubmit}
						className="transition-all flex-1 rounded-none h-auto border-2 border-primary"
					>
						{loading ? (
							<span className="flex items-center gap-2">
								<span className="animate-pulse">Drifting...</span>
							</span>
						) : (
							<span className="flex items-center gap-2">
								<TrendingDownIcon strokeWidth={3} className="size-7 text-muted" />
								Throw into the river
							</span>
						)}
					</Button>
				</div>
				</div>
			</CometCard>
		</motion.div>
	);
}
