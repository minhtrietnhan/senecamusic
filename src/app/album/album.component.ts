import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumComponent implements OnInit {
  album: any;
  albumId: any;
  snackBarSub: any;
  routeSub: any;
  musicDataServiceSub: any;

  constructor(
    private route: ActivatedRoute,
    private matSnackBar: MatSnackBar,
    private musicDataService: MusicDataService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      this.albumId = params['id'];
      this.musicDataServiceSub = this.musicDataService
        .getAlbumById(this.albumId)
        .subscribe((data) => {
          this.album = data;
          this.setFavourites();
        });
    });
  }

  setFavourites(): void {
    this.musicDataServiceSub = this.musicDataService
      .getFavouritesInString()
      .subscribe((data) => {
        let favourites: [String] = data['favourites'];
        this.album.tracks.items.forEach((track) => {
          if (favourites.findIndex((fav) => track.id == fav) != -1) {
            track['isFavourite'] = true;
          } else {
            track['isFavourite'] = false;
          }
        });
        this.cd.detectChanges();
      });
    console.log(this.album);
  }

  addToFavourites(trackId): any {
    this.musicDataServiceSub = this.musicDataService
      .addToFavourites(trackId)
      .subscribe(
        (favourites) => {
          this.setFavourites();
          this.snackBarSub = this.matSnackBar.open(
            'Adding to Favourites...',
            'Done',
            { duration: 1500 }
          );
          this.cd.detectChanges();
        },
        (err) => {
          this.snackBarSub = this.matSnackBar.open(
            'Unable to add song to Favourites',
            'Done',
            { duration: 1500 }
          );
        },
        () => {}
      );
  }

  removeFromFavourites(id): any {
    this.musicDataServiceSub = this.musicDataService
      .removeFromFavourites(id)
      .subscribe(
        (favourites) => {
          this.setFavourites();
          this.snackBarSub = this.matSnackBar.open(
            'Removing from Favourites...',
            'Done',
            { duration: 1500 }
          );
          this.cd.detectChanges();
        },
        (err) => {
          this.snackBarSub = this.matSnackBar.open(
            'Unable to remove song from Favourites',
            'Done',
            { duration: 1500 }
          );
        },
        () => {}
      );
  }

  ngDestroy(): void {
    this.routeSub.unsubscribe();
    this.musicDataServiceSub.unsubscribe();
  }
}
