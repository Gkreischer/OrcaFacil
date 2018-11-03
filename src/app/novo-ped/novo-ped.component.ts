import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { CrudService } from './../servicos/crud.service';
import { ImpressaoService } from './../servicos/impressao.service';
import { Peca } from './../compartilhados/peca';
import { Pedido } from './../compartilhados/pedido';



import html2canvas from 'html2canvas';

import { NgProgress } from 'ngx-progressbar';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-novo-ped',
  templateUrl: './novo-ped.component.html',
  styleUrls: ['./novo-ped.component.scss']
})
export class NovoPedComponent implements OnInit {

  formPedido: FormGroup;
  pedido;

  formCategoria: FormGroup;
  categorias;
  listaPecas: Pedido[] = [];
  @ViewChild('conteudo') conteudo: ElementRef;

  data;
  erro;
  modal: boolean = false;
  load: boolean = false;
  msg: string = null;
  constructor(public fb: FormBuilder, public crud: CrudService,
    public ngProgress: NgProgress, private route: ActivatedRoute,
    public impressao: ImpressaoService) { }

  ngOnInit() {
    this.montaForm();
    this.leCategorias();
  }

  montaForm() {

    this.data = new Date().toLocaleDateString('pt-br');
    // console.log(this.data);


    this.formPedido = this.fb.group({
      nome: ['', Validators.required],
      categoria: ['', Validators.required],
      data: [this.data, Validators.required],
      fornecedor: ['', Validators.required],
      quantidade: ['', Validators.required],
      valor: ['', Validators.required]
    });

    this.formCategoria = this.fb.group({
      categoria: ['', Validators.required]
    });

    this.pedido = this.formPedido.value;

    this.leCategorias();
    // console.log(this.formPedido.value);
  }

  // Categorias
  leCategorias() {
    this.ngProgress.start();
    this.crud.lerRegistro('/categorias').subscribe((categorias) => {
      this.categorias = categorias;
      this.ngProgress.done();
    }, error => {
      this.erro = error;
      this.load = false;
      this.ngProgress.done();
    });
  }

  registraCategoria() {
    this.load = true
    this.ngProgress.start();
    this.crud.criarRegistro('/categorias', this.formCategoria.value).subscribe((data) => {
      console.log('Categoria adicionada globalmente');
      this.categorias.push(this.formCategoria.value);
      this.load = false;
      this.ngProgress.done();
      this.abreModal(false);
    }, error => {
      this.erro = error.status;
      this.load = false;
      this.ngProgress.done();
      this.abreModal(false);
    });
  }

  verificaLista() {
    this.ngProgress.start();
    this.crud.lerRegistro('/pecasPed').subscribe((data) => {
      this.listaPecas = data;
      this.ngProgress.done();
    },
      error => {
        this.erro = error;
        this.ngProgress.done()
      });
  }

  adicionaPecaLista() {

    this.ngProgress.start();
    this.pedido = this.formPedido.value;

    // Verifica se a peça está na lista do pedido.
    for (let i = 0; i < this.listaPecas.length; i++) {
      if (this.listaPecas[i] === this.pedido) {
        alert('Objeto já adicionado');
        this.ngProgress.done();
        return false;

      }
    }

    if (this.pedido != undefined) {

      this.crud.criarRegistro('/pecasPed', this.pedido).subscribe((data) => {

        console.table(data);
        this.listaPecas.push(data);
        this.ngProgress.done();
      },
        error => {
          this.erro = error;
          this.ngProgress.done();
        });
      console.table(this.listaPecas);
      //let index = this.listaPecas.findIndex(posicao => posicao.nome == 'a4 6300');
      // Continuar daqui....ao gerar os botões, está atualizando a ID, colocando todos os valores iguais.
    } else {
      console.log('Sem peça no formulario de adicionar');
    }
  }

  deletaPeca(event) {

    let target = event.target || event.srcElement || event.currentTarget;
    let idAttr = target.attributes.id;
    console.log(target);

    this.ngProgress.start();
    let confirma = window.confirm('Tem certeza que deseja deletar o produto? ');

    console.log(confirma);

    if (confirma) {
      this.crud.deletaRegistro('/pecasPed', idAttr.value).subscribe((data) => {

        console.log(idAttr.value);
        // Remove o objeto do array listapecas
        for(let i = 0; i < this.listaPecas.length; i++){
          if(this.listaPecas[i].id === idAttr.value){
            this.listaPecas.splice(i,1);
          }
        }
        this.ngProgress.done();
        console.log('Lista atualizada');
        console.log(this.listaPecas);
      }, erro => {
        this.erro = erro;
        this.load = false;
        this.ngProgress.done();
      });
    }
  }

  downloadPDF() {

    this.ngProgress.start();

    
    // Eu sei que tem que melhorar essa parte, mas farei depois. No momento, me serve.
    let columns = [ 
                    {title: "ID", dataKey: "id"},
                    {title: "Nome", dataKey: "nome"},
                    {title: "Categoria", dataKey: "categoria"},
                    {title: "Fornecedor", dataKey: "fornecedor"}, 
                    {title: "Quantidade", dataKey: "quantidade"},
                    {title: "Valor", dataKey: "valor"} 
                  ];
    let rows = this.listaPecas;
    
    this.impressao.criaDocumentTable(rows);

    this.ngProgress.done();

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

}
