/**
 * Represents login session data to be stored and retrieved locally.
 */
import { User } from "./user";

export interface StoredSession {
  /**
   * The login token for this connection.
   */
  token: string;

  /**
   * The logged in user.
   */
  user: User;
}
