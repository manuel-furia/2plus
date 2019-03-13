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
import { ConfigProvider } from "../config/config";
import { Observable } from "rxjs";
import { UserProvider } from "../users/user";
import { MediaProvider } from "../media/media";
/**
 * Provide information about items for sale/free.
 */
var ItemsProvider = /** @class */ (function () {
    function ItemsProvider(http, alertController, toastCtrl, config, users, mediaProvider) {
        this.http = http;
        this.alertController = alertController;
        this.toastCtrl = toastCtrl;
        this.config = config;
        this.users = users;
        this.mediaProvider = mediaProvider;
    }
    /**
     * Get all the items that are tagged with a specific tag
     * @param tag the tag
     * @return all the items that are tagged with a specific tag
     */
    ItemsProvider.prototype.getItems = function (tag) {
        var _this = this;
        return this.getMediaByTag(this.config.getAppTag()).flatMap(function (medias) {
            var items = medias
                .map(function (media) { return _this.buildItem(media); })
                .filter(function (elem) { return elem !== null; });
            return Observable.zip(items);
        });
    };
    /**
     * Return one item given its ID
     * @param item_id
     */
    ItemsProvider.prototype.getItem = function (item_id) {
        var _this = this;
        return this.mediaProvider.queryDetailedMediaInfo(item_id).flatMap(function (mediaResponse) {
            return _this.buildItem(mediaResponse);
        });
    };
    /**
     * Given a media response from the server, constructs a representation of an item
     * @param mediaResponse the media response from the server regarding a query about one item
     * @param descriptors the descriptors
     */
    ItemsProvider.prototype.buildItem = function (mediaResponse) {
        var _this = this;
        var descriptors = JSON.parse(mediaResponse.description);
        if (!descriptors.isItem) {
            return Observable.create(null);
        }
        var userObs = this.users.getUserInfo(mediaResponse.user_id);
        var mediaObs = Observable.zip(descriptors.media_ids.map(function (media_id) { return _this.mediaProvider.getMedia(media_id); }));
        return Observable.zip(userObs, mediaObs).flatMap(function (_a) {
            var user = _a[0], medias = _a[1];
            return Observable.create({
                item_id: mediaResponse.user_id,
                title: mediaResponse.title,
                description: descriptors.description,
                media: medias,
                user: user
            });
        });
    };
    ItemsProvider.prototype.getAllMedia = function () {
        var mediaPath = 'http://media.mw.metropolia.fi/wbma/media';
        return this.http.get(mediaPath);
    };
    ItemsProvider.prototype.getMediaByTag = function (tag) {
        var mediaPath = 'http://media.mw.metropolia.fi/wbma/tags/' + tag;
        return this.http.get(mediaPath);
    };
    ItemsProvider.prototype.getSingleMedia = function (file_id) {
        var mediaURL = "http://media.mw.metropolia.fi/wbma/media/" + file_id;
        return this.http.get(mediaURL);
    };
    //when user clicks on view button, show user info of that media file
    ItemsProvider.prototype.getUserInfoOfSingleFile = function (user_id) {
        var userInfoPath = "http://media.mw.metropolia.fi/wbma/users/" + user_id;
        var httpOptions = {
            headers: new HttpHeaders({
                'Content-type': 'application/json',
                'x-access-token': localStorage.getItem('token') || '',
            })
        };
        return this.http.get(userInfoPath, httpOptions);
    };
    //TODO: when user upload a file, attach a tag 2plus?
    //upload media file
    ItemsProvider.prototype.uploadMedia = function (data) {
        console.log('media provider: upload media');
        var accessToken = localStorage.getItem('token');
        console.log('accessToken: ', accessToken);
        var httpOptions = {
            headers: new HttpHeaders({
                'x-access-token': accessToken || ''
            }),
        };
        var uploadPath = "http://media.mw.metropolia.fi/wbma/media";
        return this.http.post(uploadPath, data, httpOptions);
    };
    //show all media of current user in MyItemsPage
    ItemsProvider.prototype.getAllMediaOfCurrentUser = function (user_id) {
        var allMediaOfSingleUserPath = "http://media.mw.metropolia.fi/wbma/media/user/" + user_id;
        var httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token') || '',
            }),
        };
        console.log('token: ', localStorage.getItem('token'));
        return this.http.get(allMediaOfSingleUserPath);
    };
    ItemsProvider.prototype.updateItemInfo = function (file_id, data) {
        console.log('media provider: modify media info');
        var modifyFilePath = "http://media.mw.metropolia.fi/wbma/media/" + file_id;
        var accessToken = localStorage.getItem('token');
        console.log('accessToken: ', accessToken);
        var httpOptions = {
            headers: new HttpHeaders({
                'Content-type': 'application/json',
                'x-access-token': accessToken || ''
            }),
        };
        return this.http.put(modifyFilePath, data, httpOptions);
    };
    ItemsProvider.prototype.setTag = function (data) {
        var setTagPath = 'http://media.mw.metropolia.fi/wbma/tags';
        var httpOptions = {
            headers: new HttpHeaders({
                'Content-type': 'application/json',
                'x-access-token': localStorage.getItem('token') || ''
            }),
        };
        return this.http.post(setTagPath, data, httpOptions);
    };
    ItemsProvider.prototype.deleteFile = function (file_id) {
        var deleteFilePath = "http://media.mw.metropolia.fi/wbma/media/" + file_id;
        var httpOptions = {
            headers: new HttpHeaders({
                'x-access-token': localStorage.getItem('token') || ''
            }),
        };
        return this.http.delete(deleteFilePath, httpOptions);
    };
    ItemsProvider.prototype.deleteUser = function (userID) {
        var deleteUserPath = "http://media.mw.metropolia.fi/wbma/users/" + userID;
        var httpOptions = {
            headers: new HttpHeaders({
                'x-access-token': localStorage.getItem('token') || ''
            }),
        };
        return this.http.delete(deleteUserPath, httpOptions);
    };
    ItemsProvider.prototype.search = function (data) {
        var searchMediaPath = "http://media.mw.metropolia.fi/wbma/media/search";
        var httpOptions = {
            headers: new HttpHeaders({
                'Content-type': 'application/json',
                'x-access-token': localStorage.getItem('token') || ''
            }),
        };
        return this.http.post(searchMediaPath, data, httpOptions);
    };
    //show confirmation alert before deleting a file
    ItemsProvider.prototype.confirmationAlert = function (message) {
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
    ItemsProvider.prototype.presentToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 2000
        });
        toast.present();
    };
    ItemsProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient,
            AlertController,
            ToastController,
            ConfigProvider, typeof (_a = typeof UserProvider !== "undefined" && UserProvider) === "function" && _a || Object, MediaProvider])
    ], ItemsProvider);
    return ItemsProvider;
    var _a;
}());
export { ItemsProvider };
//# sourceMappingURL=items.js.map