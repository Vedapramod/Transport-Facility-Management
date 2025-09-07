import { Component, inject, OnInit } from '@angular/core';
import { RideService } from '../../services/ride-service/ride-service';
import { Rides } from '../../interfaces/add-ride';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pick-ride',
  imports: [CommonModule],
  templateUrl: './pick-ride.html',
  styleUrl: './pick-ride.css',
})
export class PickRide implements OnInit {
  employeeId = '';
  availableRides: Rides[] = [];
  selectedRideId: number | null = null; // Or another unique identifier if available
  popupMessage = '';

  private rideService = inject(RideService);

  ngOnInit(): void {
    this.employeeId = this.rideService.currentEmployeeId();
    this.loadAvailableRides();
  }

  loadAvailableRides() {
    // Initially, load all rides (filtering logic can be added later)
    this.availableRides = this.rideService.getAvailableRides(this.employeeId);
  }

  pickRide(ride: Rides) {
    if (this.rideService.hasBookedRide(this.employeeId)) {
      this.popupMessage = 'You have already booked a ride today.';
      return;
    }

    this.rideService.pickRide(this.employeeId, ride);
    this.popupMessage = 'Ride booked successfully!';
    this.loadAvailableRides();
  }
}
