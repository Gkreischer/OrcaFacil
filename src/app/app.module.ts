import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { NgProgressModule, NgProgressBrowserXhr } from 'ngx-progressbar';
import { BrowserXhr } from '@angular/http';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { CadastropecaComponent } from './cadastropeca/cadastropeca.component';
import { HomeComponent } from './home/home.component';
import { NovoPedComponent } from './novo-ped/novo-ped.component'; 
import { CrudService } from './servicos/crud.service';
import { ImpressaoService } from './servicos/impressao.service';

import { HttpClientModule } from '@angular/common/http';
import { ConfiguracaoComponent } from './configuracao/configuracao.component';
import { HistoricoPedComponent } from './historico-ped/historico-ped.component';
import { NovoOrcamentoComponent } from './novo-orcamento/novo-orcamento.component';
import { UploadArquivosComponent } from './upload-arquivos/upload-arquivos.component';


registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    CadastropecaComponent,
    HomeComponent,
    NovoPedComponent,
    ConfiguracaoComponent,
    HistoricoPedComponent,
    NovoOrcamentoComponent,
    UploadArquivosComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgProgressModule
  ],
  providers: [
  CrudService,
  ImpressaoService,
  {provide: BrowserXhr, useClass: NgProgressBrowserXhr},
  {provide: LOCALE_ID, useValue: 'pt' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
