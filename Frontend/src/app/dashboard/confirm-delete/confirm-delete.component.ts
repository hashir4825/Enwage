// import { Component, OnInit } from '@angular/core';
// import { EmployeeService } from 'src/app/Services/employee.service';
// import { UserServiceService } from 'src/app/Services/user-service.service';

// @Component({
//   selector: 'app-confirm-delete',
//   templateUrl: './confirm-delete.component.html',
//   styleUrls: ['./confirm-delete.component.css']
// })
// export class ConfirmDeleteComponent implements OnInit{


//   employeeIdToDelete: number | null = null;

//   constructor(private myservice: UserServiceService, private employeeService : EmployeeService) 
//   {
    
//   }
//   ngOnInit(): void {
//     this.employeeService.deleteEmployeeId.subscribe((id: number) => {
//       this.employeeIdToDelete = id;  
//       console.log("ABC : ", this.employeeIdToDelete);    
      
//     });
//   }

//   // onClose()
//   // {

//   //   this.myservice.showDeleteModal.emit(false);
//   // }

//   Delete()
//   {
//     console.log(this.employeeIdToDelete);
//     if(this.employeeIdToDelete === null)
//     {
//       alert("Id is not preset");
//     }
//     this.employeeService.deleteEmployee(this.employeeIdToDelete);
//     // this.myservice.showDeleteModal.emit(false);
//   }
// }
