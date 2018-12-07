import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-arquivos',
  templateUrl: './upload-arquivos.component.html',
  styleUrls: ['./upload-arquivos.component.scss']
})
export class UploadArquivosComponent implements OnInit {

  constructor() { }

  arquivoParaUpload: File = null;

  ngOnInit() {
  }

  enviaArquivo(arquivo: FileList) {
    console.log('Botao upload clicado');

    this.arquivoParaUpload = arquivo.item(0);

    console.log('Arquivo recebido ', this.arquivoParaUpload);
  }

}
