import { Component, input, output } from '@angular/core';
import { Beneficiaire } from '../../models/beneficiaire.model';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css']
})
export class ItemCardComponent {
  // Modern Angular signals-based inputs/outputs
  item = input.required<Beneficiaire>();
  edit = output<Beneficiaire>();
  toggleActif = output<Beneficiaire>();
  delete = output<Beneficiaire>();
}
