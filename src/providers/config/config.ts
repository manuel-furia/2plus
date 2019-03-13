import { Injectable } from '@angular/core';
@Injectable()
/**
 * To retrieve global configuration values.
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

  /**
   * Returns the tag associated with items for this app.
   */
  public getAppItemTag(): string {
    return this.appTag + 'item';
  }

  /**
   * Returns the tag associated with the avatars of a user.
   */
  public getAvatarTag(user_id: number): string {
    return this.appTag + 'profile' + user_id;
  }

}
