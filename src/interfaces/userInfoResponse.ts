/**
 * Represents a reponse from the server to a request for user information.
 */
export interface UserInfoResponse {
  username: string;
  user_id: number;
  email: string;
  full_name: string;
}
