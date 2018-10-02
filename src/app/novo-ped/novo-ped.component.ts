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

  id;
  formPedido: FormGroup;
  pecas: Observable<Peca>;
  pedido: Observable<Pedido>;
  categorias;

  listaPecas: Peca[] = [];

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
    console.log(this.data);

    this.formPedido = this.fb.group({
      data: [this.data, Validators.required],
      peca: ['', Validators.required]
    });

    this.pedido = this.formPedido.value;
    
    this.verificaEstoque();
    console.log(this.formPedido.value);

  }

  // Controles de interface
  fechaAviso() {
    this.erro = null;
    this.msg = null;
  }

  verificaEstoque(){
    this.load = true;
    this.ngProgress.start();
    this.crud.lerRegistro('/pecas').subscribe((data) => {
      if(data.length === 0){
        this.pecas = null;
      } else {
        this.pecas = data;
        console.log(this.pecas);
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
  /* Pega id do elemento selecionando no select de Peça */
  pegaId(event) {
    console.log(event);
    if(event != undefined){
      this.id = event;
    } else {
      this.id = null;
    }

  }

  /* Recebe a id do objeto selecionado e executa a query, para depois adicionar na lista. */
  adicionaPecaLista() {
    
    this.ngProgress.start();
    this.load = true;
    if(this.id){
      this.crud.lerRegistroEspecifico('/pecas', this.id).subscribe((data) => {
        this.listaPecas.push(data);
        this.ngProgress.done();
        this.load = false;
      }, error => {
        this.erro = error;
      });
    }else {
      console.log('Nao pode adicionar peça sem id');
    }
  }

  deletaPeca(event) {
    let target = event.target || event.srcElement || event.currentTarget;
    let idAttr = target.attributes.id;

    this.load = true;
    this.ngProgress.start();    
    let confirma = window.confirm('Tem certeza que deseja deletar o produto? ');

    if(confirma) {
      console.log(this.listaPecas);
    } else {
      console.log('Objeto não excluido da lista');
    }

    this.load = false;
    this.ngProgress.done();
  }

}
