import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserServiceService } from '../Services/user-service.service';
import { EmployeeService } from '../Services/employee.service';
import Swal from 'sweetalert2';
import { Employee } from '../Models/Employee';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PagenationComponent } from './pagenation/pagenation.component'; 

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

  constructor(private myservice: UserServiceService, private myEmployeeService: EmployeeService) {}

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
        this.loadEmployees();
      });
    this.loadEmployees();
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
}
