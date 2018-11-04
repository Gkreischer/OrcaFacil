import { Component, OnInit } from '@angular/core';

import { CrudService } from './../servicos/crud.service';
import { Peca } from './../compartilhados/peca';

import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public crud: CrudService, public ngProgress: NgProgress) { }

  listaPecas: Peca[];
  Peca: Peca;

  erro;
  load: boolean = false;
  msg;

  ngOnInit() {
    this.verificaEstoque();
  }

  verificaEstoque(){
    this.exibeLoader();
    this.crud.lerRegistro('/pecas').subscribe((data) => {
      if(data.length === 0){
        this.msg = 'Você não tem peças cadastradas';
        this.listaPecas = null;
      } else {
        this.listaPecas = data;
      }
      console.log('Lista recebindo. Itens devem ser exibidos agora.');

      this.ocultaLoader();
      
    }, 
    erro => {
      this.erro = erro;
      this.ocultaLoader();
    });
  }
  
  deletaPeca(event) {
    let target = event.target || event.srcElement || event.currentTarget;
    let idAttr = target.attributes.id;

    this.exibeLoader();
    let confirma = window.confirm('Tem certeza que deseja deletar o produto? ');

    if(confirma) {
      this.crud.deletaRegistro('/pecas', idAttr.value).subscribe((data) => {
        
        console.log(idAttr.value);
        if(data.value == undefined){
          this.verificaEstoque();
          this.ocultaLoader();
        }
        console.log('Lista atualizada');
      }, erro => {
        this.erro = erro;
        this.ocultaLoader();
      });
    }
    this.ocultaLoader();
  }

  
  exibeLoader() {
    this.ngProgress.start();
    this.load = true;
  }

  ocultaLoader() {
    this.ngProgress.done();
    this.load = false;
  }

}
