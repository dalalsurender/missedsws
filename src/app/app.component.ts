import { Component, OnInit } from '@angular/core';
import { CityworksService } from './cityworks.service';
import { CityworksSrResponse } from './cityworks-sr-response';
import { ArcgisService } from './arcgis.service';
import { LocatorResponse } from './locator-response';
import { CityworksAuthResponse } from './cityworks-auth-response';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private cityworksService: CityworksService, private arcgisService: ArcgisService) { }

  title = 'missedsws';
  cwSrResponse: CityworksSrResponse;
  cwAuthResponse: CityworksAuthResponse;
  locaterResponse: LocatorResponse;
  address = '1413 scales st';
  error = 'error msg goes here';

  public problemSids = [
    { value: '263551', display: 'Garbage' },
    { value: '263552', display: 'Recycling' },
    { value: '263553', display: 'Yard Waste' },
  ];

  ngOnInit(): void {
    // this.cityworksService.createServiceRequest().subscribe((data: CityworksSrResponse) => this.cwSrResponse = { ...data });
    this.cityworksService.getToken().subscribe((data: CityworksAuthResponse) => this.cwAuthResponse = { ...data },
      error => this.error = error
    );

    this.arcgisService.geocode(this.address).subscribe((data: LocatorResponse) => this.locaterResponse = { ...data },
      error => this.error = error // error path
    );
  }

}
