import { Component, OnInit, Optional, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.css']
})
export class DialogContentComponent {

  title = 'DialogContentComponent works!';
  @Input() page: string;

  constructor(@Optional() public dialogRef: MatDialogRef<DialogContentComponent>) {
    // console.log('test in constructor = ', this.page);
  }

  public callFunction() {
    // console.log('test in callFunction = ', this.page);
  }

}
