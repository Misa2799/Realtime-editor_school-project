import { createClerkClient, EmailAddress } from "@clerk/clerk-sdk-node";

type UserType = {
  id: string;
  username?: string;
  email?: string;
}

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
});

export const get = async (email: string) => {
  const users = await clerkClient.users.getUserList({
    emailAddress: [email]
  });

  if (users.data.length === 0) {
    return null
  }
  
  const userObj: UserType = {
    id: users.data[0].id,
    username: users.data[0].username || undefined,
    email: users.data[0].primaryEmailAddress?.emailAddress || undefined
  }

  return userObj;
};
