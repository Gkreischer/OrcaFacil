import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes
import { MenuComponent } from './menu/menu.component';
import { CadastropecaComponent } from './cadastropeca/cadastropeca.component';
import { OrcamentoComponent } from './orcamento/orcamento.component';
import { HomeComponent } from './home/home.component';
import { NovoPedComponent } from './novo-ped/novo-ped.component'; 
import { ConfiguracaoComponent } from './configuracao/configuracao.component';

import { HistoricoPedComponent } from './historico-ped/historico-ped.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'orcamento', component: OrcamentoComponent},
  { path: 'cadastropeca', component: CadastropecaComponent},
  { path: 'cadastropeca/:id', component: CadastropecaComponent},
  { path: 'novoPed', component: NovoPedComponent},
  { path: 'novoPed/:id', component: NovoPedComponent},
  { path: 'historicoPed', component: HistoricoPedComponent},
  { path: 'configuracao', component: ConfiguracaoComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '**', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
