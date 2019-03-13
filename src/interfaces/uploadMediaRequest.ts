/**
 * Represents a request to upload a media to the server
 */
export interface UploadMediaRequest {
  file: File;
  title: string;
  description: string;
}
