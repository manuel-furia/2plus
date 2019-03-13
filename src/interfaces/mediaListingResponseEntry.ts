/**
 * Entry of an array received as response to a request of media listing.
 */
export interface MediaListingResponseEntry {
  file_id: number;
  user_id: number;
  filename: string;
  filesize: number;
  title: string;
  description: string;
  media_type: string;
  mime_type: string;
  time_added: string;
}
