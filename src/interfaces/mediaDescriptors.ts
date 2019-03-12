import { GeoLocation } from "./geoLocation";

/**
 * Additional JSON descriptors associated with a media or item.
 */
export interface MediaDescriptors{
  description: string;
  media_ids: [number];
  price: number;
  location: [GeoLocation];
  isItem: boolean;
}
