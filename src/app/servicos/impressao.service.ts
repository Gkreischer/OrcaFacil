import { Injectable } from '@angular/core';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { InfoEmpresa } from './../compartilhados/infoEmpresa';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ImpressaoService {

  private readonly pdfFonts: any;
  pdfMake: any;

  API_URL: string = 'http://localhost:3000/api';
  dadosEmpresa;

  constructor(private http: HttpClient) {
    this.atribuiInfoEmpresaDocPDF();
  }

  atribuiInfoEmpresaDocPDF() {
    this.retornaInfEmpresa().subscribe((data) => {
      this.dadosEmpresa = data[0];
      if (this.dadosEmpresa == undefined) {
        alert('Cadastre suas informações primeiro em Configurações');
      }
      console.log(this.dadosEmpresa);
    })
  }

  retornaInfEmpresa(): Observable<InfoEmpresa> {
    return this.http.get(this.API_URL + '/infoempresas').pipe(
      catchError(this.handleError)
    );
  }

  criaTabelaDocPDF(informacoes) {
    let infoTabela = informacoes;

    let dadosDocumento = {

      pageSize: 'A4',
      content: [
        { text: this.dadosEmpresa.nome, style: 'nomedaEmpresa' },
        { text: this.dadosEmpresa.telefone, style: 'informacoesEmpresa' },
        { text: this.dadosEmpresa.endereco, style: 'informacoesEmpresa' },
        { text: this.dadosEmpresa.site, style: 'informacoesEmpresa', margin: [0, 0, 0, 50] },
        // A categoria deve ter exatamente o mesmo nome das propriedades do objeto. Elas serão as colunas
        { table: this.table(infoTabela, ['nome', 'categoria', 'fornecedor', 'quantidade', 'valor']) }

      ],
      styles: {
        nomedaEmpresa: {
          fontSize: 22,
          bold: true
        },
        informacoesEmpresa: {
          fontSize: 14,
        }
      },
      footer: {
        columns: [
          { text: '_______________________________________________', alignment: 'center' },
        ]
      },
    };

    pdfmake.vfs = pdfFonts.pdfMake.vfs;

    return pdfmake.createPdf(dadosDocumento).open();
  }


  buildTableBody(data, columns) {
    var body = [];

    body.push(columns);

    data.forEach(function (row) {
      var dataRow = [];

      columns.forEach(function (column) {
        dataRow.push(row[column].toString());
      })

      body.push(dataRow);
    });

    return body;
  }

  table(data, columns) {
    return {
      headerRows: 1,
      // Para cada coluna, um tamanho
      widths: ['*', '*', '*', '*', '*'],
      body: this.buildTableBody(data, columns)
    };
  }


  // Tratamento de erro
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('Um erro ocorreu', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend retornou a msg ${error.status}, ` +
        `body era: ${JSON.stringify(error.error)}`);
    }
    // return an observable with a user-facing error message
    return ErrorObservable.create(`${JSON.stringify(error.message)}`);
  };

}
