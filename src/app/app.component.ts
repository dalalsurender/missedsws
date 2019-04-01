import { Component, OnInit } from '@angular/core';
import { CityworksService } from './cityworks.service';
import { CityworksSrResponse } from './cityworks-sr-response';
import { ArcgisService } from './arcgis.service';
import { CityworksAuthResponse } from './cityworks-auth-response';
import { CityworksValidateTokenResponse } from './cityworks-validate-token-response';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { GeoResponse, Candidate, Location } from './geo-response';
import { CityworksSrRequest } from './cityworks-sr-request';
import { MatDialog } from '@angular/material';
import { DialogContentComponent } from './dialog-content/dialog-content.component';
import * as moment from 'moment';
import { Collectionareas, Feature } from './collectionareas';
import { Suggestion, WorldGeoResponse } from './world-geo-response';
import { Attribute } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isOdd: boolean;
  recycleDay: Feature[] = [];
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
  ckSrStatussubmitted: boolean;
  authResponse: any;
  srStatus: any;
  prjCompleteDate: any;
  prjCompleteStr: any;
  srNotFound: boolean;
  options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  day: string;
  cwSrResponse: CityworksSrResponse;
  submitted: boolean;
  reqid: number;
  week: string;
  isRecyclingWeek: string;
  cnt: number;
  addressNotFound: boolean;
  isNotRecyclingWeek: boolean;

  constructor(private _dialog: MatDialog, private cityworksService: CityworksService,
    private arcgisService: ArcgisService, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.isOdd = (moment().week() % 2) === 1;

    this.cityworksService.getToken().subscribe(
      (data: CityworksAuthResponse) => this.token = data.Value.Token,
      error => this.error = error
    );

    const PHONE_REGEX = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
    this.usersForm = this.fb.group({
      addressInput: [null, Validators.required],
      problemSid: [null, Validators.required],
      callerHomePhone: [null, [Validators.required, Validators.pattern(PHONE_REGEX)]],
      callerEmail: [null, Validators.email],
      comments: ['']
    });

    // this.subForm = this.fb.group({
    //   srInputId: ['', [Validators.maxLength(6), Validators.minLength(6), Validators.required]]
    // });

    // this.usersForm.get('addressInput').valueChanges.subscribe(value => this.recycle(value));

    this.usersForm
      .get('addressInput')
      .valueChanges
      .pipe(
        debounceTime(300),
        tap(() => {
          this.isLoading = true;
          this.addressNotFound = false;
          // this.isNotRecyclingWeek = false;
        }),
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
        this.arcgisService.getTrashDay(this.location).subscribe(
          collectionDay => {
            if (collectionDay.features.length === 1) {
              this.day = collectionDay.features[0].attributes.DAY;
              this.week = collectionDay.features[0].attributes.WEEK;
              if (this.week === 'A' && this.isOdd) {
                this.isRecyclingWeek = 'This week is your Recycling week. Your recycling week is week';
                this.isNotRecyclingWeek = false;
              } else if (this.week === 'B' && !this.isOdd) {
                this.isRecyclingWeek = 'This week is your Recycling week. Your recycling week is week';
                this.isNotRecyclingWeek = false;
              } else if (this.week === undefined) {
                this.isRecyclingWeek = 'This week is not your Recycling week';
                this.isNotRecyclingWeek = true;
              } else {
                this.isRecyclingWeek = 'This week is not your Recycling week. Your recycling week is week';
                this.isNotRecyclingWeek = true;
              }
            } else {
              this.addressNotFound = true;
              this.day = undefined;
            }
          });
        // console.log('this.recycleDay = ', this.recycleDay);
      });

    this.subForm = this.fb.group({
      srInputId: [null, [Validators.maxLength(6), Validators.minLength(6), Validators.required]]
    });

  }

  displayFn(address: Candidate) {
    if (address) {
      return address.address;
    }
  }

  checkSRStatus() {
    this.ckSrStatussubmitted = true;
    const requestId = { RequestId: this.subForm.get('srInputId').value };
    this.cityworksService.getServiceRequest(requestId).subscribe(data => this.authResponse = data,
      err => console.error(err),
      () => {
        this.ckSrStatussubmitted = false;
        if (this.authResponse.WarningMessages.length < 1) {
          this.srStatus = this.authResponse.Value.Status;
          if (this.srStatus === 'INPROG') {
            this.srStatus = 'In Progress';
          }
          if (this.srStatus === 'CLOSED') {
            this.srStatus = 'Completed';
          }
          // this.prjCompleteDate = this.authResponse.Value.PrjCompleteDate;
          // this.prjCompleteDate = new Date(this.authResponse.Value.PrjCompleteDate);
          // this.prjCompleteStr = this.prjCompleteDate.toLocaleDateString('en-US', this.options);

        } else {
          this.srNotFound = true;
          this.srStatus = undefined;
        }
      });
  }

  save(model: any, isValid: boolean) {
    this.submitted = true;

    this.problemSidDisplay = this.usersForm.controls.problemSid.value;
    if (this.problemSidDisplay === '263551') {
      this.problemSidDisplay = 'Garbage';
    } else if (this.problemSidDisplay === '263552') {
      this.problemSidDisplay = 'Recycling';
    } else if (this.problemSidDisplay === '263553') {
      this.problemSidDisplay = 'Yard Waste';
    }

    // console.log('model is ', JSON.stringify(model));

    const request = new CityworksSrRequest();
    request.address = model.addressInput.address;
    request.callerAddress = model.addressInput.address;
    request.callerCity = 'Raleigh';
    request.comments = model.comments;
    request.callerEmail = model.callerEmail;
    request.callerHomePhone = model.callerHomePhone;
    request.problemSid = model.problemSid;
    request.x = JSON.stringify(model.addressInput.location.x);
    request.y = JSON.stringify(model.addressInput.location.y);

    this.cityworksService.createServiceRequest(request).subscribe((data: CityworksSrResponse) => {
      this.cwSrResponse = {
        ...data
      };
      this.submitted = false;
      this.reqid = this.cwSrResponse.Value.RequestId;
      // console.log('reqid1 = ', this.cwSrResponse.Value.RequestId);

    });

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
