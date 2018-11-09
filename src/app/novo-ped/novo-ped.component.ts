import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { CrudService } from './../servicos/crud.service';
import { ImpressaoService } from './../servicos/impressao.service';
import { Peca } from './../compartilhados/peca';
import { Pedido } from './../compartilhados/pedido';



import html2canvas from 'html2canvas';

import { NgProgress } from 'ngx-progressbar';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-novo-ped',
  templateUrl: './novo-ped.component.html',
  styleUrls: ['./novo-ped.component.scss']
})
export class NovoPedComponent implements OnInit {

  formPedido: FormGroup;
  pedido;

  formCategoria: FormGroup;
  categorias;
  listaPecas: Pedido[] = [];
  @ViewChild('conteudo') conteudo: ElementRef;

  data;
  erro;
  modal: boolean = false;
  load: boolean = false;
  msg: string = null;
  
  constructor(public fb: FormBuilder, public crud: CrudService,
    public ngProgress: NgProgress, private route: ActivatedRoute,
    public impressao: ImpressaoService) { }

  ngOnInit() {
    this.montaForm();
    this.leCategorias();
  }

  montaForm() {

    this.data = new Date().toLocaleDateString('pt-br');
    // console.log(this.data);


    this.formPedido = this.fb.group({
      nome: ['', Validators.required],
      categoria: ['', Validators.required],
      data: [this.data, Validators.required],
      fornecedor: ['', Validators.required],
      quantidade: ['', Validators.required],
      valor: ['', Validators.required]
    });

    this.formCategoria = this.fb.group({
      categoria: ['', Validators.required]
    });

    this.pedido = this.formPedido.value;    
  }

  leCategorias() {
    this.exibeLoader();
    this.crud.lerRegistro('/categorias').subscribe((categorias) => {
      this.categorias = categorias;
      this.ocultaLoader();
    }, error => {
      this.erro = error;
      this.ocultaLoader();
    });
  }

  registraCategoria() {
    this.exibeLoader();
    this.crud.criarRegistro('/categorias', this.formCategoria.value).subscribe((data) => {
      console.log('Categoria adicionada globalmente');
      this.categorias.push(this.formCategoria.value);
      this.ocultaLoader();
      this.abreModal(false);
    }, error => {
      this.erro = error.status;
      this.ocultaLoader();
      this.abreModal(false);
    });
  }

  adicionaPecaLista() {

    this.exibeLoader();
    this.pedido = this.formPedido.value;

    // Verifica se a peça está na lista do pedido.
    for (let i = 0; i < this.listaPecas.length; i++) {
      if (this.listaPecas[i] === this.pedido) {
        alert('Objeto já adicionado');
        this.ocultaLoader();
        return false;

      }
    }

    if (this.pedido != undefined) {

      this.crud.criarRegistro('/pecasPed', this.pedido).subscribe((data) => {
        this.listaPecas.push(data);
        this.ocultaLoader();
      },
        error => {
          this.erro = error;
          this.ocultaLoader();
        });
    } else {
      console.log('Sem peça no formulario de adicionar');
    }
  }

  deletaPeca(event) {

    let target = event.target || event.srcElement || event.currentTarget;
    let idAttr = target.attributes.id;
    console.log(target);

    this.exibeLoader();
    let confirma = window.confirm('Tem certeza que deseja deletar o produto? ');

    if (confirma) {
      this.crud.deletaRegistro('/pecasPed', idAttr.value).subscribe((data) => {

        for(let i = 0; i < this.listaPecas.length; i++){
          if(this.listaPecas[i].id === idAttr.value){
            this.listaPecas.splice(i,1);
          }
        }
        this.ocultaLoader();
      }, erro => {
        this.erro = erro;
        this.ocultaLoader();
      });
    }
  }

  downloadPDF() {

    this.exibeLoader();
    
    this.impressao.criaTabelaDocPDF(this.listaPecas);

    this.ocultaLoader();

  }

  salvaPedido() {

    this.crud.criarRegistro('/historicoPeds', this.listaPecas).subscribe((data) => {
      if(data) {
        this.msg = 'Pedido salvo com sucesso. Acompanhe em Pedidos > Histórico';
      }else{
        this.msg = 'Desculpe, não foi possível salvar. Tente novamente';
      }
    }, error => {
      this.erro = error;
    });
  }

  abreModal(op: boolean) {
    if (op) {
      this.modal = true;
    } else {
      this.modal = false;
    }
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
