import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { CrudService } from './../servicos/crud.service';
import { Peca } from './../compartilhados/peca';

import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-cadastropeca',
  templateUrl: './cadastropeca.component.html',
  styleUrls: ['./cadastropeca.component.scss']
})
export class CadastropecaComponent implements OnInit {

  constructor(public fb: FormBuilder, public crud: CrudService,
    public ngProgress: NgProgress, private route: ActivatedRoute) { }

  id;
  formPeca: FormGroup;
  formCategoria: FormGroup;
  peca: Peca;
  categorias;

  error;
  modal: boolean = false;
  load: boolean = false;
  msg: string = null;
  ngOnInit() {
    this.ngProgress.start();
    this.pegaIdRota();
    this.leCategorias();
    this.montaForm();
  }

  pegaIdRota(){
    this.route.params.subscribe((params) => {
      this.id = params.id;
      if(this.id != undefined){
        this.crud.lerRegistroEspecifico('/pecas', this.id).subscribe((data) => {
          console.log('Id recebido da: ' + params.id);
          this.peca = data;
          console.log(this.peca);
        }, error => this.error = error);
      }
    });
  }

  leCategorias(){
    this.crud.lerRegistro('/categorias').subscribe((categorias) => {
      this.categorias = categorias;
    }, error => {
      this.error = error;
      this.load = false;
      this.ngProgress.done();
    });
  }

  montaForm() {
    this.formPeca = this.fb.group({
      nome: ['', Validators.required],
      categoria: ['', Validators.required],
      fornecedor: ['', Validators.required],
      fabricante: ['', Validators.required],
      quantidade: ['', Validators.required],
      valor: ['', Validators.required]
    });

    this.formCategoria = this.fb.group({
      categoria: ['', Validators.required]
    });
  }

  enviaForm() {
    this.peca = this.formPeca.value;
    console.log('Formulario enviado: ' + JSON.stringify(this.peca));
    this.ngProgress.start();
    this.load = true;
    this.crud.criarRegistro('/pecas', this.peca).subscribe((data) => {
      console.log('Objeto criado: ' + JSON.stringify(data));
      this.load = false;
      this.ngProgress.done();
      this.msg = 'Peça criada com sucesso.';
    }, error => {
      this.error = error;
      this.load = false;
      this.ngProgress.done();
    });
  }

  fechaAviso() {
    this.error = null;
    this.msg = null;
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
      this.error = error;
      this.load = false;
      this.ngProgress.done();
      this.abreModal(false);
    });
  }

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
