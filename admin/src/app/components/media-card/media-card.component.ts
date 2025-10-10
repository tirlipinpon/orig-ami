import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Media } from '../../models/media.model';

@Component({
  selector: 'app-media-card',
  imports: [DatePipe],
  templateUrl: './media-card.component.html',
  styleUrls: ['./media-card.component.css']
})
export class MediaCardComponent {
  // Modern Angular signals-based inputs/outputs
  media = input.required<Media>();
  edit = output<Media>();
  toggleActif = output<Media>();
  delete = output<Media>();
}

