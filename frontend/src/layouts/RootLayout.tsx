import { Outlet, Link } from "react-router-dom";
import { Header } from "../components/Header";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Stripe publishable key')
}

export const RootLayout = () => {
    return (
        <div>
            <Header />

            <SignedIn>
                <UserButton />
            </SignedIn>
            <SignedOut>
                <Link to="sign-in">Sign In</Link>
            </SignedOut>
            
            <Outlet />
        </div>
    );
}