import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

// Validator for percentage field
export function percentageValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;
      
      if (value === null || value === '') {
        return null; // Allow empty value if not required
      }
  
      const percentage = parseFloat(value);
      
      if (isNaN(percentage) || percentage < 0 || percentage > 100 || !/^(\d{1,2}(\.\d{1,2})?)?$/.test(value)) {
        return { invalidPercentage: true };
      }
      
      return null;
    };
  }

// Validator for hourly rate field
export function hourlyRateValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;
    if (value === null || value === '') {
      return null; // Allow empty value if not required
    }
    const rate = parseFloat(value);
    if (isNaN(rate) || rate < 0) {
      return { invalidHourlyRate: true };
    }
    return null;
  };
}

export function experienceDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const experienceStart = control.get('experienceStart')?.value;
      const experienceEnd = control.get('experienceEnd')?.value;
  
      if (experienceStart && experienceEnd && experienceEnd <= experienceStart) {
        return { invalidExperienceDate: true };
      }
      return null;
    };
  }

  
  
  
  