import { Pipe, PipeTransform } from '@angular/core';
import { MediaProvider } from '../../providers/media/media';
import { Item } from "../../interfaces/item";

@Pipe({
  name: 'thumbnail',
})


export class ThumbnailsPipe implements PipeTransform {

  constructor(private mediaProvider:MediaProvider){}

  async transform(item: Item, ...args) {
    //return value.toLowerCase();
    return new Promise((resolve, reject) => {
      const media = item.otherMedia.length > 0 ? item.otherMedia[0] : item.mainMedia;
      resolve(media.thumbnail);
    })
  }
}
