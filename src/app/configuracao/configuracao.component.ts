import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CrudService } from './../servicos/crud.service';

import { config } from './../compartilhados/config';

import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.component.html',
  styleUrls: ['./configuracao.component.scss']
})
export class ConfiguracaoComponent implements OnInit {

  constructor(public fb: FormBuilder, public crud: CrudService,
    public ngProgress: NgProgress) {
    this.montaForm();
  }

  ngOnInit() {

    this.verificaInfoConfig();
  }

  formConfig: FormGroup;
  config;


  erro;
  load: boolean = false;
  msg: boolean = false;
  sucesso;

  verificaInfoConfig() {
    this.exibeLoader();
    this.crud.lerRegistro('/configuracaos').subscribe((data) => {
      if (data.length != 0) {
        console.table(data);
        this.formConfig.patchValue(data[0]);
        this.config = data[0];
        this.ocultaLoader();
        this.msg = true;
      } else {
        console.log('Nenhuma configuração cadastrada ainda');
        this.ocultaLoader();
      }
    }, error => {
      this.erro = error;
      this.ocultaLoader();
    });
  }

  montaForm() {
    this.formConfig = this.fb.group({
      nomeEmp: ['', Validators.required],
      telEmp: ['', Validators.required],
      enderecoEmp: ['', Validators.required],
      siteEmp: ['', Validators.required]
    });

    this.config = this.formConfig.value;
  }

  enviaForm() {
    this.exibeLoader();
    this.config = this.formConfig.value;

    console.log('Cliente enviando:');
    console.log(this.config);

    this.crud.criarRegistro('/configuracaos', this.config).subscribe((data) => {
      this.msg = true;
      console.table(data);
      this.ocultaLoader();
    }, error => {
      this.erro = error;
      console.log('Algo deu errado', error);
      this.ocultaLoader();
    });
  }

  fechaAviso() {
    if (this.msg) {
      this.msg = false;
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
