import { Injectable } from '@angular/core';
@Injectable()
/**
 * Handles toast messages to the user.
 */
export class ConfigProvider {

  private appTag: string = '2plus';

  constructor() {
  }

  /**
   * Returns the tag associated with the medias of this app on the server.
   */
  public getAppTag(): string {
    return this.appTag;
  }

}
