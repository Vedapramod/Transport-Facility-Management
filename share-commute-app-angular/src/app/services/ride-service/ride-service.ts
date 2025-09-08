import { Injectable, signal, WritableSignal } from '@angular/core';
import { Rides } from '../../interfaces/add-ride';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RideService {
  readonly rides = signal<Rides[]>([]);
  readonly addedRides = signal<Set<string>>(new Set()); // Using Set to store unique employee IDs (No duplicates allowed)
  readonly bookedRides = signal<Set<string>>(new Set());
  readonly currentEmployeeId = signal<string>('');
  readonly SESSION_RIDES_KEY = 'sessionRides';

  constructor(private http: HttpClient) {
    this.loadInitialRides();
  }

  private loadInitialRides(): void {
    const cached = sessionStorage.getItem(this.SESSION_RIDES_KEY);
    if (cached) {
      const cachedRides = JSON.parse(cached);
      this.rides.set(cachedRides);
    } else {
      this.http
        .get<Rides[]>('/dummy-rides.json')
        .pipe(
          tap((ridesData) => {
            this.rides.set(ridesData);
            sessionStorage.setItem(this.SESSION_RIDES_KEY, JSON.stringify(ridesData));
          })
        )
        .subscribe();
    }
  }

  private updateSetSignal(setSignal: WritableSignal<Set<string>>, value: string): void {
    const updated = new Set(setSignal()); // Clone current set
    updated.add(value); // Add new value
    setSignal.set(updated); // Update the signal with new set
  }

  private saveRidesToSession(): void {
    sessionStorage.setItem(this.SESSION_RIDES_KEY, JSON.stringify(this.rides()));
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
    this.saveRidesToSession();
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
