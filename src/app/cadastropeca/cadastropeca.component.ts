import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { CrudService } from './../servicos/crud.service';
import { Peca } from './../compartilhados/peca';

import { NgProgress } from 'ngx-progressbar';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

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
  peca: Observable<Peca>;
  categorias;

  error;
  modal: boolean = false;
  load: boolean = false;
  msg: string = null;
  ngOnInit() {
    this.pegaIdRota();
    this.leCategorias();
    this.montaForm();
  }

  pegaIdRota(){
    // Verifica se tem ID na rota para atualização.
    this.route.params.subscribe((params) => {
      this.id = params.id;
      this.ngProgress.start();
      if(this.id != undefined){
        this.ngProgress.start();
        this.crud.lerRegistroEspecifico('/pecas', this.id).subscribe((data) => {
          console.log('Id recebido da: ' + params.id);
          this.formPeca.patchValue(data);
          this.peca = data;
          console.log(data);
          this.ngProgress.done();
        }, error => {this.error = error, 
          this.ngProgress.done();
        });
      }else {
        this.montaForm();
      }
    });
  }
  
  // Formulário
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

    this.peca = this.formPeca.value;
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
  
  // Categorias
  leCategorias(){
    this.crud.lerRegistro('/categorias').subscribe((categorias) => {
      this.categorias = categorias;
    }, error => {
      this.error = error;
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
      this.error = error;
      this.load = false;
      this.ngProgress.done();
      this.abreModal(false);
    });
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
  
  fechaAviso() {
    this.error = null;
    this.msg = null;
  }

}
