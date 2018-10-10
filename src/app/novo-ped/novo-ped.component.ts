import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { CrudService } from './../servicos/crud.service';
import { Peca } from './../compartilhados/peca';
import { Pedido } from './../compartilhados/pedido';

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
  pedido: Peca[];
  
  formCategoria: FormGroup;
  categorias;
  listaPecas = [];

  data;
  erro;
  modal: boolean = false;
  load: boolean = false;
  msg: string = null;
  constructor(public fb: FormBuilder, public crud: CrudService,
    public ngProgress: NgProgress, private route: ActivatedRoute) { }

  ngOnInit() {
    this.montaForm();
    this.leCategorias();
  }

  // Formulário
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

    this.leCategorias();
    // console.log(this.formPedido.value);
  }

  // Categorias
  leCategorias(){
    this.crud.lerRegistro('/categorias').subscribe((categorias) => {
      this.categorias = categorias;
    }, error => {
      this.erro = error;
      this.load = false;
      this.ngProgress.done();
    });
  }

  registraCategoria() {
    this.load = true
    this.ngProgress.start();
    this.crud.criarRegistro('/categorias', this.formCategoria.value).subscribe((data) => {
      console.log('Categoria adicionada globalmente');
      this.categorias.push(this.formCategoria.value);      
      this.load = false;
      this.ngProgress.done();
      this.abreModal(false);
    }, error => {
      this.erro = error;
      this.load = false;
      this.ngProgress.done();
      this.abreModal(false);
    });
  }
  
  adicionaPecaLista() {

    this.pedido = this.formPedido.value;

    for(let i = 0; i < this.listaPecas.length; i++){
      if(this.listaPecas[i] === this.pedido){
        alert('Objeto já adicionado');
        return false;
      }
    }

    if(this.pedido != undefined){
      
      this.listaPecas.push(this.pedido);
      console.table(this.listaPecas);
      //let index = this.listaPecas.findIndex(posicao => posicao.nome == 'a4 6300');
      // Continuar daqui....ao gerar os botões, está atualizando a ID, colocando todos os valores iguais.
    } else {
      console.log('Sem peça no formulario de adicionar');
    }
  }

  deletaPeca(event) {

    let target = event.target || event.srcElement || event.currentTarget;

    let confirma = window.confirm('Tem certeza que deseja deletar o produto? ');
    
    if (confirma) {
      console.log('Exclusão confirmada');
      

      
    } else {
      console.log('Objeto não excluido da lista');
    }


  }

  // Controles de interface
  abreModal(op: boolean) {
    if(op){
      this.modal = true;
      console.log('Modal abrindo');
    } else {
      this.modal = false;
      console.log('Modal fechando');
    }
  }

}
