import { Component, OnInit, DoCheck, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { CrudService } from './../servicos/crud.service';
import { NgProgress } from 'ngx-progressbar';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Peca } from './../compartilhados/peca';


@Component({
  selector: 'app-novo-orcamento',
  templateUrl: './novo-orcamento.component.html',
  styleUrls: ['./novo-orcamento.component.scss']
})
export class NovoOrcamentoComponent implements OnInit {

  constructor(public fb: FormBuilder, public crud: CrudService,
    public ngProgress: NgProgress, private route: ActivatedRoute,
    public cd: ChangeDetectorRef) { }

  imagemPadraoPeca: string = "/assets/images/interrogacao.jpg";
  id: string = null;
  erro;
  load: boolean = false;
  msg: string = null;
  categoriaSelecionada: string = undefined;
  menuSelecaoPecas: boolean = false;
  categorias;
  listaPecas: Peca[] = null;
  pecaSelecionada: Peca;
  listaPecasOrcamento: Peca[] = [];

  differ: any
  
  ngOnInit() {
    this.leCategorias();
  }

  leCategorias() {
    this.exibeLoader();
    this.crud.lerRegistro('/categorias').subscribe((data) => {
      this.categorias = data;
      //console.table(this.categorias);
      this.ocultaLoader();
    }, error => {
      this.erro = error;
      this.ocultaLoader();
    });
  }

  verificaCategoriaSelecionada(event) {
    let target = event.target || event.srcElement || event.currentTarget;
    let idAttr = target.attributes.id.value;

    console.log(idAttr);

    this.categoriaSelecionada = idAttr;
    
    this.exibeMenuSelecaoDePecas();

    this.consultaPecasPorCategoria();
  }

  exibeMenuSelecaoDePecas() {
    this.menuSelecaoPecas = true;
  }

  consultaPecasPorCategoria() {
    this.crud.procuraPeca(this.categoriaSelecionada).subscribe((data) => {
      this.listaPecas = data;
      console.table(this.listaPecas);
    }, error => {
      this.erro = error;
    });
  }

  adicionaPecaOrcamento(event) {
    let target = event.target || event.srcElement || event.currentTarget;
    let idAttr = target.attributes.id.value;

    console.log(idAttr);

    this.crud.lerRegistroEspecifico('/pecas', idAttr).subscribe((data) => {
      console.log(this.listaPecasOrcamento);
      this.listaPecasOrcamento.push(data);
    }, error => {
      this.erro = error;
    });
  }

  removePecaListaOrcamento(event) {
    console.log('Removendo peça');

    let target = event.target || event.srcElement || event.currentTarget;
    let idAttr = target.attributes.id.value;

    let confirma = window.confirm('Tem certeza que deseja remover a peça do orçamento?');


    if(confirma){
      
      for(let i = 0; i < this.listaPecas.length ; i++){
        if(this.listaPecas[i].id === idAttr){
          setTimeout(() => {
            this.listaPecasOrcamento.splice(i,1);
            console.log(this.listaPecas);
          });
        }
      }
      
    }
  }

  resetaCategorias() {
    this.categoriaSelecionada = undefined;
  }

  fechaAviso() {
    this.erro = null;
    this.msg = null;
  }

  exibeLoader() {
    this.load = true;
    this.ngProgress.start();
  }

  ocultaLoader() {
    this.load = false;
    this.ngProgress.done();
  }

}
