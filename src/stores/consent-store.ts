import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ConsentState {
	hasAcceptedGuidelines: boolean
	acceptGuidelines: () => void
}

export const useConsentStore = create<ConsentState>()(
	persist(
		(set) => ({
			hasAcceptedGuidelines: false,
			acceptGuidelines: () => set({ hasAcceptedGuidelines: true }),
		}),
		{
			name: 'riverbank-consent',
		}
	)
)
