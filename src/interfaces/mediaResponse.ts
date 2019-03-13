import {Dictionary} from "./dictionary";

/**
 * A response to a request for information about a media.
 */
export interface MediaResponse {
  file_id: number;
  user_id: number;
  filename: string;
  filesize: number;
  title: string;
  description: string;
  media_type: string;
  mime_type: string;
  time_added: string;
  screenshot?: string;
  thumbnails?: Dictionary<string>;
}
