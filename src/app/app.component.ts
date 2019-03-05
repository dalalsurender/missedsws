import { Component, OnInit } from '@angular/core';
import { CityworksService } from './cityworks.service';
import { CityworksSrResponse } from './cityworks-sr-response';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  constructor(private cityworksService: CityworksService) { }

  title = 'missedsws';
  res: CityworksSrResponse;

  public problemSids = [
    { value: '263551', display: 'Garbage' },
    { value: '263552', display: 'Recycling' },
    { value: '263553', display: 'Yard Waste' },
  ];

  ngOnInit(): void {
    this.cityworksService.createServiceRequest().subscribe((data: CityworksSrResponse) => this.res = { ...data });
  }


}
