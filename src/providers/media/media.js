var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';
import { Observable } from "rxjs";
var MediaProvider = /** @class */ (function () {
    function MediaProvider(http, alertController, toastCtrl) {
        this.http = http;
        this.alertController = alertController;
        this.toastCtrl = toastCtrl;
    }
    /**
     * Get all the medias on the server.
     */
    MediaProvider.prototype.getAllMedia = function () {
        var mediaPath = 'http://media.mw.metropolia.fi/wbma/media';
        return this.http.get(mediaPath);
    };
    /**
     * Get all the medias with a specific tag.
     * @param tag the tag
     */
    MediaProvider.prototype.getMediaByTag = function (tag) {
        var mediaPath = 'http://media.mw.metropolia.fi/wbma/tags/' + tag;
        return this.http.get(mediaPath);
    };
    /**
     * Query the server for detailed info of a media (includes info about user and id)
     * @param file_id the id of the file representing the media
     */
    MediaProvider.prototype.queryDetailedMediaInfo = function (file_id) {
        var mediaURL = "http://media.mw.metropolia.fi/wbma/media/" + file_id;
        // console.log( "medial url : " + mediaURL );
        return this.http.get(mediaURL);
    };
    /**
     * Get detailed information (including thumbnails) of a single media
     * @param file_id the id of the file representing the media
     */
    MediaProvider.prototype.getMedia = function (file_id) {
        var mediaResponse = this.queryDetailedMediaInfo(file_id);
        return mediaResponse.flatMap(function (response) {
            var getThumbnail = function () {
                if (response.thumbnails && response.thumbnails != null && Object.keys(response.thumbnails).length > 0) {
                    var firstKey = Object.keys(response.thumbnails)[0];
                    var firstThumbnail = response.thumbnails[firstKey];
                    return firstThumbnail;
                }
                else {
                    return null;
                }
            };
            return Observable.create({
                filename: response.filename,
                media_type: response.media_type,
                mime_type: response.mime_type,
                time_added: response.time_added,
                thumbnail: getThumbnail()
            });
        });
    };
    MediaProvider.prototype.getAllMedia = function () {
        //const url:string = 'http://media.mw.metropolia.fi/wbma/media?start=100&limit=5';
        var mediaPath = 'http://media.mw.metropolia.fi/wbma/media';
        return this.http.get(mediaPath);
    };
    //TODO: get all media by tag:2plus?
    MediaProvider.prototype.getMediaByTag = function (tag) {
        //const url:string = 'http://media.mw.metropolia.fi/wbma/media?start=100&limit=5';
        var mediaPath = 'http://media.mw.metropolia.fi/wbma/tags/' + tag;
        return this.http.get(mediaPath);
    };
    MediaProvider.prototype.getSingleMedia = function (file_id) {
        var mediaURL = "http://media.mw.metropolia.fi/wbma/media/" + file_id;
        // console.log( "medial url : " + mediaURL );
        return this.http.get(mediaURL);
    };
    //when user clicks on view button, show user info of that media file
    MediaProvider.prototype.getUserInfoOfSingleFile = function (user_id) {
        var userInfoPath = "http://media.mw.metropolia.fi/wbma/users/" + user_id;
        var httpOptions = {
            headers: new HttpHeaders({
                'Content-type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            })
        };
        return this.http.get(userInfoPath, httpOptions);
    };
    //TODO: when user upload a file, attach a tag 2plus?
    //upload media file
    MediaProvider.prototype.uploadMedia = function (data) {
        console.log('media provider: upload media');
        var accessToken = localStorage.getItem('token');
        console.log('accessToken: ', accessToken);
        var httpOptions = {
            headers: new HttpHeaders({
                'x-access-token': accessToken
            }),
        };
        var uploadPath = "http://media.mw.metropolia.fi/wbma/media";
        return this.http.post(uploadPath, data, httpOptions);
    };
    //show all media of current user in MyItemsPage
    MediaProvider.prototype.getAllMediaOfCurrentUser = function (user_id) {
        var allMediaOfSingleUserPath = "http://media.mw.metropolia.fi/wbma/media/user/" + user_id;
        var httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }),
        };
        console.log('token: ', localStorage.getItem('token'));
        return this.http.get(allMediaOfSingleUserPath);
    };
    MediaProvider.prototype.updateItemInfo = function (file_id, data) {
        console.log('media provider: modify media info');
        var modifyFilePath = "http://media.mw.metropolia.fi/wbma/media/" + file_id;
        var accessToken = localStorage.getItem('token');
        console.log('accessToken: ', accessToken);
        var httpOptions = {
            headers: new HttpHeaders({
                'Content-type': 'application/json',
                'x-access-token': accessToken
            }),
        };
        return this.http.put(modifyFilePath, data, httpOptions);
    };
    MediaProvider.prototype.setTag = function (data) {
        var setTagPath = 'http://media.mw.metropolia.fi/wbma/tags';
        var httpOptions = {
            headers: new HttpHeaders({
                'Content-type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            }),
        };
        return this.http.post(setTagPath, data, httpOptions);
    };
    MediaProvider.prototype.deleteFile = function (file_id) {
        var deleteFilePath = "http://media.mw.metropolia.fi/wbma/media/" + file_id;
        var httpOptions = {
            headers: new HttpHeaders({
                'x-access-token': localStorage.getItem('token')
            }),
        };
        return this.http.delete(deleteFilePath, httpOptions);
    };
    MediaProvider.prototype.deleteUser = function (userID) {
        var deleteUserPath = "http://media.mw.metropolia.fi/wbma/users/" + userID;
        var httpOptions = {
            headers: new HttpHeaders({
                'x-access-token': localStorage.getItem('token')
            }),
        };
        return this.http.delete(deleteUserPath, httpOptions);
    };
    MediaProvider.prototype.search = function (data) {
        var searchMediaPath = "http://media.mw.metropolia.fi/wbma/media/search";
        var httpOptions = {
            headers: new HttpHeaders({
                'Content-type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            }),
        };
        return this.http.post(searchMediaPath, data, httpOptions);
    };
    MediaProvider.prototype.updateUserInfo = function (data) {
        var updateUserDataPath = "http://media.mw.metropolia.fi/wbma/users/";
        var httpOptions = {
            headers: new HttpHeaders({
                'Content-type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            }),
        };
        return this.http.put(updateUserDataPath, data, httpOptions);
    };
    //show confirmation alert before deleting a file
    MediaProvider.prototype.confirmationAlert = function (message) {
        var _this = this;
        var promise = new Promise(function (resolve) {
            var alert = _this.alertController.create({
                title: 'Confirmation',
                message: message,
                enableBackdropDismiss: false,
                buttons: [{
                        text: 'No',
                        handler: function () { return resolve(false); }
                    }, {
                        text: 'Yes',
                        handler: function () { return resolve(true); }
                    }]
            });
            alert.present();
        });
        return promise;
    };
    //show toast message
    MediaProvider.prototype.presentToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 2000
        });
        toast.present();
    };
    MediaProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient,
            AlertController,
            ToastController])
    ], MediaProvider);
    return MediaProvider;
}());
export { MediaProvider };
//# sourceMappingURL=media.js.map