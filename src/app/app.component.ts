import { Component, OnInit } from '@angular/core';
import { CityworksService } from './cityworks.service';
import { CityworksSrResponse } from './cityworks-sr-response';
import { ArcgisService } from './arcgis.service';
import { CityworksAuthResponse } from './cityworks-auth-response';
import { CityworksValidateTokenResponse } from './cityworks-validate-token-response';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { GeoResponse, Candidate, Location } from './geo-response';
import { User } from './user';
import { MatDialog } from '@angular/material';
import { DialogContentComponent } from './dialog-content/dialog-content.component';
import * as moment from 'moment';
import { Collectionareas, Feature } from './collectionareas';
import { Suggestion, WorldGeoResponse } from './world-geo-response';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isOdd: boolean;
  recycleDay: Feature[];
  isLoading: boolean;
  filteredAddresses: Candidate[] = [];
  usersForm: FormGroup;
  subForm: FormGroup;
  problemSidDisplay: any;
  geoResponse: GeoResponse;
  worldGeoResponse: WorldGeoResponse;
  address = '1413 scales st';
  error = 'error msg goes here';
  token: string;
  public problemSids = [
    { value: '263551', display: 'Garbage' },
    { value: '263552', display: 'Recycling' },
    { value: '263553', display: 'Yard Waste' },
  ];
  location: Location;

  constructor(private _dialog: MatDialog, private cityworksService: CityworksService,
    private arcgisService: ArcgisService, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.cityworksService.getToken().subscribe(
      (data: CityworksAuthResponse) => this.token = data.Value.Token,
      error => this.error = error
    );

    const PHONE_REGEX = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
    this.usersForm = this.fb.group({
      addressInput: [null, Validators.required],
      problemSid: [null, Validators.required],
      callerHomePhone: ['', [Validators.required, Validators.pattern(PHONE_REGEX)]],
      callerEmail: ['', Validators.email],
      callerFirstName: [''],
      comments: ['']
    });

    this.subForm = this.fb.group({
      srInputId: ['', [Validators.maxLength(6), Validators.minLength(6), Validators.required]]
    });

    // this.usersForm.get('addressInput').valueChanges.subscribe(value => this.recycle(value));

    this.usersForm
      .get('addressInput')
      .valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.isLoading = true),
        switchMap(value => this.arcgisService.geocode(value)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      ).subscribe(data => {
        this.filteredAddresses = data.candidates;
        this.location = this.usersForm.get('addressInput').value.location;
        this.arcgisService.getTrashDay(this.location).subscribe(collectionDay => this.recycleDay = collectionDay.features);
        console.log('this.recycleDay = ', this.recycleDay);
      });

    this.subForm = this.fb.group({
      srInputId: ['', [Validators.maxLength(6), Validators.minLength(6), Validators.required]]
    });

  }

  displayFn(address: Candidate) {
    if (address) {
      return address.address;
    }
  }

  recycle(val) {

    // this.arcgisService.getTrashDay(address.location).subscribe(day => console.log('the day is ', this.recycleDay = day));


    // this.geocodeRal(address) (coords => console.log('inside geocode service', this.coordinates = coords)));

    // this.arcgisService.geocodeRal(val).pipe(
    //   map(loc => {
    //     this.coordinates = loc;
    //     // console.log('the coordinates are ', this.coordinates);
    //   })
    // ).subscribe(x => console.log('x is ', x));



    //   .pipe(flatMap(() => {
    //   // need to get coordinates from Raleigh locator based on address text from Esri World GeoCoder
    //   this.arcgisService.geocodeRal(this.usersForm.get('addressInput').value).subscribe(
    //     data =>
    //       this.coordinates = data.candidates[0],
    //     error => console.log('Error: ', error),
    //     // () => console.log('Do we have coordinates yet? ', this.coordinates.location)
    //   );
    // })


    // console.log('pure field value is ', this.coordinates.location);
    // if (this.coordinates.location !== undefined) {
    //   this.arcgisService.getTrashDay(this.coordinates.location).subscribe(
    //     data => {
    //       this.recycleDay = data;
    //       // this.getWeek();
    //       console.log('finalized switchmap field value is ', this.recycleDay);
    //     }
    //   );
    // } else {
    //   // user did not select from drop down
    //   console.log('else condition field value is ', val);
    //   this.arcgisService.geocode(val).subscribe(location => this.worldGeoResponse = location);
    // }

    // this.arcgisService.getTrashDay('')

    // for (const addressEntry in this.testCandidates) {
    //   if (this.testCandidates[addressEntry].address === this.myForm.get('callerAddress').value) {
    //     // console.log('we have a match on address, heres its coordinates', this.testCandidates[addressEntry].location);
    //     // console.log('addressEntry', addressEntry);
    //     this.geocodeService.getTrashDay(this.testCandidates[addressEntry].location).subscribe(
    //       data => {
    //         this.collectionareas = data;
    //         for (var i = 0; i < this.collectionareas.features.length; i++) {
    //           if (this.collectionareas.features[i].attributes.WEEK) {
    //             this.newweek = this.collectionareas.features[i].attributes.WEEK;
    //             // console.log('newweek in if = ', this.newweek);
    //             this.getWeek(this.newweek);
    //             this.testCandidates.splice(0);
    //           }
    //         }
    //         // this.getWeek(this.collectionareas.features[0].attributes.WEEK); 

    //       },
    //       err => console.error(err),
    //       () => {
    //         //console.log('done inside getTrashday call', this.week = this.collectionareas.features[0].attributes.WEEK);

    //         // console.log('newweek below is = ', this.newweek);
    //         if (this.newweek === 'A' && this.isOdd) {
    //           this.isRecyclingWeek = 'This week is your Recycling week. Your week is week';
    //           this.isNotRecyclingWeek = false;
    //         } else if (this.newweek === 'B' && !this.isOdd) {
    //           this.isRecyclingWeek = 'This week is your Recycling week. Your week is week';
    //           this.isNotRecyclingWeek = false;
    //         } else if (this.newweek === undefined) {
    //           this.msg = '';
    //           this.isRecyclingWeek = 'This week is not your Recycling week.' + this.msg;
    //           this.isNotRecyclingWeek = true;
    //         } else {
    //           this.isRecyclingWeek = 'This week is not your Recycling week. Your week is week';
    //           this.isNotRecyclingWeek = true;
    //         }
    //       });
    //   } else {

    //     this.geocodeService.getTrashDay(this.testCandidates[addressEntry].location).subscribe(
    //       data => {
    //         this.collectionareas = data;
    //         for (var i = 0; i < this.collectionareas.features.length; i++) {
    //           if (this.collectionareas.features[i].attributes.WEEK) {
    //             this.newweek = this.collectionareas.features[i].attributes.WEEK;
    //             // console.log('newweek in else = ', this.newweek);
    //             this.getWeek(this.newweek);
    //             this.testCandidates.splice(0);
    //           }
    //         }
    //       },
    //       err => console.error(err),
    //       () => {
    //         // console.log('done inside getTrashday call', this.week = this.collectionareas.features[0].attributes.WEEK);
    //         // console.log('newweek below is = ', this.newweek);
    //         if (this.newweek === 'A' && this.isOdd) {
    //           this.isRecyclingWeek = 'This week is your Recycling week. Your week is week';
    //           this.isNotRecyclingWeek = false;
    //         } else if (this.newweek === 'B' && !this.isOdd) {
    //           this.isRecyclingWeek = 'This week is your Recycling week. Your week is week';
    //           this.isNotRecyclingWeek = false;
    //         } else if (this.newweek === undefined) {
    //           this.msg = '';
    //           this.isRecyclingWeek = 'This week is not your Recycling week.' + this.msg;
    //           this.isNotRecyclingWeek = true;
    //         } else {
    //           this.isRecyclingWeek = 'This week is not your Recycling week. Your week is week';
    //           this.isNotRecyclingWeek = true;
    //         }

    //       });
    //   }
    // }
  }

  // getWeek(): any {
  //   this.isOdd = (moment().week() % 2) === 1;
  // }

  save(model: User, isValid: boolean) {
    this.problemSidDisplay = this.usersForm.controls.problemSid.value;
    if (this.problemSidDisplay === '263551') {
      this.problemSidDisplay = 'Garbage';
    } else if (this.problemSidDisplay === '263552') {
      this.problemSidDisplay = 'Recycling';
    } else if (this.problemSidDisplay === '263553') {
      this.problemSidDisplay = 'Yard Waste';
    }
  }

  openDialog(page: string) {
    if (page === 'about') {
      const dialogRef = this._dialog.open(DialogContentComponent);
    } else if (page === 'help') {
      const dialogRef = this._dialog.open(DialogContentComponent);
    } else if (page === 'status') {
      const dialogRef = this._dialog.open(DialogContentComponent);
    }
  }

}















// geocodedAddress: Candidate[];

// tokenIsValid: boolean;
  // cwSrResponse: CityworksSrResponse;
  // cwAuthResponse: CityworksAuthResponse;
  // cwAuthValResponse: CityworksValidateTokenResponse;


    // this.arcgisService.geocode(this.address).subscribe(
    //   (mydata: GeoResponse) => {
    //     return this.geocodedAddress = mydata.candidates;
    //   },
    //   error => this.error = error // error path
    // );

    // this.cityworksService.validateToken().subscribe(
    //   (data: CityworksValidateTokenResponse) => {
    //     this.tokenIsValid = data.Value;
    //     if (!this.tokenIsValid) {

    //     }
    //   },
    //   error => {
    //     this.error = error;
    //   }
    // );

    // this.cityworksService.createServiceRequest().subscribe((data: CityworksSrResponse) => this.cwSrResponse = { ...data });
    // console.log('before getToken');

    // this.arcgisService.geocode(this.address).subscribe((data: LocatorResponse) => this.locaterResponse = { ...data },
    //   error => this.error = error // error path
    // );