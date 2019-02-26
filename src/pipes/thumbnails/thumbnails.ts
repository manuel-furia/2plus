import { Pipe, PipeTransform } from '@angular/core';
import { MediaProvider } from '../../providers/media/media';

@Pipe({
  name: 'thumbnail',
})


export class ThumbnailsPipe implements PipeTransform {

  constructor(private mediaProvider:MediaProvider){}

  async transform(file_id: number, ...args) {
    //return value.toLowerCase();
    return new Promise((resolve, reject) => {
      this.mediaProvider.getSingleMedia(file_id).subscribe(response=>{
        console.log('thumbnails pipe res: ', response);

        switch (args[0]) {
          case 'large': resolve(response.thumbnails.w640); break;
          case 'medium': resolve(response.thumbnails.w320); break;
          case 'small': resolve(response.thumbnails.w160); break;
          case 'screenshot': resolve(response.screenshot); break;
          default: resolve(response.thumbnails.w160); break;
        }
      })
    })
  }
}
