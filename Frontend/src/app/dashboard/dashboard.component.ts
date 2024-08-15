import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserServiceService } from '../Services/user-service.service';
import { EmployeeService } from '../Services/employee.service';
import Swal from 'sweetalert2';
import { Employee } from '../Models/Employee';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PagenationComponent } from './pagenation/pagenation.component'; 
import { ChangeDetectorRef } from '@angular/core';

interface FileWithImage {
  imageUrl: string | ArrayBuffer | null; // URL for image preview
  file: File; // Original file
  size: number; // Size of the file in bytes
  name: string; // Name of the file
  baseCode: string | null; // Base64 encoded string of the file
  type: string; // MIME type of the file
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild(PagenationComponent) paginationComponent!: PagenationComponent;

  employees: any[] = [];
  pageNumber = 1;
  pageSize = 5;
  searchQuery = '';
  sortBy = '';
  sortOrder = '';
  private searchTerms = new Subject<string>();
  private searchSubscription: any;

  constructor(private myservice: UserServiceService, private myEmployeeService: EmployeeService,   private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {

      this.myEmployeeService.pageChange.subscribe(data=>{
      this.pageNumber= data.pageNumber
      this.pageSize =data.pageSize
      console.log("Page size", this.pageSize);
      
      this.loadEmployees();

    })

    this.searchSubscription = this.searchTerms
      .pipe(
        debounceTime(2000),
        distinctUntilChanged()
      )
      .subscribe((term) => {
        this.searchQuery = term;
        this.pageNumber=1;
        this.loadEmployees();
      });
    this.loadEmployees();

    this.myEmployeeService.onCreateAndUpdate.subscribe(data=>{
      if(data==true)
      {
        this.loadEmployees()
      }
    })
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  searchTermChanged(event: Event): void {
    const term = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchTerms.next(term);
  }

  // onPageChange(event: { pageNumber: number, pageSize: number }): void {
  //   this.pageNumber = event.pageNumber;
  //   this.pageSize = event.pageSize;    
  //   this.loadEmployees();
  // }

  loadEmployees() {
    this.myEmployeeService.getAllEmployees(this.pageNumber, this.pageSize, this.searchQuery, this.sortBy, this.sortOrder)
      .subscribe((data) => {
        this.employees = data.employees;
        const totalRows = data.totalNumberOfRows;
        console.log(this.employees);
        

        // Now directly call the calculateTotalPages method on the pagination component instance
        this.paginationComponent.calculateTotalPages(totalRows);
      });
  }

  onDelete(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.myEmployeeService.deleteEmployee(id).subscribe(
          response => {
            Swal.fire('Deleted!', 'The employee has been deleted.', 'success');
            this.loadEmployees();
          },
          error => {
            Swal.fire('Error!', 'There was an error deleting the employee.', 'error');
          }
        );
      }
    });
  }

  applyFilter(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.loadEmployees();
  }

  onEdit(employeeId: number): void {
    this.myEmployeeService.getEmployeeById(employeeId).subscribe(
      (employee: Employee) => {
        console.log('Employee data loaded:', employee);
        this.myEmployeeService.employeeToBeEdited = employee;
        this.myEmployeeService.triggerRefreshEmployees();
      },
      (error) => {
        console.error('Error fetching employee data:', error);
      }
    );
  }

  formatRate(rate: number, rateFlag: boolean): string {
    return `${rate}${rateFlag ? '  %' : '  $'}`;
  }

  isDrawerOpen = false;

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  setDrawerState(isOpen: boolean) {
    this.isDrawerOpen = isOpen;
  }

  sortingState = {
    name: true,
    email: true,
    client: true,
    yearsOfExperience: true,
    gender: true,
    rate: true,
    action: true
  };

  getSortIcon(column: string) {
    return this.sortingState[column] ? 'assets/sortdown.png' : 'assets/sortup.png';
  }

  sortColumn(column: string): void {
    this.sortingState[column] = !this.sortingState[column];
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }
    this.loadEmployees();
  }

  

  openAttachment(file: FileWithImage): void {
    if (file.baseCode) {
      const blob = this.base64ToBlob(file.baseCode, file.type);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } else {
      console.error('No base64 data available for this file.');
    }
  }

  // Helper function to convert base64 to Blob
  base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
  }
  






  //  // Check if MIME type is an image
  //  isImage(mimeType: string): boolean {
  //   return mimeType.startsWith('image/');
  // }
  // imageUrl: string;

  // updateImage() {
  //   setTimeout(() => {
  //     this.imageUrl = this.getImagePreviewUrl('base64String', 'image/png');
  //   });
  // }

  // getImagePreviewUrl(baseCode: string, mimeType: string): string {
  //   const base64Data = baseCode.replace(/^data:.*;base64,/, '');
  //   const blob = this.base64ToBlob(base64Data, mimeType);
  //   const url = URL.createObjectURL(blob);
  //   return url;
  // }

  // base64ToBlob(base64Data: string, mimeType: string): Blob {
  //   const byteCharacters = atob(base64Data);
  //   const byteArrays = [];
  //   for (let offset = 0; offset < byteCharacters.length; offset += 512) {
  //     const slice = byteCharacters.slice(offset, offset + 512);
  //     const byteNumbers = new Array(slice.length);
  //     for (let i = 0; i < slice.length; i++) {
  //       byteNumbers[i] = slice.charCodeAt(i);
  //     }
  //     const byteArray = new Uint8Array(byteNumbers);
  //     byteArrays.push(byteArray);
  //   }
  //   return new Blob(byteArrays, { type: mimeType });
  // }

  // // Open the attachment in a new tab
  // openAttachment(file: FileWithImage): void {
  //   if (file.baseCode) {
  //     const base64Data = file.baseCode.replace(/^data:.*;base64,/, '');
  //     const blob = this.base64ToBlob(base64Data, file.type);
  //     const url = URL.createObjectURL(blob);
  //     window.open(url, '_blank');

  //     // Revoke the Blob URL to free up memory
  //     URL.revokeObjectURL(url);
  //   } else {
  //     console.error('No base64 data available for this file.');
  //   }
  // }











  //   isImage(mimeType: string): boolean {
//     return mimeType.startsWith('image/');
//   }

// // Get the Blob URL for image preview
// getImagePreviewUrl(baseCode: string, mimeType: string): string {
//   const base64Data = baseCode.replace(/^data:.*;base64,/, '');
//   const blob = this.base64ToBlob(base64Data, mimeType);
//   const url = URL.createObjectURL(blob);
//   this.cdr.detectChanges(); // Trigger change detection
//   return url;
// }

//   // Convert base64 to Blob
//   base64ToBlob(base64: string, mimeType: string): Blob {
//     const byteCharacters = atob(base64);
//     const byteArrays: Uint8Array[] = [];

//     for (let offset = 0; offset < byteCharacters.length; offset += 512) {
//       const slice = byteCharacters.slice(offset, offset + 512);

//       const byteNumbers = new Array(slice.length);
//       for (let i = 0; i < slice.length; i++) {
//         byteNumbers[i] = slice.charCodeAt(i);
//       }

//       const byteArray = new Uint8Array(byteNumbers);
//       byteArrays.push(byteArray);
//     }

//     return new Blob(byteArrays, { type: mimeType });
//   }

//   // Open the attachment in a new tab
//   openAttachment(file: FileWithImage): void {
//     if (file.baseCode) {
//       const blob = this.base64ToBlob(file.baseCode, file.type);
//       const url = URL.createObjectURL(blob);
//       window.open(url, '_blank');
//     } else {
//       console.error('No base64 data available for this file.');
//     }
//   }

  
}
