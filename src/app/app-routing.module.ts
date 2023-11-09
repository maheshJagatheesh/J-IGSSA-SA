import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RouteGaurdGuard } from './shared/routing/route-gaurd.guard';

const routes: Routes = [
  { path: '', redirectTo: 'entry', pathMatch: 'full' },
  {
    path: 'entry',
    loadChildren: () =>
      import('./entry/entry.module').then((x) => x.EntryPageModule),
  },
  {
    path: 'landing-page',
    loadChildren: () =>
      import('./landing-page/landing-page.module').then(
        (x) => x.LandingPagePageModule
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((x) => x.HomePageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((x) => x.LoginPageModule),
  },
  {
    path: 'each-team-detail',
    loadChildren: () =>
      import('./each-team-detail/each-team-detail.module').then(
        (x) => x.EachTeamDetailPageModule
      ),
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./reset-password/reset-password.module').then(
        (x) => x.ResetPasswordPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
