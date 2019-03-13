/**
 * Represents an item that is listed for selling or giving away.
 */
import { Media } from "./media";
import { User } from "./user";
import { ItemDescriptors } from "./itemDescriptors";

export interface Item {
  item_id: number;
  title: string;
  descriptors: ItemDescriptors;
  mainMedia: Media;
  otherMedia: Media[];
  user: User | null;
  time_added: string;
}
