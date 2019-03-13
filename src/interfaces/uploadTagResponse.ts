import { NotificationResponse } from "./notificationResponse";

export interface UploadTagResponse extends NotificationResponse{
  file_id: number;
  tag: string;
}
