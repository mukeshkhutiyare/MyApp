import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../service/rest.service';
import Swiper from 'swiper';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  results: any;
  data: any;
  current_location: any = {};
  constructor(private restService: RestService) { }

  ngOnInit() {
    this.getAllProducts()
  }

  images = [
    'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    'https://images.unsplash.com/photo-1488229297570-58520851e868',
  ];

  swiperSlideChanged(e: any) {
    console.log('changed: ', e);
  }
 
  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }
 
  goNext() {
    this.swiper?.slideNext();
  }
 
  goPrev() {
    this.swiper?.slidePrev();
  }

  getAllProducts() {
    const product = this.restService.getProducts();
    const location = JSON.parse(localStorage["curr_location"]);
    this.results = [];

    for (let index = 0; index < product.length; index++) {
      const element = product[index];
      const plocation = element.locations;
      element['distance'] = this.restService.calculateDistance(location.latitude, location.longitude, plocation.latitude, plocation.longitude);
      this.results.push(element)
    }
    // 21.111667, 79.070588
    // 21.113724, 79.103302
    // 21.114204, 79.130768

    // const plocation = this.results.locations;
    // const distance = this.restService.calculateDistance(location.latitude, location.longitude, plocation.latitude, plocation.longitude);
    this.data = this.results;
    console.log(this.results);

  }

  handleInput(event: any) {
    this.data = this.results;
    const query = event.target.value.toLowerCase();
    this.data = this.results.filter((d: any) => d.toLowerCase().indexOf(query) > -1);
  }


}
