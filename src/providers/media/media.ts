import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';
import { Media } from '../../interfaces/media';
import { User } from '../../interfaces/user';
import { Response } from '../../interfaces/response';

@Injectable()
export class MediaProvider {

  constructor(public http: HttpClient,
              public alertController: AlertController,
              public toastCtrl: ToastController) { }



  getAllMedia(){
    //const url:string = 'http://media.mw.metropolia.fi/wbma/media?start=100&limit=5';
    const mediaPath:string = 'http://media.mw.metropolia.fi/wbma/media';

    return this.http.get<Media[]>(mediaPath);
  }

//TODO: get all media by tag:2plus?
  getMediaByTag(tag){
    //const url:string = 'http://media.mw.metropolia.fi/wbma/media?start=100&limit=5';
    const mediaPath:string = 'http://media.mw.metropolia.fi/wbma/tags/'+tag;

    return this.http.get<Media[]>(mediaPath);
  }


  getSingleMedia(file_id){
    const mediaURL:string = "http://media.mw.metropolia.fi/wbma/media/"+file_id;
    // console.log( "medial url : " + mediaURL );
    return  this.http.get<Media>(mediaURL);
  }


  //when user clicks on view button, show user info of that media file
  getUserInfoOfSingleFile(user_id){
    const userInfoPath:string = "http://media.mw.metropolia.fi/wbma/users/"+user_id;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      })
    };
    return this.http.get<User>(userInfoPath, httpOptions);

  }



//TODO: when user upload a file, attach a tag 2plus?
  //upload media file
  public uploadMedia(data:any){
    console.log('media provider: upload media');

    let accessToken = localStorage.getItem('token');
    console.log('accessToken: ', accessToken);

    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': accessToken
      }),
    };
    const uploadPath:string = "http://media.mw.metropolia.fi/wbma/media";
    return this.http.post<Response>(uploadPath, data, httpOptions);
  }



//show all media of current user in MyItemsPage
  public getAllMediaOfCurrentUser(user_id){
    const allMediaOfSingleUserPath:string = "http://media.mw.metropolia.fi/wbma/media/user/"+user_id;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      }),
    };

    console.log('token: ', localStorage.getItem('token'));

    return this.http.get<Media[]>(allMediaOfSingleUserPath);
  }
  

  updateItemInfo(file_id, data:any){
    console.log('media provider: modify media info');

    const modifyFilePath:string = "http://media.mw.metropolia.fi/wbma/media/"+file_id;
    let accessToken = localStorage.getItem('token');
    console.log('accessToken: ', accessToken);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'x-access-token': accessToken
      }),
    };
    return this.http.put<Response>(modifyFilePath, data, httpOptions);
  }


  setTag(data:any){
    const setTagPath = 'http://media.mw.metropolia.fi/wbma/tags';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      }),
    };
    return this.http.post(setTagPath, data, httpOptions);

  }

  deleteFile(file_id){
    const deleteFilePath:string = "http://media.mw.metropolia.fi/wbma/media/"+file_id;
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': localStorage.getItem('token')
      }),
    };
    return this.http.delete<Response>(deleteFilePath, httpOptions);
  }

  deleteUser(userID){
    const deleteUserPath:string = "http://media.mw.metropolia.fi/wbma/users/"+userID;
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': localStorage.getItem('token')
      }),
    };
    return this.http.delete<Response>(deleteUserPath, httpOptions);
  }

  search(data:object){
    const searchMediaPath:string = "http://media.mw.metropolia.fi/wbma/media/search";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      }),
    };
    return this.http.post<Media[]>(searchMediaPath, data, httpOptions);
  }

  updateUserInfo(data){
    const updateUserDataPath:string = "http://media.mw.metropolia.fi/wbma/users/";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      }),
    };
    return this.http.put<Response>(updateUserDataPath, data, httpOptions);
  }


  //show confirmation alert before deleting a file
  confirmationAlert(message: string): Promise<boolean> {
    let promise = new Promise<boolean>(resolve => {
      let alert = this.alertController.create({
        title: 'Confirmation',
        message: message,
        enableBackdropDismiss: false,
        buttons: [ {
          text: 'No',
          handler: () => resolve(false)
        }, {
          text: 'Yes',
          handler: () => resolve(true)
        } ]
      });

      alert.present();
    });

    return promise;
  }

  //show toast message
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }


}



