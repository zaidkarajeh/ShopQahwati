import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DashbordComponent } from './components/dashbord/dashbord.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CategoryComponent } from './components/category/category.component';
import { ProductsComponent } from './components/products/products.component';
import { AboutComponent } from './components/about/about.component';

const routes: Routes = [

  {path:'',component:DashbordComponent},
  {path:'navbar',component:NavbarComponent},
  {path:'home',component:HomeComponent},
  {path:'category',component:CategoryComponent},
  {path:'Products',component:ProductsComponent},
  {path:'about',component:AboutComponent},

    
 
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
 }
