import { Component, input, output } from '@angular/core';
import { Carousel } from '../../models/carousel.model';

@Component({
  selector: 'app-carousel-card',
  templateUrl: './carousel-card.component.html',
  styleUrls: ['./carousel-card.component.css']
})
export class CarouselCardComponent {
  slide = input.required<Carousel>();
  edit = output<Carousel>();
  toggleActif = output<Carousel>();
  delete = output<Carousel>();
}

