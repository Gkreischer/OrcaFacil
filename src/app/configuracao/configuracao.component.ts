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
  }

  formConfig: FormGroup;
  config; 

  montaForm() {
    this.formConfig = this.fb.group({
      nomeEmpresa: ['', Validators.required],
      telEmpresa: ['', Validators.required],
      enderecoEmp: ['', Validators.required],
      siteEmp: ['', Validators.required]
    });

    this.config = this.formConfig.value;
  }

}
