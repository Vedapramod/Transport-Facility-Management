import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RideService } from '../../services/ride-service/ride-service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  employeeId = '';
  popupMessage = '';

  private router = inject(Router);
  private rideService = inject(RideService);

  private validateEmployeeId(): boolean {
    if (!this.employeeId.trim()) {
      this.popupMessage = 'Please enter Employee ID.';
      return false;
    }
    return true;
  }

  goToAddRide(): void {
    if (!this.validateEmployeeId()) return;

    if (this.rideService.hasAddedRide(this.employeeId)) {
      this.popupMessage = 'You have already added a ride today.';
      return;
    }

    this.rideService.currentEmployeeId.set(this.employeeId);

    this.router.navigate(['/add-ride']);
  }

  goToPickRide(): void {
    if (!this.validateEmployeeId()) return;

    if (this.rideService.hasBookedRide(this.employeeId)) {
      this.popupMessage = 'You have already booked a ride today.';
      return;
    }

    this.rideService.currentEmployeeId.set(this.employeeId);

    this.router.navigate(['/pick-ride']);
  }
}
