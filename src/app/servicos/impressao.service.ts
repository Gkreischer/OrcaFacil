import { Injectable } from '@angular/core';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class ImpressaoService {

  private readonly pdfFonts: any;
  pdfMake: any;

  constructor() {

  }

  criaDocument(documento) {
    let docRecebido = documento;

    let docDefinition = {

      pageSize: 'A4',
      content: [
        { text: 'Sigatec Informática', style: 'nomedaEmpresa' },
        { text: 'Av. Amazonas, 49 - Loja 12', style: 'informacoesEmpresa' },
        { text: 'Telefone: (22) 2764 - 3285', style: 'informacoesEmpresa' },
        { text: 'www.sigatecinformatica.com.br', style: 'informacoesEmpresa', margin: [0, 0, 0, 50] },
        // A categoria deve ter exatamente o mesmo nome das propriedades do objeto. Elas serão as colunas
        { table: this.table(docRecebido, ['nome', 'categoria', 'fornecedor', 'quantidade', 'valor']) }
        
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
          { text: '_______________________________________________', alignment: 'center'},
        ]
      },
    };

    pdfmake.vfs = pdfFonts.pdfMake.vfs;

    return pdfmake.createPdf(docDefinition).open();
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
