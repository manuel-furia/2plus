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
var UserProvider = /** @class */ (function () {
    function UserProvider(http, alertController, toastCtrl) {
        this.http = http;
        this.alertController = alertController;
        this.toastCtrl = toastCtrl;
    }
    /**
     * Return a user, given its id.
     * @param user_id the id of the user
     */
    UserProvider.prototype.getUserInfo = function (user_id) {
        return this.requestUserInfo(user_id).flatMap(function (info) {
            return 'full_name' in info ?
                Observable.create({ username: info.username, email: info.email, user_id: info.user_id }) :
                Observable.create({ username: info.username, email: info.email, user_id: info.user_id, fullname: info.full_name });
        });
    };
    /**
     * Perform a user information request.
     * @param user_id the id of the user
     */
    UserProvider.prototype.requestUserInfo = function (user_id) {
        var userInfoPath = "http://media.mw.metropolia.fi/wbma/users/" + user_id;
        var httpOptions = {
            headers: new HttpHeaders({
                'Content-type': 'application/json',
                'x-access-token': localStorage.getItem('token') || '',
            })
        };
        return this.http.get(userInfoPath, httpOptions);
    };
    /**
     * Delete a user by specifying a user id.
     * @param userID the id of the user to delete
     * @return true if success, false if failure
     */
    UserProvider.prototype.deleteUser = function (userID) {
        var deleteUserPath = "http://media.mw.metropolia.fi/wbma/users/" + userID;
        var httpOptions = {
            headers: new HttpHeaders({
                'x-access-token': localStorage.getItem('token') || ''
            }),
        };
        return this.http.delete(deleteUserPath, httpOptions).flatMap(function (res) { return Observable.create(res.status < 400); });
    };
    UserProvider = __decorate([
        Injectable()
        /**
         * Provides a way to handle users.
         */
        ,
        __metadata("design:paramtypes", [HttpClient,
            AlertController,
            ToastController])
    ], UserProvider);
    return UserProvider;
}());
export { UserProvider };
//# sourceMappingURL=user.js.map