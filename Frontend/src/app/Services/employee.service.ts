import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import { Employee, GetAllEmployees } from '../Models/Employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://localhost:7129/api/Employee';

  employeeToBeEdited: Employee;
  public deleteEmployeeId = new EventEmitter<number>();

  pageChange = new EventEmitter<{ pageNumber: number, pageSize: number }>();

  public onCreateAndUpdate = new EventEmitter<boolean>();


  constructor(private http: HttpClient) {}

  private refreshEmployeesSubject = new Subject<void>();
 
  // Observable to expose the subject
  refreshEmployees$ = this.refreshEmployeesSubject.asObservable();
 
  // Method to trigger the subject
  triggerRefreshEmployees() {
    this.refreshEmployeesSubject.next();
  }

  // getAllEmployees(pageNumber: number, pageRows: number): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/${pageNumber}/${pageRows}`);
  // }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }
  // Method to get employee by ID
  getEmployeeById(id: number): Observable<Employee> {
    const url = `${this.apiUrl}/${id}`; // Construct the URL with the ID
    return this.http.get<Employee>(url); // Send GET request
  }


  getAllEmployees(
    pageNumber: number,
    pageSize: number,
    searchQuery?: string,
    sortBy?: string,
    sortOrder?: string
  ): Observable<GetAllEmployees> {
    let url = `${this.apiUrl}/${pageNumber}/${pageSize}`;
    const params = [];

    if (searchQuery) {
      params.push(`searchQuery=${searchQuery}`);
    }
    if (sortBy) {
      params.push(`sortBy=${sortBy}`);
    }
    if (sortOrder) {
      params.push(`sortOrder=${sortOrder}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return this.http.get<GetAllEmployees>(url).pipe(
      map((data: GetAllEmployees) => data)
    );
  }


  updateEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(this.apiUrl, employee);
  }
}
