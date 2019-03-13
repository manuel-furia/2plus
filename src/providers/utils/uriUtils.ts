import { Injectable } from '@angular/core';
@Injectable()
/**
 * To manipulate, encode and decode URIs.
 */
export class UriUtils {

  /**
   * Convert a URI to binary file
   * @param dataURI the URI
   */
  public dataURItoFile(dataURI) {
    let byteString;
    let mimeString;
    let ia;

    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = encodeURI(dataURI.split(',')[1]);
    }
    // separate out the mime component
    mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob: any = new Blob([ia], { type: mimeString });
    blob.lastModifiedDate = new Date();
    blob.name = 'blob';

    return <File>blob;
  }

}
