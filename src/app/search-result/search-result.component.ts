import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css'],
})
export class SearchResultComponent implements OnInit {
  results: any;
  searchQuery: any;
  routeSub: any;
  musicDataServiceSub: any;

  constructor(
    private route: ActivatedRoute,
    private musicDataService: MusicDataService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['q'];
      this.musicDataServiceSub = this.musicDataService
        .searchArtists(this.searchQuery)
        .subscribe((data) => {
          console.log(data);
          this.results = data.artists.items.filter(
            (item) => item.images.length > 0
          );
          console.log(this.results);
        });
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    this.musicDataServiceSub.unsubscribe();
  }
}
