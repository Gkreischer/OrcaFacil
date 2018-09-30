import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
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
    public ngProgress: NgProgress) { }

  formPeca: FormGroup;
  peca: Peca;

  error;
  load: boolean = false;
  msg: string = null;
  ngOnInit() {
    this.montaForm();
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
  }

  enviaForm() {
    this.load = true;
    this.peca = this.formPeca.value;
    console.log('Formulario enviado: ' + JSON.stringify(this.peca));
    this.ngProgress.start();
    this.crud.criarRegistro(this.peca, '/pecas').subscribe((data) => {
      console.log('Objeto criado: ' + JSON.stringify(data));
      this.ngProgress.done();
      this.msg = 'Peça criada com sucesso.';
      this.load = false;
    }, error => {
      this.error = error;
    });
  }

  fechaAviso() {
    this.error = null;
    this.msg = null;
  }

}
