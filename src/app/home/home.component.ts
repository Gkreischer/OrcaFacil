import { Component, OnInit } from '@angular/core';

import { CrudService } from './../servicos/crud.service';
import { Peca } from './../compartilhados/peca';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public crud: CrudService) { }

  listaPecas: Peca[];
  Peca: Peca;

  erro;
  load;
  msg;

  ngOnInit() {
    this.verificaEstoque();
  }

  verificaEstoque(){
    this.crud.lerRegistro('/pecas').subscribe((data) => {
      this.listaPecas = data;
      console.log('Lista recebindo. Itens devem ser exibidos agora.')
    }, 
    erro => {
      this.erro = erro;
    });
  }

}
