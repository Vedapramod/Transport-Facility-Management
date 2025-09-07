import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RideService } from '../../services/ride-service/ride-service';

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

  ngOnInit(): void {
    const employeeId = this.rideService.currentEmployeeId();

    // Current date-time in proper format for datetime-local input
    const now = new Date();
    const minTime = this.formatDateTimeLocal(now);

    // End of the day: 23:59 of current day
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 0, 0);
    const maxTime = this.formatDateTimeLocal(endOfDay);

    this.minTime = minTime;
    this.maxTime = maxTime;

    this.rideForm = this.fb.group({
      employeeId: [{ value: employeeId, disabled: true }, Validators.required],
      vehicleType: ['', Validators.required],
      vehicleNo: ['', Validators.required],
      vacantSeats: [1, [Validators.required, Validators.min(1)]],
      time: [minTime, [Validators.required, this.timeWithinDayValidator(minTime, maxTime)]],
      pickupPoint: ['', Validators.required],
      destination: ['', Validators.required],
    });

    // Subscribe to time changes for live validation
    this.rideForm.get('time')?.valueChanges.subscribe((value) => {
      if (!value) return;

      const time = new Date(value);
      const minDate = new Date(this.minTime);
      const maxDate = new Date(this.maxTime);

      if (time < minDate || time > maxDate) {
        // Reset time to minTime without triggering valueChanges again
        this.rideForm.get('time')?.setValue(this.minTime, { emitEvent: false });

        // Show tooltip message
        this.invalidTimeMessage = 'Please choose a time between now and the end of the day.';
        setTimeout(() => (this.invalidTimeMessage = ''), 3000); // Hide after 3 sec
      }
    });
  }

  // Helper to format date for input[type=datetime-local]
  formatDateTimeLocal(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // Custom validator to ensure time is within allowed range
  timeWithinDayValidator(min: string, max: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const time = new Date(control.value);
      const minDate = new Date(min);
      const maxDate = new Date(max);

      if (time < minDate || time > maxDate) {
        return { invalidTime: true };
      }
      return null;
    };
  }

  validateTime() {
    const timeControl = this.rideForm.get('time');
    if (!timeControl || !timeControl.value) return;

    const time = new Date(timeControl.value);
    const minDate = new Date(this.minTime);
    const maxDate = new Date(this.maxTime);

    if (time < minDate || time > maxDate) {
      timeControl.setValue(this.minTime, { emitEvent: false });
      timeControl.markAsUntouched();
      timeControl.updateValueAndValidity({ emitEvent: false });

      this.invalidTimeMessage = 'Please choose a time between now and the end of the day.';
      setTimeout(() => (this.invalidTimeMessage = ''), 3000);
    }
  }

  onSubmit(): void {
    if (this.rideForm.valid) {
      const ride = {
        employeeId: this.rideService.currentEmployeeId(),
        vehicleType: this.rideForm.get('vehicleType')?.value,
        vehicleNo: this.rideForm.get('vehicleNo')?.value,
        vacantSeats: this.rideForm.get('vacantSeats')?.value,
        time: new Date(this.rideForm.get('time')?.value),
        pickupPoint: this.rideForm.get('pickupPoint')?.value,
        destination: this.rideForm.get('destination')?.value,
      };

      this.rideService.addRide(ride);
      alert('Ride added successfully!');
      this.rideForm.reset({
        employeeId: this.rideService.currentEmployeeId(),
        vacantSeats: 1,
      });
    } else {
      alert('Please fill all required fields correctly.');
    }
  }
}
