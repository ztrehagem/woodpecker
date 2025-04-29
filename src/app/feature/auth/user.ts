import type { AtpSessionData } from "@atproto/api";

declare const brand: unique symbol;

/** @public */
export type User = IUser & { [brand]: never };

interface IUser {
  readonly did: string;
  readonly handle: string;
}

function User(user: IUser): User {
  return user as User;
}

export function createUserFromAtpSession(session: AtpSessionData): User {
  return User({
    did: session.did,
    handle: session.handle,
  });
}
