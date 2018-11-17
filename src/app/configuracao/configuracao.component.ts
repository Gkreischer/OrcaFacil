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
  id;

  erro;
  load: boolean = false;
  msg: string = null;
  sucesso;

  verificaInfoConfig() {
    this.exibeLoader();
    this.crud.lerRegistro('/infoempresas').subscribe((data) => {
      if (data.length != 0) {
        console.table(data);
        this.formConfig.patchValue(data[0]);
        this.config = data[0];
        this.id = data[0].id;
        console.log(this.id);
        this.ocultaLoader();
        this.msg = 'Suas configurações estão salvas.';
      } else {
        this.ocultaLoader();
        this.msg = 'Nenhuma configuração cadastrada ainda';
        
      }
    }, error => {
      this.erro = error;
      this.ocultaLoader();
    });
  }

  montaForm() {
    this.formConfig = this.fb.group({
      nome: ['', Validators.required],
      telefone: ['', Validators.required],
      endereco: ['', Validators.required],
      site: ['', Validators.required],
      email: ['', Validators.required]
    });

    this.config = this.formConfig.value;
  }

  enviaForm() {
    this.exibeLoader();
    this.pegaValoresFormEmpresa();
    if (this.id) {
      this.atualizaValoresSeEmpresaExistir();
    } else {
      this.cadastraNovaInfoEmpresa();
    }

  }

  atualizaValoresSeEmpresaExistir() {
    this.crud.atualizaRegistroEspecifico('/infoempresas', this.id, this.config).subscribe((data) => {
      this.msg = 'Configuração atualizada com sucesso';
      this.ocultaLoader();
    });
  }

  pegaValoresFormEmpresa() {
    this.config = this.formConfig.value;
    console.log('Cliente enviando:');
    console.log(this.config);
  }

  cadastraNovaInfoEmpresa() {
    this.crud.criarRegistro('/infoempresas', this.config).subscribe((data) => {
      this.msg = 'Suas informações foram cadastradas';
      console.table(data);
      this.ocultaLoader();
    }, error => {
      this.erro = error;
      console.log('Algo deu errado', error);
      this.ocultaLoader();
    });
  }

  fechaAviso() {
    if (this.msg || this.sucesso || this.erro) {
      this.msg = null;
      this.sucesso = false;
      this.erro = null;
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
