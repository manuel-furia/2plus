import { ImageFilters } from "./imageFilters";

/**
 * Represents a media, holding the information necessary to use it in the app.
 */
export interface Media {
  media_id: number;
  filename: string;
  media_type: string;
  mime_type: string;
  time_added: string;
  thumbnail: string;
  user_id: number;
  isImage: boolean;
  filters?: ImageFilters;
}
