import { createClerkClient, LooseAuthProp, WithAuthProp } from "@clerk/clerk-sdk-node";
import { log } from "console";
import { Request, Response, NextFunction } from "express";

declare global {
    namespace Express {
        interface Request extends LooseAuthProp { 
            loggedInUserId?: string;
        }
    }
}

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY
});

export const authMiddleware = async (req: WithAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
        // get the current user id
        const userId = req.auth.userId

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const user = await clerkClient.users.getUser(userId);
        req.loggedInUserId = userId
        next()
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal Server Error" });
    }
}