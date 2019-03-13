import { NotificationResponse } from "./notificationResponse";

export interface UploadMediaResponse extends NotificationResponse{
  file_id: number;
}
