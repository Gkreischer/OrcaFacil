import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { CrudService } from './../servicos/crud.service';
import { Peca } from './../compartilhados/peca';
import { NgProgress } from 'ngx-progressbar';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { UploadArquivosComponent } from './../upload-arquivos/upload-arquivos.component';

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
  arquivoUpload: File = null;

  erro;
  modal: boolean = false;
  load: boolean = false;
  msg: string = null;

  ngOnInit() {
    this.pegaIdRota();
    this.leCategorias();
    this.montaForm();
  }

  pegaIdRota() {
    this.exibeLoader();
    this.route.params.subscribe((params) => {
      this.id = params.id;
      this.ocultaLoader();
      if (this.id != undefined) {
        this.exibeLoader();
        this.crud.lerRegistroEspecifico('/pecas', this.id).subscribe((data) => {
          console.log('Id recebido da: ' + params.id);
          this.formPeca.patchValue(data);
          this.peca = data;
          console.log(data);
          this.ocultaLoader();
        }, error => {
          this.erro = error,
            this.ocultaLoader();
        });
      } else {
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
      imagem: '',
      valor: ['', Validators.required]
    });

    this.formCategoria = this.fb.group({
      categoria: ['', Validators.required]
    });

    this.peca = this.formPeca.value;
  }

  enviaForm() {
    this.exibeLoader();

    this.peca = this.formPeca.value;
    console.table(this.peca);
    if (this.id != undefined) {
      this.crud.atualizaRegistroEspecifico('/pecas', this.id, this.peca).subscribe((data) => {
        this.ocultaLoader();
        this.msg = 'Peça atualizada com sucesso';
      }, error => {
        this.erro = error;
        this.ocultaLoader();
      });
    } else {
      this.crud.criarRegistro('/pecas', this.peca).subscribe((data) => {
        this.ocultaLoader();
        this.msg = 'Peça criada com sucesso.';
      }, error => {
        this.erro = error;
        this.ocultaLoader();
      });
    }
  }

  leCategorias() {
    this.exibeLoader();
    this.crud.lerRegistro('/categorias').subscribe((categorias) => {
      this.categorias = categorias;
      this.ocultaLoader();
    }, error => {
      this.erro = error;
      this.ocultaLoader();
    });
  }

  registraCategoria() {
    this.exibeLoader();
    this.crud.criarRegistro('/categorias', this.formCategoria.value).subscribe((data) => {
      console.log('Categoria adicionada globalmente');
      this.categorias.push(this.formCategoria.value);
      this.ocultaLoader();
      this.abreModal(false);
    }, error => {
      this.erro = error;
      this.ocultaLoader();
      this.abreModal(false);
    });
  }

  upload(){

    const fd = new FormData();
    fd.append('image', this.arquivoUpload, this.arquivoUpload.name);

    this.crud.criarRegistro('/containers/images/upload', fd).subscribe((data) => {
      console.log('Arquivo enviado com sucesso', data);
    }, error => {
      this.erro = error;
    });
  }

  arquivoSelecionado(event) {
    this.arquivoUpload = <File>event.target.files[0];

    console.log('Arquivo recebido', this.arquivoUpload);
  }

  // Controles de interface
  abreModal(op: boolean) {
    if (op) {
      this.modal = true;
      console.log('Modal abrindo');
    } else {
      this.modal = false;
      console.log('Modal fechando');
    }
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
