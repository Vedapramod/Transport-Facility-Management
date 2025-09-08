import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RideService } from '../../services/ride-service/ride-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-ride',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-ride.html',
  styleUrl: './add-ride.css',
})
export class AddRide implements OnInit {
  rideForm!: FormGroup;
  minTime!: string;
  maxTime!: string;
  invalidTimeMessage = '';

  private fb = inject(FormBuilder);
  private rideService = inject(RideService);
  private router = inject(Router);

  readonly FORM_SESSION_KEY = 'addRideFormData';

  ngOnInit(): void {
    this.minTime = this.formatTime(new Date());
    this.maxTime = '23:59';

    const employeeId = this.rideService.currentEmployeeId();

    const initialValues = this.getInitialFormValues(employeeId);

    this.initializeForm(initialValues);

    this.setupValueChangeSubscriptions();
  }

  private getInitialFormValues(employeeId: string) {
    const savedData = sessionStorage.getItem(this.FORM_SESSION_KEY);
    let formValues: any = {
      employeeId: employeeId,
      vehicleType: '',
      vehicleNo: '',
      vacantSeats: 1,
      time: this.minTime,
      pickupPoint: '',
      destination: '',
    };

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        formValues = { ...formValues, ...parsed };
      } catch (e) {
        console.error('Error parsing saved form data', e);
      }
    }

    return formValues;
  }

  private initializeForm(initialValues: any) {
    this.rideForm = this.fb.group(
      {
        employeeId: [{ value: initialValues.employeeId, disabled: true }, Validators.required],
        vehicleType: [initialValues.vehicleType, Validators.required],
        vehicleNo: [
          initialValues.vehicleNo,
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(10),
            Validators.pattern(/^[A-Z0-9 -]*$/),
          ],
        ],
        vacantSeats: [
          initialValues.vacantSeats,
          [Validators.required, Validators.min(1), Validators.max(7)],
        ],
        time: [
          initialValues.time,
          [Validators.required, this.timeWithinDayValidator(this.minTime, this.maxTime)],
        ],
        pickupPoint: [
          initialValues.pickupPoint,
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(25),
            Validators.pattern(/^[a-zA-Z0-9 ]*$/),
          ],
        ],
        destination: [
          initialValues.destination,
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(25),
            Validators.pattern(/^[a-zA-Z0-9 ]*$/),
          ],
        ],
      },
      { validators: this.differentLocationsValidator() }
    );
  }

  private setupValueChangeSubscriptions() {
    this.rideForm.get('vehicleNo')?.valueChanges.subscribe((value) => {
      if (!value) return;
      const upperValue = value.toUpperCase();
      if (value !== upperValue) {
        this.rideForm.get('vehicleNo')?.setValue(upperValue, { emitEvent: false });
      }
    });

    this.rideForm.get('pickupPoint')?.valueChanges.subscribe((value) => {
      if (!value) return;
      const capitalized = this.capitalizeWords(value);
      if (value !== capitalized) {
        this.rideForm.get('pickupPoint')?.setValue(capitalized, { emitEvent: false });
      }
    });

    this.rideForm.get('destination')?.valueChanges.subscribe((value) => {
      if (!value) return;
      const capitalized = this.capitalizeWords(value);
      if (value !== capitalized) {
        this.rideForm.get('destination')?.setValue(capitalized, { emitEvent: false });
      }
    });

    this.rideForm.get('time')?.valueChanges.subscribe((value) => {
      if (!value) return;
      this.validateTime();
    });

    this.rideForm.valueChanges.subscribe((formValue) => {
      const rawForm = {
        ...formValue,
        employeeId: this.rideService.currentEmployeeId(),
      };
      sessionStorage.setItem(this.FORM_SESSION_KEY, JSON.stringify(rawForm));
    });
  }

  private capitalizeWords(str = ''): string {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  }

  formatTime(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  formatDateTimeLocal(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  timeWithinDayValidator(min: string, max: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const [minHour, minMinute] = min.split(':').map(Number);
      const [maxHour, maxMinute] = max.split(':').map(Number);
      const [selectedHour, selectedMinute] = control.value.split(':').map(Number);

      const selectedTime = new Date();
      selectedTime.setHours(selectedHour, selectedMinute, 0, 0);

      const minDate = new Date();
      minDate.setHours(minHour, minMinute, 0, 0);

      const maxDate = new Date();
      maxDate.setHours(maxHour, maxMinute, 0, 0);

      if (selectedTime < minDate || selectedTime > maxDate) {
        return { invalidTime: true };
      }

      return null;
    };
  }

  validateTime() {
    const timeControl = this.rideForm.get('time');
    if (!timeControl || !timeControl.value) return;

    const [selectedHour, selectedMinute] = timeControl.value.split(':').map(Number);
    const selectedTime = new Date();
    selectedTime.setHours(selectedHour, selectedMinute, 0, 0);

    const now = new Date();
    const minDate = new Date();
    minDate.setHours(now.getHours(), now.getMinutes(), 0, 0);

    const maxDate = new Date();
    maxDate.setHours(23, 59, 0, 0);

    if (selectedTime < minDate || selectedTime > maxDate) {
      timeControl.setValue(this.minTime, { emitEvent: false });
      timeControl.markAsUntouched();
      timeControl.updateValueAndValidity({ emitEvent: false });

      this.invalidTimeMessage = 'Please choose a time between now and the end of today.';
      setTimeout(() => (this.invalidTimeMessage = ''), 3000);
    }
  }

  markAsTouched(controlName: string) {
    const control = this.rideForm.get(controlName);
    if (control && !control.value) {
      control.markAsTouched();
    }
  }

  allowOnlyDigits(event: KeyboardEvent): void {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  onVehicleNoInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let val = input.value.toUpperCase();

    val = val.replace(/[^A-Z0-9 -]/g, '').substring(0, 10);

    if (val !== input.value) {
      input.value = val;
      this.rideForm.get('vehicleNo')?.setValue(val, { emitEvent: false });
    }
  }

  onLocationInput(event: Event, controlName: 'pickupPoint' | 'destination') {
    const input = event.target as HTMLInputElement;
    let val = input.value;

    val = val.replace(/[^a-zA-Z0-9 ,/-]/g, '').substring(0, 25);

    if (val !== input.value) {
      input.value = val;
      this.rideForm.get(controlName)?.setValue(val, { emitEvent: false });
    }
  }

  sanitizeVacantSeats(): void {
    const control = this.rideForm.get('vacantSeats');
    if (!control) return;

    let value = control.value;

    if (typeof value === 'string') {
      value = value.replace(/\D/g, '');
    }

    let numericValue = Number(value);

    if (!numericValue || numericValue === 0) {
      numericValue = 1;
    } else if (numericValue > 7) {
      numericValue = 7;
    }

    if (numericValue !== control.value) {
      control.setValue(numericValue, { emitEvent: false });
    }
  }

  removeConsecutiveSpaces(controlName: string) {
    const control = this.rideForm.get(controlName);
    if (control) {
      const value = control.value;
      const newValue = value.replace(/\s{2,}/g, ' ');
      if (newValue !== value) {
        control.setValue(newValue, { emitEvent: false });
      }
    }
  }

  differentLocationsValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const pickupPoint = group.get('pickupPoint')?.value?.trim().toLowerCase();
      const destination = group.get('destination')?.value?.trim().toLowerCase();

      if (pickupPoint && destination && pickupPoint === destination) {
        return { sameLocations: true };
      }

      return null;
    };
  }

  onSubmit(): void {
    if (this.rideForm.valid) {
      const ride = {
        employeeId: this.rideService.currentEmployeeId(),
        vehicleType: this.rideForm.get('vehicleType')?.value,
        vehicleNo: this.rideForm.get('vehicleNo')?.value,
        vacantSeats: this.rideForm.get('vacantSeats')?.value,
        time: this.rideForm.get('time')?.value,
        pickupPoint: this.rideForm.get('pickupPoint')?.value,
        destination: this.rideForm.get('destination')?.value,
      };

      this.rideService.addRide(ride);
      alert('Ride added successfully!');
      this.rideForm.reset({
        employeeId: this.rideService.currentEmployeeId(),
        vacantSeats: 1,
      });

      sessionStorage.removeItem(this.FORM_SESSION_KEY);
      this.router.navigate(['/home']);
    }
  }

  cancel(): void {
    this.router.navigate(['/home']);
  }
}
