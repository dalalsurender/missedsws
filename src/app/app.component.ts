import { Component, OnInit } from '@angular/core';
import { CityworksService } from './cityworks.service';
import { CityworksSrResponse } from './cityworks-sr-response';
import { ArcgisService } from './arcgis.service';
import { CityworksAuthResponse } from './cityworks-auth-response';
import { CityworksValidateTokenResponse } from './cityworks-validate-token-response';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { GeoResponse, Candidate } from './geo-response';
import { User } from './user';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  constructor(private cityworksService: CityworksService, private arcgisService: ArcgisService, private fb: FormBuilder) { }

  isLoading: boolean;
  filteredAddresses: Candidate[] = [];
  usersForm: FormGroup;
  subForm: FormGroup;
  problemSidDisplay: any;
  geoResponse: GeoResponse;
  address = '1413 scales st';
  error = 'error msg goes here';
  token: string;

  public problemSids = [
    { value: '263551', display: 'Garbage' },
    { value: '263552', display: 'Recycling' },
    { value: '263553', display: 'Yard Waste' },
  ];

  ngOnInit(): void {

    this.cityworksService.getToken().subscribe(
      (data: CityworksAuthResponse) => this.token = data.Value.Token,
      error => this.error = error
    );

    const PHONE_REGEX = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
    this.usersForm = this.fb.group({
      addressInput: null,
      problemSid: null,
      callerHomePhone: ['', [Validators.required, Validators.pattern(PHONE_REGEX)]],
      callerEmail: ['', Validators.email],
      callerFirstName: [''],
    });

    this.usersForm
      .get('addressInput')
      .valueChanges
      .pipe(
        debounceTime(200),
        tap(() => this.isLoading = true),
        switchMap(value => this.arcgisService.geocode(value)
          .pipe(
            finalize(() => this.isLoading = false),
          )
        )
      )
      .subscribe(data => this.filteredAddresses = data.candidates);

    this.subForm = this.fb.group({
      srInputId: ['', [Validators.maxLength(6), Validators.minLength(6), Validators.required]]
    });
  }

  displayFn(address: Candidate) {
    if (address) { return address.address; }
  }

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