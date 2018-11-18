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
  categorias;
  
  ngOnInit() {
    this.leCategorias();
  }

  leCategorias() {
    this.exibeLoader();
    this.crud.lerRegistro('/categorias').subscribe((data) => {
      this.categorias = data;
      this.ocultaLoader();
    }, error => {
      this.erro = error;
      this.ocultaLoader();
    });
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
