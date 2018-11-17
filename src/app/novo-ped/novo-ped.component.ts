import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { CrudService } from './../servicos/crud.service';
import { ImpressaoService } from './../servicos/impressao.service';
import { Peca } from './../compartilhados/peca';
import { Pedido } from './../compartilhados/pedido';
import { pedidoFinalizado } from './../compartilhados/pedidoFinalizado';


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
  
  valorTotalListaPecas: number = 0;

  formCategoria: FormGroup;
  categorias;
  listaPecas: Pedido[] = [];
  pedidoFinalizado: pedidoFinalizado;
  @ViewChild('conteudo') conteudo: ElementRef;
  id: string = null;
  erro;
  modal: boolean = false;
  load: boolean = false;
  msg: string = null;
  
  constructor(public fb: FormBuilder, public crud: CrudService,
    public ngProgress: NgProgress, private route: ActivatedRoute,
    public impressao: ImpressaoService) { }

  ngOnInit() {
    this.pegaIdRota();
    this.montaForm();
    this.leCategorias();
  }

  pegaIdRota(){
    this.exibeLoader();
    this.route.params.subscribe((params) => {
      this.id = params.id;
      this.ocultaLoader();
      if(this.id != undefined){
        this.exibeLoader();
        this.crud.lerRegistroEspecifico('/historicoPedidos', this.id).subscribe((data) => {
          console.log('Id recebido da: ' + params.id);
          this.listaPecas = data.listaPecas;
          for(let i = 0; i < this.listaPecas.length; i++){
            this.valorTotalListaPecas = this.valorTotalListaPecas + this.listaPecas[i].valor;
          }
          this.ocultaLoader();
        }, error => {
          this.erro = error, 
          this.ocultaLoader();
        });
      }else {
        this.montaForm();
      }
    });
  }

  montaForm() {
    
    this.formPedido = this.fb.group({
      nome: ['', Validators.required],
      categoria: ['', Validators.required],
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

    // Verifica se a peça está na listaPecas.
    for (let i = 0; i < this.listaPecas.length; i++) {
      if (this.listaPecas[i] === this.pedido) {
        alert('Objeto já adicionado');
        this.ocultaLoader();
        return false;
      }
    }

    if (this.pedido != undefined) {

      let valorPeca: number = parseFloat(this.pedido.valor);

      this.valorTotalListaPecas = this.valorTotalListaPecas + valorPeca;

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
      this.ocultaLoader();
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
            console.log(this.listaPecas[i].valor);
            this.valorTotalListaPecas = this.valorTotalListaPecas - this.listaPecas[i].valor;
            console.log(this.valorTotalListaPecas);
            setTimeout(() => {
              this.listaPecas.splice(i,1);
            },
            1000);
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

    console.log('Valor total das peças recebidas:', this.valorTotalListaPecas);
    console.log('Peças recebecidas:',this.listaPecas);
    
    this.pedidoFinalizado = {valorTotal: this.valorTotalListaPecas, listaPecas: this.listaPecas};

    console.log('Verificando var pedidoFinalizado:', this.pedidoFinalizado);

    if(this.id != undefined){
      console.log('O pedido será atualizado', this.pedidoFinalizado);
      this.crud.atualizaRegistroEspecifico('/historicoPedidos', this.id, this.pedidoFinalizado).subscribe((data) => {
        if(data){
          this.msg = 'Pedido atualizado com sucesso';
          this.downloadPDF();
        }else{
          this.msg = 'Algo deu errado. Nos desculpe. Tente novamente';
        }
      }, error => {
        this.erro = error;
      });
    }else{
      this.crud.criarRegistro('/historicoPedidos', this.pedidoFinalizado).subscribe((data) => {
        if(data) {
          this.msg = 'Pedido salvo com sucesso. Acompanhe em Pedidos > Histórico';
          this.downloadPDF();
        }else{
          this.msg = 'Desculpe, não foi possível salvar. Tente novamente';
        }
      }, error => {
        this.erro = error;
      });
    }
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
