import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-artist-discography',
  templateUrl: './artist-discography.component.html',
  styleUrls: ['./artist-discography.component.css'],
})
export class ArtistDiscographyComponent implements OnInit {
  albums: any;
  artist: any;
  artistId: any;
  musicDataServiceSub: any;
  routeSub: any;
  constructor(
    private route: ActivatedRoute,
    private musicDataService: MusicDataService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      this.artistId = params['id'];
      this.musicDataServiceSub = this.musicDataService
        .getArtistById(this.artistId)
        .subscribe(
          (data) => {
            this.artist = data;
            this.musicDataService
              .getAlbumsByArtistId(this.artistId)
              .subscribe((data) => {
                console.log(data);
                this.albums = data.items.filter(
                  (album, idx, self) =>
                    idx ===
                    self.findIndex(
                      (elem) =>
                        elem['name'].toLowerCase() ===
                        album['name'].toLowerCase()
                    )
                );
                console.log(this.albums);
              });
          },
          (err) => {},
          () => {
            console.log(this.albums);
          }
        );
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    this.musicDataServiceSub.unsubscribe();
  }
}
