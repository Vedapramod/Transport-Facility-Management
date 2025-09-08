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
  showError = false;

  private router = inject(Router);
  private rideService = inject(RideService);

  onEmployeeIdInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    this.employeeId = input.slice(0, 7);

    if (this.popupMessage && this.isEmployeeIdValid()) {
      this.popupMessage = '';
      this.showError = false;
    }
  }

  allowOnlyAlphanumeric(event: KeyboardEvent): void {
    const pattern = /^[a-zA-Z0-9]$/;
    const inputChar = event.key;

    if (!pattern.test(inputChar)) {
      event.preventDefault(); // Block the character if it's not a letter or number
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text') || '';
    const cleaned = pasteData.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    this.employeeId = (this.employeeId + cleaned).slice(0, 7);
  }

  private isEmployeeIdValid(): boolean {
    const id = this.employeeId.trim();
    return id.length >= 3 && /\d/.test(id);
  }

  private validateEmployeeId(): boolean {
    const id = this.employeeId.trim();

    if (!id) {
      this.popupMessage = 'Please enter Employee ID.';
      this.showError = true;
      return false;
    }

    if (id.length < 4) {
      this.popupMessage = 'Employee ID must be at least 4 characters.';
      this.showError = true;
      return false;
    }

    if (!/\d/.test(id)) {
      this.popupMessage = 'Employee ID must contain at least one number.';
      this.showError = true;
      return false;
    }

    if (!/[A-Z]/.test(id)) {
      this.popupMessage = 'Employee ID must contain at least one letter.';
      this.showError = true;
      return false;
    }

    this.showError = false;
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
