import { ImageFilters } from "./imageFilters";

/**
 * Additional JSON descriptors associated with a non-item media.
 */
export interface MediaDescriptors{
  isImage: boolean;
  filters?: ImageFilters;
}
