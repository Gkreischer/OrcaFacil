import { Component, OnInit } from '@angular/core';
import { CrudService } from './../servicos/crud.service';
import { NgProgress } from 'ngx-progressbar';

import { listaPedidos } from './../compartilhados/listaPedidos';

@Component({
  selector: 'app-historico-ped',
  templateUrl: './historico-ped.component.html',
  styleUrls: ['./historico-ped.component.scss']
})
export class HistoricoPedComponent implements OnInit {

  constructor(public crud: CrudService, public ngProgress: NgProgress) {
    this.verificaEstoque();
   }

  ngOnInit() {
  }

  listaPedidos: listaPedidos[];

  msg;
  load: boolean = false;
  erro: boolean = false;

  verificaEstoque() {
    this.exibeLoader();
    this.crud.lerRegistro('/historicoPedidos').subscribe((data) => {
      if(data.length == 0){
        this.msg = 'Faça um novo pedido, em Pedido > Novo e ele aparecerá aqui.';
        this.listaPedidos = null;
        this
      }else{
        this.listaPedidos = data;
      }
      this.ocultaLoader();
    }, error => {
      this.erro = error;
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
      }, error => {
        this.erro = error;
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
