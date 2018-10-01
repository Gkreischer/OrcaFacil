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
    this.load = true;
    this.ngProgress.start();
    this.crud.lerRegistro('/pecas').subscribe((data) => {
      if(data.length === 0){
        this.msg = 'Você não tem peças cadastradas';
        this.listaPecas = null;
      } else {
        this.listaPecas = data;
      }
      console.log('Lista recebindo. Itens devem ser exibidos agora.');

      this.load = false;
      this.ngProgress.done();
      
    }, 
    erro => {
      this.erro = erro;
      this.load = false;
      this.ngProgress.done();
    });
  }
  
  deletaPeca(event) {
    let target = event.target || event.srcElement || event.currentTarget;
    let idAttr = target.attributes.id;

    this.load = true;
    this.ngProgress.start();    
    let confirma = window.confirm('Tem certeza que deseja deletar o produto? ');

    console.log(confirma);

    if(confirma) {
      this.crud.deletaRegistro('/pecas', idAttr.value).subscribe((data) => {
        
        console.log(idAttr.value);
        if(data.value == undefined){
          this.listaPecas = null;
          this.msg = 'Você não tem peças cadastradas';
          this.load = false;
          this.ngProgress.done();
        }
        console.log('Lista atualizada');
      }, erro => {
        this.erro = erro;
        this.load = false;
        this.ngProgress.done();
      });
    }

    this.load = false;
    this.ngProgress.done();
  }

}
