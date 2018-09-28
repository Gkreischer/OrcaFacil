import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

export interface Peca {
  nome: string;
  categoria: string;
  fornecedor: string;
  valor: number;
  data: string;
}

@Component({
  selector: 'app-cadastropeca',
  templateUrl: './cadastropeca.component.html',
  styleUrls: ['./cadastropeca.component.scss']
})
export class CadastropecaComponent implements OnInit {

  constructor(public fb: FormBuilder) { }

  formPeca: FormGroup;
  peca;
  ngOnInit() {
    this.montaForm();
  }

  montaForm() {
    this.formPeca = this.fb.group({
      nome: ['', Validators.required],
      categoria: ['', Validators.required],
      fornecedor: ['', Validators.required],
      fabricante: ['', Validators.required],
      valor: ['', Validators.required]
    });
  }

  enviaForm() {
    this.peca = this.formPeca.value;
    console.log('Formulario enviado: ' + JSON.stringify(this.peca));
  }

}
