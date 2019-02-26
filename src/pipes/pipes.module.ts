import { NgModule } from '@angular/core';
import { ThumbnailsPipe } from './thumbnails/thumbnails';
import { GetTagsPipe } from './get-tags/get-tags';
@NgModule({
	declarations: [ThumbnailsPipe,
    GetTagsPipe],
	imports: [],
	exports: [ThumbnailsPipe,
    GetTagsPipe]
})
export class PipesModule {}
