import { Tag } from '@angular/compiler/src/i18n/serializers/xml_helper';

export interface Media {
  file_id: number;
  filename: string;
  filesize: number;
  title: string;
  description: string;
  user_id: number;
  media_type: string;
  mime_type: string;
  time_added?: string;
  screenshot?: string;
  thumbnails: Thumbnail;
  tags?: Tag;
}

export  interface Thumbnail {
  w160?: string;
  w320?: string;
  w640?: string;
}


export interface Tag {
  tag_id: number;
  tag: string;
  file_id: number;
}
