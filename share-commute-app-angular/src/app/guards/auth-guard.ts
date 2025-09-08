import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RideService } from '../services/ride-service/ride-service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private rideService = inject(RideService);
  private router = inject(Router);

  canActivate(): boolean {
    const employeeId = this.rideService.currentEmployeeId();
    if (employeeId && employeeId.trim().length >= 3) {
      return true;
    } else {
      // Redirect to home if no valid employee ID
      this.router.navigate(['/home']);
      return false;
    }
  }
}
