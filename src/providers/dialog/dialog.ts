import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { AlertController, ToastController } from "ionic-angular";

@Injectable()
/**
 * Handles dialog messages (e.g. alert, toast) to communicate with the user.
 */
export class DialogProvider {

  constructor(private alertController: AlertController,
              private toastCtrl: ToastController,) { }

  /**
   * Show a confirmation alert to the user.
   * @param message
   */
  confirmationAlert(message: string): Observable<boolean> {
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

    return Observable.fromPromise(promise);
  }

  /**
   * Show a toast message to the user.
   * @param message the message
   * @param duration the toast duration (default 2000 ms)
   */
  presentToast(message: string, duration: number = 2000) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration
    });
    toast.present();
  }


}
