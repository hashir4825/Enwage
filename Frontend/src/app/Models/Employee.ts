// src/app/models/employee.model.ts
export interface Employee {
    id?: number;
    name: string;
    email: string;
    dob: string; // Use string type for ISO date format
    experiencestart: string;
    experienceend: string;
    yearsOfExperience: string;
    rate: number;
    rateFlag: boolean;
    gender: string;
    clientId: number;
    employeestates: EmployeeState[];
    attachments?: Attachment[]; // Optional field
    noOfFiles: number; // Add this field
    noOfStates: number
  }
  
  export interface EmployeeState {
    id?: number;
    stateId: number;
    employeeId: number;
  }
  
  export interface Attachment {
    id?: number;
    name: string;
    size: number;
    type: string;
    employeeId: number;
    baseCode: string;
  }
  
  export interface GetAllEmployees {
    employees: Employee[];
    totalNumberOfRows: 0;
  }
   