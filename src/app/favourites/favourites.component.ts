import { Component, OnInit } from '@angular/core';
import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css'],
})
export class FavouritesComponent implements OnInit {
  favourites: Array<any>;
  musicDataServiceSub: any;

  constructor(private musicDataService: MusicDataService) {}

  removeFromFavourites(id): void {
    this.musicDataServiceSub = this.musicDataService
      .removeFromFavourites(id)
      .subscribe((data) => {
        this.favourites = data.tracks;
        console.log(this.favourites);
      });
  }

  ngOnInit(): void {
    this.musicDataServiceSub = this.musicDataService
      .getFavourites()
      .subscribe((data) => {
        this.favourites = data.tracks;
        console.log(`inside fav comp`);
        console.log(data);
        console.log(this.favourites);
      });
  }

  ngOnDestroy(): void {
    this.musicDataServiceSub.unsubscribe();
  }
}
