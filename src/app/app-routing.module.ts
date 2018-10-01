import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes
import { MenuComponent } from './menu/menu.component';
import { CadastropecaComponent } from './cadastropeca/cadastropeca.component';
import { OrcamentoComponent } from './orcamento/orcamento.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'orcamento', component: OrcamentoComponent},
  { path: 'cadastropeca', component: CadastropecaComponent},
  { path: 'cadastropeca/:id', component: CadastropecaComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '**', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
