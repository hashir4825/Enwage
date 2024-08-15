import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
// import { percentageValidator, hourlyRateValidator, experienceDateValidator } from '../custom-validators';
import { DropdownDataService, Client, State } from '../Services/dropdown-data.service';
import { EmployeeService } from '../Services/employee.service'; // Import your service
import { Employee } from '../Models/Employee';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { UserServiceService } from '../Services/user-service.service';
interface FileWithImage {
  imageUrl: string | ArrayBuffer | null; // URL for image preview
  file: File; // Original file
  size: number; // Size of the file in bytes
  name: string; // Name of the file
  base64: string | null; // Base64 encoded string of the file
  type: string; // MIME type of the file
}

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  no_of_states: number = 0
  todayDate: string;

  clients: Client[] = [];
  states: State[] = [];


  loadStates(): void {
    this.dropdownDataService.getAllStates().subscribe({
      next: (resp) => {
        this.states = resp;
      },
      error: (err) => {

      }
    });
  }

  loadClients(): void {
    this.dropdownDataService.getAllClients().subscribe(
      (data: Client[]) => {
        this.clients = data;
      },
      error => {
        console.error('Error fetching clients', error);
      }
    );
  }


  form: FormGroup;
  isPresent: boolean = false;
  isPercentage: boolean = false;
  presentDate: string = new Date().toISOString().split('T')[0]; // Default to today's date
  targetEmployee: Employee;

  constructor(
    private fb: FormBuilder,
    private dropdownDataService: DropdownDataService,
    private employeeService: EmployeeService, // Inject the service
    private myservice: UserServiceService
  ) { }

  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {

    this.todayDate = new Date().toISOString().split('T')[0]; // Set today's date in YYYY-MM-DD format

    this.loadClients();
    this.loadStates();

    this.subscriptions.add(
      this.employeeService.refreshEmployees$.subscribe(() => {
        this.targetEmployee = this.employeeService.employeeToBeEdited;
        console.log("I AM", this.targetEmployee);
        this.populateForm();

      })
    );

    this.form = this.fb.group({
      // name: ['', Validators.required],
      // email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, this.noSpaceAtStartValidator()]],
      email: ['', [Validators.required, Validators.email, this.emailValidator()]],
      client: ['', Validators.required],
      state: ['', Validators.required],
      dob: ['', [Validators.required, this.dobValidator(16)]],
      experienceStart: ['', [Validators.required, this.experienceStartDateDobValidator('dob')]],



      experienceEnd: [{ value: '', disabled: this.isPresent }, Validators.required],
      yearsExperience: [{ value: '', disabled: true }],
      rate: ['', [Validators.required]],
      gender: [''],
      rateFlag: [false],
      fileUpload: [null]
    }, { validators: this.experienceDateValidator() });


    this.updateRateValidators();

    this.form.get('rate')?.valueChanges.subscribe(value => {
      this.updateRateValidators();
    });

    this.form.get('experienceStart')?.valueChanges.subscribe(() => this.calculateExperience());
    this.form.get('experienceEnd')?.valueChanges.subscribe(() => this.calculateExperience());
  }


  @Input() isDrawerOpen: boolean;
  @Output() closeDrawer = new EventEmitter<boolean>();

  selectedFiles: File[] = []; // Array to store selected files
  filesWithImages: FileWithImage[] = []; // Array to store files with image previews

  onCloseDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
    this.closeDrawer.emit(this.isDrawerOpen); // Emit false to indicate closing the drawer
    console.log("From form component", this.isDrawerOpen);

    // Resetting values
    this.targetEmployee = null;
    this.employeeService.employeeToBeEdited = null;
    // console.log(this.form.value);
    this.isPercentage = false;
    const percentageCheckbox = document.getElementById('changeState') as HTMLInputElement;
    percentageCheckbox.checked = false;

    const dateCheckbox = document.getElementById('isPresent') as HTMLInputElement;
    dateCheckbox.checked = false;
    this.form.reset();
    this.selectedFiles = [];
    this.filesWithImages = [];
    // console.log(this.form.value);

  }
  updateRateValidators(): void {
    const rateControl = this.form.get('rate');
    if (this.isPercentage) {
      rateControl?.setValidators([Validators.required, this.percentageValidator()]);
    } else {
      rateControl?.setValidators([Validators.required, this.hourlyRateValidator()]);
    }
    rateControl?.updateValueAndValidity({ emitEvent: false }); // Avoid recursive updates
  }


  togglePresent(event: any): void {
    this.isPresent = event.target.checked;
    const experienceEndControl = this.form.get('experienceEnd');
    if (this.isPresent) {
      experienceEndControl?.disable();
      experienceEndControl?.setValue(this.presentDate);
    } else {
      experienceEndControl?.enable();
      experienceEndControl?.setValue('');
    }
  }

  onPercentageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.isPercentage = input.checked;
    console.log(this.isPercentage);

    this.updateRateValidators();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({
        fileUpload: file
      });
    }
  }


  onSubmit(): void {
    if( this.form.invalid){
      this.form.markAllAsTouched();
    }


    if (this.form.valid) {
      const formValue = this.form.value;
      const noOfFiles = this.filesWithImages.length;
  
      // Ensure the experienceEnd value is set correctly based on isPresent state
      if (this.isPresent) {
        formValue.experienceEnd = new Date().toISOString(); // Set to the current date in UTC
      }
  
      // Convert dates to UTC
      const dobUTC = new Date(formValue.dob).toISOString();
      const experienceStartUTC = new Date(formValue.experienceStart).toISOString();
      const experienceEndUTC = new Date(formValue.experienceEnd).toISOString();
  
      // Calculate the number of states
      // const noOfStates = formValue.state.length; // Assuming `state` is an array
  
      // Map form value to Employee model
      const employee: Employee = {
        id: this.targetEmployee ? this.targetEmployee.id : 0, // Adjust as needed
        name: formValue.name,
        email: formValue.email,
        dob: dobUTC,
        experiencestart: experienceStartUTC,
        experienceend: experienceEndUTC,
        yearsOfExperience: this.form.get('yearsExperience').value, // Include calculated experience
        rate: formValue.rate,
        rateFlag: this.isPercentage,
        gender: formValue.gender,
        clientId: +formValue.client, // Convert to integer
        employeestates: formValue.state.map((stateId: number) => ({
          id: 0, // Set to 0
          stateId: stateId, // Use the stateId from the form
          employeeId: this.targetEmployee ? this.targetEmployee.id : 0 // Set to 0
        })),
        attachments: this.filesWithImages.map(fileWithImage => ({
          id: 0, // Adjust as needed
          name: fileWithImage.name,
          size: fileWithImage.size,
          type: fileWithImage.type,
          employeeId: this.targetEmployee ? this.targetEmployee.id : 0, // Assuming it will be assigned by the backend
          baseCode: fileWithImage.base64 || '' // Add base64 encoding if needed
        })),
        noOfFiles: noOfFiles, // Set the number of files here
        // noOfStates: noOfStates // Pass the number of states
      };
  
      // Check if updating or creating an employee
      if (this.targetEmployee) {
        // Update existing employee
        this.employeeService.updateEmployee(employee).subscribe(
          (response) => {
            Swal.fire(
              'Success!',
              'Employee updated successfully.',
              'success',
            ).then((result) => {
              if (result.isConfirmed) {
                // This will be called when the "OK" button is clicked
                window.location.reload(); 
              }
            });
            this.employeeService.onCreateAndUpdate.emit(true);
            this.onCloseDrawer();
            this.isPercentage = false;
          },
          (error) => {
            Swal.fire(
              'Error!',
              'There was an error updating the employee.',
              'error'
            );
          }
        );
      } else {
        // Create new employee
        this.employeeService.createEmployee(employee).subscribe(
          (response) => {
            Swal.fire({
              title: 'Success!',
              text: 'Employee created successfully.',
              icon: 'success',
            }).then((result) => {
              if (result.isConfirmed) {
                // This will be called when the "OK" button is clicked
                window.location.reload(); 
              }
            });
        
            // Emit event and close drawer
            this.employeeService.onCreateAndUpdate.emit(true);
            this.onCloseDrawer();
            this.isPercentage = false;
          },
          (error) => {
            Swal.fire(
              'Error!',
              'There was an error creating the employee.',
              'error'
            );
          }
        );
      }
    } else {
      console.log('Form is invalid');
    }
  }
  




  browseFiles(): void {
    document.getElementById('file-upload')?.click();
  }

  // onFilesSelected(event: any): void {
  //   const files = event.target.files;
  //   this.selectedFiles = Array.from(files);
  //   this.filesWithImages = []; // Clear existing files with images

  //   this.selectedFiles.forEach((file, index) => {
  //     const fileWithImage: FileWithImage = {
  //       imageUrl: null,
  //       file: file,
  //       size: file.size,
  //       name: `Attachment ${index + 1}`,
  //       base64: null, // Initialize as null
  //       type: file.type, // Set MIME type of the file
  //     };

  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       fileWithImage.imageUrl = reader.result;
  //       fileWithImage.base64 = reader.result ? (reader.result as string).split(',')[1] : null; // Extract Base64 string
  //       this.filesWithImages.push(fileWithImage);
  //     };

  //     reader.readAsDataURL(file);
  //   });
  // }
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files: File[] = Array.from(input.files); // Convert FileList to an array of File
  
      // Add new files to the existing list
      this.selectedFiles = [...this.selectedFiles, ...files];
  
      files.forEach((file, index) => {
        const fileWithImage: FileWithImage = {
          imageUrl: null,
          file: file,
          size: file.size,
          // name: `Attachment ${this.filesWithImages.length + 1}`,
          name: file.name,

          base64: null,
          type: file.type,
        };
  
        const reader = new FileReader();
        reader.onload = () => {
          fileWithImage.imageUrl = reader.result;
          fileWithImage.base64 = reader.result ? (reader.result as string).split(',')[1] : null;
          this.filesWithImages.push(fileWithImage);
        };
  
        reader.readAsDataURL(file);
      });
    }
  }
  
  
  
  removeFile(fileToRemove: FileWithImage): void {
    this.filesWithImages = this.filesWithImages.filter(file => file !== fileToRemove);
  }
  

  getFileUploadControlValue() {
    return this.form.get('fileUpload')?.value;
  }

  onCancel(): void {
    // Handle cancel logic here
  }



  // calculateExperience(): void {
  //   const start = this.form.get('experienceStart')?.value;
  //   const end = this.isPresent ? this.presentDate : this.form.get('experienceEnd')?.value;

  //   if (start && end) {
  //     const startDate = new Date(start);
  //     const endDate = new Date(end);

  //     let years = endDate.getFullYear() - startDate.getFullYear();
  //     let months = endDate.getMonth() - startDate.getMonth();

  //     if (months < 0) {
  //       years--;
  //       months += 12;
  //     }

  //     // Construct experience string
  //     const experience = `${years} years ${months} months`;
  //     this.form.get('yearsExperience')?.setValue(experience, { emitEvent: false });
  //     console.log(this.form.get('yearsExperience').value);


  //   }
  // }

  populateForm(): void {
    if (this.targetEmployee) {
      this.form.patchValue({
        name: this.targetEmployee.name,
        email: this.targetEmployee.email,
        client: this.targetEmployee.clientId,
        state: this.targetEmployee.employeestates.map(state => state.stateId),
        dob: new Date(this.targetEmployee.dob).toISOString().split('T')[0],
        experienceStart: new Date(this.targetEmployee.experiencestart).toISOString().split('T')[0],
        experienceEnd: this.targetEmployee.experienceend ? new Date(this.targetEmployee.experienceend).toISOString().split('T')[0] : '',
        yearsExperience: this.targetEmployee.yearsOfExperience,
        rate: this.targetEmployee.rate,
        gender: this.targetEmployee.gender,
        rateFlag: this.targetEmployee.rateFlag,
      });

          // Set the isPercentage based on rateFlag
    this.isPercentage = this.targetEmployee.rateFlag;

    // Check or uncheck the checkbox based on isPercentage
    const percentageCheckbox = document.getElementById('changeState') as HTMLInputElement;
    if (percentageCheckbox) {
      percentageCheckbox.checked = this.isPercentage;
    }


      this.isPresent = !this.targetEmployee.experienceend;
      this.updateRateValidators();

      // Handle file upload if needed
      this.filesWithImages = this.targetEmployee.attachments.map(attachment => ({
        imageUrl: `data:${attachment.type};base64,${attachment.baseCode}`,
        file: null, // File is not available for direct assignment here
        size: attachment.size,
        name: attachment.name,
        base64: attachment.baseCode,
        type: attachment.type
      }));
    }
  }




  openAttachment(file: FileWithImage): void {
    if (file.base64) {
      const blob = this.base64ToBlob(file.base64, file.type);
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


  percentageValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
  
      // Check if value is a valid number
      if (isNaN(value)) {
        return { invalidPercentage: true };
      }
  
      // Check if the value is within the range 0-100
      if (value < 0 || value > 100) {
        return { invalidPercentage: true };
      }
  
      // Check if the value has more than 2 decimal places
      const decimalPlaces = value.toString().split('.')[1];
      if (decimalPlaces && decimalPlaces.length > 2) {
        return { invalidDecimalPlaces: true };
      }
  
      return null; // If no errors, return null
    };
  }
  

  // hourlyRateValidator(): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const value = control.value;
  //     return value && value <= 0 ? { invalidHourlyRate: true } : null;
  //   };
  // }
  // Validator for hourly rate
hourlyRateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    console.log(value);
    
    // Check if the value is a positive integer (no decimals)
    const isPositiveInteger = Number.isInteger(value) && value > 0;
    return !isPositiveInteger ? { invalidHourlyRate: true } : null;
  };
}

  experienceDateValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const experienceStart = formGroup.get('experienceStart')?.value;
      const experienceEnd = formGroup.get('experienceEnd')?.value;

      if (experienceStart && experienceEnd) {
        const startDate = new Date(experienceStart);
        const endDate = new Date(experienceEnd);

        if (endDate <= startDate) {
          return { invalidDateRange: true };
        }
      }

      return null;
    };
  }

   dobValidator(minAge: number = 18): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const dob = new Date(control.value);
      const today = new Date();
  
      // Calculate the age based on the DOB
      let age = today.getFullYear() - dob.getFullYear();
      const monthDifference = today.getMonth() - dob.getMonth();
  
      // Adjust age if the birthday hasn't occurred yet this year
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
  
      // If the age is less than the minimum required age, return an error
      return age < minAge ? { underage: true } : null;
    };
  }


  calculateExperience() {
    const start = this.form.get('experienceStart')?.value;
    const end = this.form.get('experienceEnd')?.value;
 
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
 
      if (startDate <= endDate) {
        const diffInMs = endDate.getTime() - startDate.getTime();
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        const years = Math.floor(diffInDays / 365.25);
        const months = Math.floor((diffInDays % 365.25) / 30.44);
        const experienceString = `${years} Years ${months} Months`;
 
        this.form.get('yearsExperience')?.setValue(experienceString);
      } else {
        this.form.get('yearsExperience')?.setValue('');
      }
    } else {
      this.form.get('yearsExperience')?.setValue('');
    }
  }

  emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null; // Skip validation if the value is empty

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      const valid = emailPattern.test(value);
      return valid ? null : { invalidEmail: true };
    };
  }

  // Custom name validator
  noSpaceAtStartValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null; // Skip validation if the value is empty

      const startsWithSpace = /^\s/.test(value);
      return startsWithSpace ? { startsWithSpace: true } : null;
    };
  }


   experienceStartDateDobValidator(dobControlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const formGroup = control.parent as FormGroup;
      if (!formGroup) return null;
 
      const dob = new Date(formGroup.get(dobControlName)?.value);
      const experienceStart = new Date(control.value);
 
      if (!formGroup.get(dobControlName)?.value || !control.value) {
        return null; // If one of the dates is missing, don't validate
      }
 
      const yearsDifference = experienceStart.getFullYear() - dob.getFullYear();
      const monthDifference = experienceStart.getMonth() - dob.getMonth();
      const dayDifference = experienceStart.getDate() - dob.getDate();
 
      if (yearsDifference > 16 || (yearsDifference === 16 && monthDifference > 0) || (yearsDifference === 16 && monthDifference === 0 && dayDifference >= 0)) {
        console.log('no');
        return null; // Valid
      } else {
        console.log('yes');
        return { experienceTooSoon: true }; // Invalid
      }
    };
  
}
}