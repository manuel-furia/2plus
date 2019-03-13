/**
 * Represents the information required to upload an item.
 */
import { Media } from "./media";
import { User } from "./user";
import { ItemDescriptors } from "./itemDescriptors";
import { ImageFilters } from "./imageFilters";

export interface ItemUploadInfo {
  title: string;
  description: string;
  price: number;
  contact: string;
  location: string;
  category: string;
  medias: {
    file: File;
    filter: ImageFilters;
  }[]

}
