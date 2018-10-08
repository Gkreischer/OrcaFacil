import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor() { }

  chaveMenu: boolean = false;
  ngOnInit() {
  }

  exibeMenu() {
    if(this.chaveMenu){
      this.chaveMenu = false;
    }else if (!this.chaveMenu){
      this.chaveMenu = true;
    } else {
      return null;
    }

    console.log(this.chaveMenu);
    
  }

}
