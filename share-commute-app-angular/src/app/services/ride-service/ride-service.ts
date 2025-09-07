import { Injectable, signal, WritableSignal } from '@angular/core';
import { Rides } from '../../interfaces/add-ride';

@Injectable({ providedIn: 'root' })
export class RideService {
  readonly rides = signal<Rides[]>([]);
  readonly addedRides = signal<Set<string>>(new Set()); // Using Set to store unique employee IDs (No duplicates allowed)
  readonly bookedRides = signal<Set<string>>(new Set());
  readonly currentEmployeeId = signal<string>('');

  private updateSetSignal(setSignal: WritableSignal<Set<string>>, value: string): void {
    const updated = new Set(setSignal()); // Clone current set
    updated.add(value); // Add new value
    setSignal.set(updated); // Update the signal with new set
  }

  hasAddedRide(employeeId: string): boolean {
    return this.addedRides().has(employeeId);
  }

  hasBookedRide(employeeId: string): boolean {
    return this.bookedRides().has(employeeId);
  }

  addRide(ride: Rides): void {
    this.rides.set([...this.rides(), ride]);
    this.updateSetSignal(this.addedRides, ride.employeeId);
  }

  getAvailableRides(employeeId: string): Rides[] {
    return this.rides().filter((ride) => {
      // Exclude rides added by the current employee or rides that are fully booked
      return ride.employeeId !== employeeId && ride.vacantSeats > 0;
    });
  }

  pickRide(employeeId: string, ride: Rides): void {
    const rides = [...this.rides()];
    const index = rides.findIndex((r) => r === ride);
    if (index === -1) return;

    if (rides[index].vacantSeats > 0) {
      rides[index].vacantSeats -= 1;
      this.rides.set(rides);
      this.updateSetSignal(this.bookedRides, employeeId);
    }
  }
}
