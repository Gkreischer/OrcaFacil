import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-arquivos',
  templateUrl: './upload-arquivos.component.html',
  styleUrls: ['./upload-arquivos.component.scss']
})
export class UploadArquivosComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  envioArquivo() {
    console.log('Botao upload clicado');
  }

}
