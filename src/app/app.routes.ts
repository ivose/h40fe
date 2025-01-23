import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { AuthGuard } from './guards/auth.guard';
import { PostsItemComponent } from './components/posts/posts-item/posts-item.component';
import { PostsComponent } from './components/posts/posts.component';
import { AdminGuard } from './guards/admin.guard';
import { UsersComponent } from './pages/users/users/users.component';

export const routes: Routes = [
    {
        path: 'admin',
        canActivate: [AuthGuard, AdminGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
            },
            {
                path: 'posts',
                loadComponent: () => import('./pages/admin/posts/admin-posts.component').then(m => m.AdminPostsComponent),
            },
            {
                path: 'comments',
                loadComponent: () => import('./pages/admin/comments/admin-comments.component').then(m => m.AdminCommentsComponent),
            },
            {
                path: 'users',
                loadComponent: () => import('./pages/admin/users/admin-users.component').then(m => m.AdminUsersComponent),
            },
            {
                path: 'reactions',
                loadComponent: () => import('./pages/admin/reactions/admin-reactions.component').then(m => m.AdminReactionsComponent),
            }
        ]
    },
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
        path: 'posts/user/:id',//user-id, posts by particular users
        component: MainComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'users',
        canActivate: [AuthGuard],
        children: [
            {
                path: ':id/posts',
                component: PostsComponent,
                data: { type: 'user-posts' },
            },
            {
                path: '',
                component: UsersComponent,
            },
        ]
    },
    {
        path: 'posts',
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: PostsComponent,
            },
            {
                path: 'new',
                loadComponent: () => import('./components/posts/posts-new/posts-new.component').then(m => m.PostsNewComponent),
            },
            {
                path: ':id',
                component: PostsItemComponent,
                data: { isDetailView: true }
            },
            {
                path: ':id/edit',
                loadComponent: () => import('./components/posts/posts-edit/posts-edit.component').then(m => m.PostsEditComponent),
            }
        ]
    },
    {
        path: 'my-posts',
        component: MainComponent,
        canActivate: [AuthGuard],
        data: { type: 'my-posts' }
    },
    {
        path: 'feed',
        component: MainComponent,
        canActivate: [AuthGuard],
        data: { type: 'feed' }
    },
    {
        path: '',
        component: MainComponent,
        data: { type: 'all' },
        canActivate: [AuthGuard]
    },
];
