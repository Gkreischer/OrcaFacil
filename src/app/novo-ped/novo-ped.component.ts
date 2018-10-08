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
  categorias;
  listaPecas = [];
  contador: number = 0;

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
  

  adicionaPecaLista() {

    this.pedido = this.formPedido.value;

    if(this.pedido != undefined){
      this.contador += 1;
      console.log(this.contador);
      
      this.listaPecas.push(this.pedido);
      let index = this.listaPecas.findIndex(posicao => posicao.nome == 'a4 6300');
      console.log(index);
      // Continuar daqui....ao gerar os botões, está atualizando a ID, colocando todos os valores iguais.
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
