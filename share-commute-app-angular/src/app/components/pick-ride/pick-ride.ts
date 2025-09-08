import { Component, inject, OnInit } from '@angular/core';
import { RideService } from '../../services/ride-service/ride-service';
import { Rides } from '../../interfaces/add-ride';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TimeFormatPipe } from '../../pipes/time-format-pipe';

@Component({
  selector: 'app-pick-ride',
  imports: [CommonModule, FormsModule, TimeFormatPipe],
  templateUrl: './pick-ride.html',
  styleUrl: './pick-ride.css',
})
export class PickRide implements OnInit {
  employeeId = '';
  availableRides: Rides[] = [];
  filteredRides: Rides[] = [];
  selectedRideId: number | null = null;
  selectedVehicleType = '';
  selectedRide: Rides | null = null;

  private rideService = inject(RideService);
  private router = inject(Router);

  ngOnInit(): void {
    this.employeeId = this.rideService.currentEmployeeId();
    this.loadAvailableRides();
  }

  loadAvailableRides() {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // now + 1 hour

    const pad = (n: number) => n.toString().padStart(2, '0');

    this.availableRides = this.rideService.getAvailableRides(this.employeeId).filter((ride) => {
      if (typeof ride.time !== 'string') return false;

      // Parse ride.time "HH:MM" to a Date today at that time
      const [hours, minutes] = ride.time.split(':').map(Number);
      const rideTime = new Date(now);
      rideTime.setHours(hours, minutes, 0, 0);

      // Return true if rideTime is between now and oneHourLater
      return rideTime >= now && rideTime <= oneHourLater;
    });

    this.applyFilter();
  }

  applyFilter() {
    if (this.selectedVehicleType) {
      this.filteredRides = this.availableRides.filter(
        (ride) => ride.vehicleType === this.selectedVehicleType
      );
    } else {
      this.filteredRides = [...this.availableRides];
    }
  }

  pickRide(ride: Rides) {
    if (this.rideService.hasBookedRide(this.employeeId)) {
      alert('You have already booked a ride today.');
      return;
    }

    this.selectedRide = ride;
  }

  confirmBooking() {
    this.rideService.pickRide(this.employeeId, this.selectedRide!);
    alert('Ride booked successfully!');
    this.router.navigate(['/home']);
  }

  cancelBooking() {
    this.router.navigate(['/home']);
  }
}
