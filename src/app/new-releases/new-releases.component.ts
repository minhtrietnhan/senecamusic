import { Component, OnInit } from '@angular/core';
import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-new-releases',
  templateUrl: './new-releases.component.html',
  styleUrls: ['./new-releases.component.css'],
})
export class NewReleasesComponent implements OnInit {
  releases: any;
  musicDataServiceSub: any;
  constructor(private musicDataService: MusicDataService) {}

  ngOnInit(): void {
    this.musicDataServiceSub = this.musicDataService.getNewReleases().subscribe(
      (data) => {
        console.log(data);
        this.releases = data;
      },
      (err) => {},
      () => {}
    );
  }

  ngOnDestroy(): void {
    this.musicDataServiceSub.unsubscribe();
  }
}
