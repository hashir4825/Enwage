import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/Services/employee.service';

@Component({
  selector: 'app-pagenation',
  templateUrl: './pagenation.component.html',
  styleUrls: ['./pagenation.component.css']
})
export class PagenationComponent implements OnInit {
 
  constructor(private employeeService: EmployeeService) {
    
    
  }
  @Input() currentPage: number=1;
  @Input() pageSize: number =5;
  // @Output() pageChange = new EventEmitter<{ pageNumber: number, pageSize: number }>();

  allrows: number;
  totalRows = 0;
  totalPages = 0;

  ngOnInit() {
    // Emit initial values on load
    // this.emitPageChange();
  }

  emitPageChange() {
    // this.employeeService.RefreshPage.emit(true);
    // this.pageChange.emit({ pageNumber: this.currentPage, pageSize: this.pageSize });
  }

  handlePageSizeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.pageSize = Number(selectElement.value);
    console.log(this.pageSize);
    
    this.currentPage = 1; // Reset to the first page
    this.employeeService.pageChange.emit({ pageNumber: this.currentPage, pageSize: this.pageSize });

    // this.emitPageChange();
  }

  handlePageChange(newPage: number) {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.employeeService.pageChange.emit({ pageNumber: this.currentPage, pageSize: this.pageSize });

      // this.emitPageChange();
    }
  }

  calculateTotalPages(totalRows: number) {
    this.allrows = totalRows;
    this.totalPages = Math.ceil(totalRows / this.pageSize);
  }

}
