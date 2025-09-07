import { Component, inject, OnInit } from '@angular/core';
import { RideService } from '../../services/ride-service/ride-service';
import { Rides } from '../../interfaces/add-ride';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pick-ride',
  imports: [CommonModule, FormsModule],
  templateUrl: './pick-ride.html',
  styleUrl: './pick-ride.css',
})
export class PickRide implements OnInit {
  employeeId = '';
  availableRides: Rides[] = [];
  filteredRides: Rides[] = [];
  selectedRideId: number | null = null;
  selectedVehicleType = '';

  private rideService = inject(RideService);

  ngOnInit(): void {
    this.employeeId = this.rideService.currentEmployeeId();
    this.loadAvailableRides();
  }

  loadAvailableRides() {
    this.availableRides = this.rideService.getAvailableRides(this.employeeId);
    this.applyFilter(); // Apply filter immediately after loading rides
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

    this.rideService.pickRide(this.employeeId, ride);
    alert('Ride booked successfully!');
    this.loadAvailableRides();
  }
}
