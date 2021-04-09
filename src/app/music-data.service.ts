import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SpotifyTokenService } from './spotify-token.service';
import { environment } from './../environments/environment';

import { mergeMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MusicDataService {
  constructor(
    private spotifyToken: SpotifyTokenService,
    private http: HttpClient
  ) {}

  getNewReleases(): Observable<SpotifyApi.ListOfNewReleasesResponse> {
    return this.spotifyToken
      .getBearerToken()
      .pipe(
        mergeMap((token) => {
          return this.http.get<any>(
            'https://api.spotify.com/v1/browse/new-releases',
            { headers: { Authorization: `Bearer ${token}` } }
          );
        })
      )
      .pipe(map((data) => data.albums.items));
  }

  getArtistById(id): Observable<SpotifyApi.ArtistSearchResponse> {
    return this.spotifyToken.getBearerToken().pipe(
      mergeMap((token) => {
        return this.http.get<any>(`https://api.spotify.com/v1/artists/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
    );
  }

  getAlbumsByArtistId(id): Observable<SpotifyApi.ArtistsAlbumsResponse> {
    return this.spotifyToken.getBearerToken().pipe(
      mergeMap((token) => {
        return this.http.get<any>(
          `https://api.spotify.com/v1/artists/${id}/albums?include_groups=album,single&limit=50`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      })
    );
  }

  getAlbumById(id): Observable<SpotifyApi.SingleAlbumResponse> {
    return this.spotifyToken.getBearerToken().pipe(
      mergeMap((token) => {
        return this.http.get<any>(`https://api.spotify.com/v1/albums/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
    );
  }

  searchArtists(searchString): Observable<SpotifyApi.ArtistSearchResponse> {
    return this.spotifyToken.getBearerToken().pipe(
      mergeMap((token) => {
        return this.http.get<any>(
          `https://api.spotify.com/v1/search?q=${searchString}&type=artist&limit=50`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      })
    );
  }

  // addToFavourites(id): Boolean {}

  // removeFromFavourites(id): Boolean {
  //   if (this.favouritesList.length > 0) {
  //     this.favouritesList.splice(this.favouritesList.indexOf(id), 1);
  //     return true;
  //   }
  //   return false;
  // }

  removeFromFavouritesObservable(id): Observable<any> {
    if (this.removeFromFavourites(id)) {
      return this.getFavourites();
    }
  }

  // getFavourites(): Observable<any> {
  //   if (this.favouritesList.length > 0) {
  //     return this.spotifyToken.getBearerToken().pipe(
  //       mergeMap((token) => {
  //         return this.http.get<any>(
  //           `https://api.spotify.com/v1/tracks?ids=${this.favouritesList.join()}`,
  //           {
  //             headers: { Authorization: `Bearer ${token}` },
  //           }
  //         );
  //       })
  //     );
  //   } else {
  //     return new Observable((o) => {
  //       o.next([]);
  //     });
  //   }
  // }

  addToFavourites(id): Observable<[String]> {
    // TODO: make a PUT request to environment.userAPIBase/favourites/:id to add id to favourites
    return this.http.put<[String]>(
      `${environment.userAPIBase}/favourites/${id}`,
      {
        id: id,
      }
    );
  }

  removeFromFavourites(id): Observable<any> {
    return this.http
      .delete<[String]>(`${environment.userAPIBase}/favourites/${id}`)
      .pipe(
        mergeMap((favouritesArray) => {
          console.log(favouritesArray);
          // TODO: Perform the same tasks as the original getFavourites() method, only using "favouritesArray" from above, instead of this.favouritesList
          // NOTE: for the empty array, you will need to use o=>o.next({tracks: []}) instead of o=>{o.next([])}
          if (favouritesArray['favourites'].length > 0) {
            return this.spotifyToken.getBearerToken().pipe(
              mergeMap((token) => {
                return this.http.get<any>(
                  `https://api.spotify.com/v1/tracks?ids=${favouritesArray[
                    'favourites'
                  ].join()}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
              })
            );
          } else {
            return new Observable((o) => {
              o.next({ tracks: [] });
            });
          }
        })
      );
  }

  getFavouritesInString(): Observable<[String]> {
    return this.http.get<[String]>(`${environment.userAPIBase}/favourites/`);
  }

  getFavourites(): Observable<SpotifyApi.MultipleTracksResponse> {
    return this.http
      .get<[String]>(`${environment.userAPIBase}/favourites/`)
      .pipe(
        mergeMap((favouritesArray) => {
          console.log(favouritesArray);
          // TODO: Perform the same tasks as the original getFavourites() method, only using "favouritesArray" from above, instead of this.favouritesList
          // NOTE: for the empty array, you will need to use o=>o.next({tracks: []}) instead of o=>{o.next([])}
          if (favouritesArray['favourites'].length > 0) {
            console.log('getting fav list from spotify');
            return this.spotifyToken.getBearerToken().pipe(
              mergeMap((token) => {
                return this.http.get<any>(
                  `https://api.spotify.com/v1/tracks?ids=${favouritesArray[
                    'favourites'
                  ].join()}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
              })
            );
          } else {
            console.log('returning nothing');
            return new Observable((o) => {
              o.next({ tracks: [] });
            });
          }
        })
      );
  }
}
