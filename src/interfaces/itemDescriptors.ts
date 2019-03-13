import { GeoLocation, NamedLocation } from "./geoLocation";
import { ImageFilters } from "./imageFilters";

/**
 * Additional JSON descriptors associated with an item.
 */
export interface ItemDescriptors{
  discriminator: 'ItemDescriptors';
  description: string;
  media_ids: [number];
  price: number;
  city: NamedLocation;
  category: string;
}
