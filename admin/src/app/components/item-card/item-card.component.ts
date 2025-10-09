import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Beneficiaire } from '../../models/beneficiaire.model';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css']
})
export class ItemCardComponent {
  @Input() item!: Beneficiaire;
  @Output() edit = new EventEmitter<Beneficiaire>();
  @Output() toggleActif = new EventEmitter<Beneficiaire>();
  @Output() delete = new EventEmitter<Beneficiaire>();
}
