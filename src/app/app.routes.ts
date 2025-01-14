import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { AuthGuard } from './guards/auth.guard';
import { PostsItemComponent } from './components/posts/posts-item/posts-item.component';
import { PostsComponent } from './components/posts/posts.component';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'signup',
        loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent)
    },
    { path: 'reset-password', loadComponent: () => import('./pages/resetpassword/resetpassword.component').then(m => m.ResetpasswordComponent) },
    {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'change-password',
        loadComponent: () => import('./pages/changepassword/changepassword.component').then(m => m.ChangepasswordComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'my-posts',
        component: MainComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'posts/user/:id',//user-id, posts by particular users
        component: MainComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'feed',
        component: MainComponent
    },
    {
        path: '',
        component: MainComponent
    },
    {
        path: 'posts',
        children: [
            {
                path: '',
                component: PostsComponent,
            },
            {
                path: 'new',
                loadComponent: () => import('./components/posts/posts-new/posts-new.component').then(m => m.PostsNewComponent),
                canActivate: [AuthGuard]
            },
            {
                path: ':id',
                component: PostsItemComponent,
                data: { isDetailView: true }
            },
            {
                path: ':id/edit',
                loadComponent: () => import('./components/posts/posts-edit/posts-edit.component').then(m => m.PostsEditComponent),
                canActivate: [AuthGuard]
            }
        ]
    },
    {
        path: 'my-posts',
        component: PostsComponent,
        canActivate: [AuthGuard],
        data: { type: 'my-posts' }
    },
    {
        path: 'feed',
        component: PostsComponent,
        canActivate: [AuthGuard],
        data: { type: 'feed' }
    },
    {
        path: 'users/:id/posts',
        component: PostsComponent,
        data: { type: 'user-posts' }
    },
    {
        path: '',
        component: PostsComponent,
        data: { type: 'all' }
    }
];
