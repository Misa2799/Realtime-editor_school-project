import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Stripe publishable key");
}

export const Header = () => {
	return (
		<header className="bg-green-700 text-white p-4 flex justify-between items-center shadow-lg">
			<p className="text-xl font-semibold">Wasabi</p>

			<div>
				<SignedOut>
					{/* Sign In as a styled button */}
					<SignInButton>
						<button className="bg-[#FACC15] text-gray-900 py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors">
							Sign In
						</button>
					</SignInButton>
				</SignedOut>
				<SignedIn>
					<UserButton />
				</SignedIn>
			</div>
		</header>
	);
};
