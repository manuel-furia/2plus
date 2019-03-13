import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MediaProvider } from '../../providers/media/media';
import { ProfilePage } from '../../pages/profile/profile';
import { Media } from '../../interfaces/media';
import { StorageProvider } from "../../providers/storage/storage";

@Pipe({
  name: 'getTags',
})
export class GetTagsPipe implements PipeTransform {

  constructor(public http: HttpClient,
              public mediaProvider:MediaProvider,
              public userStorage:StorageProvider
  ) {  }

  async transform(tag: string) {
    return new Promise((resolve, reject) => {
      this.mediaProvider.getMediaByTag(tag).subscribe((files: Media[]) => {
        console.log('getFilesByTag res: ', files);

        let profileFound:Boolean = false;
        files.forEach((file: Media) => {
          const user = this.userStorage.loadSessionUser();
          if (user === null) return;
          if (file.user_id === user.user_id) {
            profileFound = true;
            resolve(file.media_id);
          }
          else {
            console.log("profile not found: " + file.user_id + '/' + user.user_id);
            //reject('No profile image added.');
          }
        });
        if(!profileFound){
          reject('No profile image added.');
        }

      });
    });
  }
}
