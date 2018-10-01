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
  peca: Peca;

  error;
  load;
  msg: string = null;
  ngOnInit() {
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
    this.peca = this.formPeca.value;
    console.log('Formulario enviado: ' + JSON.stringify(this.peca));
    this.ngProgress.start();
    this.crud.criarRegistro(this.peca, '/pecas').subscribe((data) => {
      console.log('Objeto criado: ' + JSON.stringify(data));
      this.ngProgress.done();
      this.msg = 'Peça criada com sucesso.';
    }, error => {
      this.error = error;
      this.ngProgress.done();
    });
  }

  fechaAviso() {
    this.error = null;
    this.msg = null;
  }

}
