import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { CrudService } from './../servicos/crud.service';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-novo-orcamento',
  templateUrl: './novo-orcamento.component.html',
  styleUrls: ['./novo-orcamento.component.scss']
})
export class NovoOrcamentoComponent implements OnInit {

  constructor(public fb: FormBuilder, public crud: CrudService,
    public ngProgress: NgProgress, private route: ActivatedRoute) { }


  id: string = null;
  erro;
  load: boolean = false;
  msg: string = null;
  categoriaSelecionada: string = undefined;
  menuSelecaoPecas: boolean = false;
  categorias;
  
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

  }

  exibeMenuSelecaoDePecas() {

    this.menuSelecaoPecas = true;

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
