import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  results: any;
  data: any;
  constructor() {}


  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.results = this.data.filter((d: any) => d.toLowerCase().indexOf(query) > -1);
  }
}
