import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MediaProvider } from '../../providers/media/media';
import { ProfilePage } from '../../pages/profile/profile';
import { UserAuthenticationProvider } from '../../providers/user-authentication/user-authentication';
import { Media } from '../../interfaces/media';

@Pipe({
  name: 'getTags',
})
export class GetTagsPipe implements PipeTransform {

  constructor(public http: HttpClient,
              public mediaProvider:MediaProvider,
              public profilePage:ProfilePage,
              public userAuth:UserAuthenticationProvider
  ) {  }

  async transform(tag: string) {
    return new Promise((resolve, reject) => {
      this.mediaProvider.getMediaByTag(tag).subscribe((files: Media[]) => {
        console.log('getFilesByTag res: ', files);

        let profileFound:Boolean = false;
        files.forEach((file: Media) => {
          if (file.user_id === this.userAuth.user.user_id) {
            profileFound = true;
            resolve(file.file_id);
          }
          else {
            console.log("profile not found: " + file.user_id + '/' + this.userAuth.user.user_id);
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
