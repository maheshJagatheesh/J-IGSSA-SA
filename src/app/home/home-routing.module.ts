import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: HomePage,
        children: [
            {
                path: 'teams',
                children: [
                    // {
                    //     path: 'teams/0',
                    //     redirectTo: 'entry', pathMatch: 'full'

                    // },
                    {
                        path: ':segment',
                        loadChildren: () => import('../teams/teams.module').then(x => x.TeamsPageModule)

                    },

                    {
                        path: 'club/:clubId',
                        loadChildren: () => import('../teams/each-team-detail/each-team-detail.module').then(x => x.EachTeamDetailPageModule)
                    }

                ]


            },
            {
                path: 'fixtures',
                loadChildren: () => import('../fixtures/fixtures.module').then(x => x.FixturesPageModule)
            },
            {
                path: 'results',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('../results/results.module').then(x => x.ResultsPageModule)
                    },
                    // {
                    //     path: ':resultId',
                    //     loadChildren: '../results/result-by-category/result-by-category.module#ResultByCategoryPageModule'
                    // }
                ],
            },
            {
                path: 'lader',
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        loadChildren: () => import('../laders/laders.module').then(x => x.LadersPageModule)
                    },
                    {
                        path: ':laderId/:clientId',
                        loadChildren: () => import('../lader-point-table/lader-point-table.module').then(x => x.LaderPointTablePageModule)
                    }
                    //     loadChildren: '../lader-point-table/lader-point-table.module#LaderPointTablePageModule'
                    // }
                ]
            },
            {
                path: 'notification',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('../notifications/notifications.module').then(x => x.NotificationsPageModule)

                    },
                    {
                        path: ':newsId',
                        loadChildren: () => import('../notifications/notification-detail/notification-detail.module').then(x => x.NotificationDetailPageModule)
                    }
                ],
            },
            {
                path: 'scoring',
                loadChildren: () => import('../scoring/scoring.module').then(x => x.ScoringPageModule)
            },
            {
                path: '',
                redirectTo: '/home/tabs/news',
                pathMatch: 'full'
            }
        ]

    },

    {
        path: '',
        redirectTo: '/home/tabs/news',
        pathMatch: 'full'
    },
    {
        path: 'tabs',
        children: [
            {
                path: 'more',
                // loadChildren: '../more/more.module#MorePageModule'
                loadChildren: () => import('../more/more.module').then(x => x.MorePageModule)
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class HomeRoutingModule { }
