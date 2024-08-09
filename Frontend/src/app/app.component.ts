import { Component, OnInit } from '@angular/core';
import { UserServiceService } from './Services/user-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'demoProject';
  closeWindow: boolean = false;

  /**
   *
   */
  constructor(private myservice: UserServiceService) {
    
    
  }
  // ngOnInit(): void {
  //   this.myservice.showDeleteModal.subscribe((value)=>{
  //     this.closeWindow = value;
  //   })
  // }
}
