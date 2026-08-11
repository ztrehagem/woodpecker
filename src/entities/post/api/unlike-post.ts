import type { Session } from "#src/shared/auth/index.ts";

export async function unlikePost(session: Session, uri: string): Promise<void> {
  return await session.agent.deleteLike(uri);
}
