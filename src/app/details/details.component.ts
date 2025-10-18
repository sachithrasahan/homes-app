import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HousingService } from '../housing.service';
import { HousingLocation } from '../housing-location';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <article>
      <img class="listing-photo" [src]="housingLocation?.photo">
      <section class="listing-description">
        <h2 class="listing-heading">{{ housingLocation?.name }}</h2>
        <p class="listing-location">{{ housingLocation?.city }}, {{ housingLocation?.state }}</p>
      </section>
      <section class="listing-features">
        <h2 class="section-heading">About this housing location</h2>
        <ul>
          <li *ngIf="housingLocation?.wifi">WiFi Available</li>
          <li *ngIf="!housingLocation?.wifi">No WiFi Available</li>
          <li *ngIf="housingLocation?.laundry">Laundry Available</li>
          <li *ngIf="!housingLocation?.laundry">No Laundry Available</li>
          <li *ngIf="(housingLocation?.availableUnits ?? 0) > 0">
            {{ housingLocation?.availableUnits }} Units Available
          </li>
          <li *ngIf="housingLocation?.availableUnits === 0">No Units Available</li>
        </ul>
      </section>
      <section class="listing-apply">
        <h2 class="section-heading">Apply now to secure your spot!</h2>
        <form [formGroup]="applyForm" (submit)="onSubmitApplication()">
          <label for="firstName">First Name:</label>
          <input id="firstName" formControlName="firstName" required>

          <label for="lastName">Last Name:</label>
          <input id="lastName" formControlName="lastName" required>

          <label for="email">Email:</label>
          <input id="email" type="email" formControlName="email" required>

          <button class="primary" type="submit">Apply now</button>
        </form>
      </section>
    </article>
  `,
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService: HousingService = inject(HousingService);
  housingLocation: HousingLocation | undefined;
  applyForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
  });

  constructor() {
    const housingLocationId = Number(this.route.snapshot.params['id']);
    this.housingService.getHousingLocationById(housingLocationId).then((location: HousingLocation | undefined) => {
      this.housingLocation = location;
    });
  }

  onSubmitApplication() {
    if (this.applyForm.valid) {
      this.housingService.submitApplication(
        this.applyForm.value.firstName ??'',
        this.applyForm.value.lastName ??'',
        this.applyForm.value.email ??''
      );
    }
  }
}
