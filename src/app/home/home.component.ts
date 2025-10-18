import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HousingLocationComponent } from "../housing-location/housing-location.component";
import { HousingLocation } from '../housing-location';
import { HousingService } from '../housing.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HousingLocationComponent],
  template: `
    <section>
      <form>
        <input type="text" 
          placeholder="Filter by City" 
          [(ngModel)]="filterText"
          [ngModelOptions]="{standalone: true}"/>
        <button class="primary" type="button" (click)="filterResults()">Search</button>
        <button class="primary" type="button" (click)="clearFilteredResults()">Clear</button>
      </form>
    </section>
    <section class="results">
      <app-hosing-location *ngFor="let housingLocation of filteredHousingLocationList"
        [housingLocation]="housingLocation">
      </app-hosing-location>
    </section>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  housingLocationList: HousingLocation[] = [];
  housingService: HousingService = inject(HousingService);
  filteredHousingLocationList: HousingLocation[] = [];
  filterText: string = '';

  constructor() {
    this.housingService.getAllHousingLocations().then((locations: HousingLocation[])  => {
      this.housingLocationList = locations;
      this.filteredHousingLocationList = locations;
    });
  }

  filterResults() {
    const text = this.filterText.trim().toLowerCase();

    if (!text){
      this.filteredHousingLocationList = this.housingLocationList;
      return;
    } 

    this.filteredHousingLocationList = this.housingLocationList.filter(location =>  
      location.city.toLowerCase().includes(text)
    );
  }

  clearFilteredResults() {
    this.filterText = '';
    this.filteredHousingLocationList = this.housingLocationList;
  }
}
