import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Stripe publishable key')
}

export const Header = () => {
    return (
        <header>
            <SignedOut>
                <SignInButton />
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </header>
    );
}