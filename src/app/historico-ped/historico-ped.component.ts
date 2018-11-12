import { Component, OnInit } from '@angular/core';
import { CrudService } from './../servicos/crud.service';
import { NgProgress } from 'ngx-progressbar';
import { listaPedidos } from './../compartilhados/listaPedidos';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-historico-ped',
  templateUrl: './historico-ped.component.html',
  styleUrls: ['./historico-ped.component.scss']
})
export class HistoricoPedComponent implements OnInit {

  constructor(public crud: CrudService, public ngProgress: NgProgress,
      public fb: FormBuilder) {
   }

  ngOnInit() {
    this.montaForm();
    this.verificaPedidos();
  }

  listaPedidos: listaPedidos[];
  formSituacaoPedido: FormGroup
  situacaoPedido;

  msg;
  load: boolean = false;
  erro: boolean = false;


  verificaPedidos() {
    this.exibeLoader();
    this.crud.lerRegistro('/historicoPedidos').subscribe((data) => {
      if(data.length == 0){
        this.msg = 'Faça um novo pedido, em Pedido > Novo e ele aparecerá aqui.';
        this.listaPedidos = null;
      }else{
        console.log(data);
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
      this.crud.deletaRegistro('/historicoPedidos', idAttr.value).subscribe((data) => {
        
        console.log(idAttr.value);
        if(data.value == undefined){
          this.verificaPedidos();
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

  montaForm() {
    this.formSituacaoPedido = this.fb.group({
      situacao: ['', Validators.required]
    });

    this.situacaoPedido = this.formSituacaoPedido.value;
  }

  enviaForm() {
    console.table(this.situacaoPedido);
  }

  exibeValor(event) {

    let target = event.target || event.srcElement || event.currentTarget;
    let idAttr = target.attributes.id.value;
    console.log(idAttr);
  }

}
