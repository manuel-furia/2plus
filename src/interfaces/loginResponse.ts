/**
 * Represents a login response from the API
 */
import { User } from "./user";
import { UserInfoResponse } from "./userInfoResponse";

export interface LoginResponse {
  /**
   * The message, returned from the server, meant to be read by the user.
   */
  message: string;

  /**
   * The login token for this connection.
   */
  token: string;

  /**
   * Data about the user that logged in.
   */
  user : {
    username: string;
    user_id: number;
    email: string;
    full_name: string;
  };
}
