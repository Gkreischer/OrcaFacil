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

  id: number = 0;
  formPedido: FormGroup;
  pedido: Peca[];
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

    this.pedido = this.formPedido.value;

    this.leCategorias();
    // console.log(this.formPedido.value);

  }

  // Controles de interface
  fechaAviso() {
    this.erro = null;
    this.msg = null;
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
  
  /* Pega id do elemento selecionando no select de Peça */
  pegaId(event) {
    // console.log(event);
    if (event != undefined) {
      this.id = event;
    } else {
      this.id = null;
    }

  }

  adicionaPecaLista() {

    if(this.pedido){
      this.pedido = this.formPedido.value;
      this.listaPecas.push(this.pedido);
      // Continuar daqui....ao gerar os botões, está atualizando a ID, colocando todos os valores iguais.
      this.id += 1;
    } else {
      console.log('Sem peça no formulario de adicionar');
    }
  }

  deletaPeca(event) {
    
    let target = event.target || event.srcElement || event.currentTarget;
    let idAttr = target.attributes.id.value;

    let confirma = window.confirm('Tem certeza que deseja deletar o produto? ');

    if (confirma) {
     console.log(idAttr);
      
      
    } else {
      console.log('Objeto não excluido da lista');
    }




  }

}
