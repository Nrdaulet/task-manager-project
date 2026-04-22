import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { TaskList } from './tasks/tasks/task-list';
import { TaskDetail } from './tasks/task-detail/task-detail';
import { TaskForm } from './tasks/task-form/task-form';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'auth/login', component: Login },
  { path: 'auth/register', component: Register },
  { path: 'tasks', component: TaskList, canActivate: [authGuard] },
  { path: 'tasks/new', component: TaskForm, canActivate: [authGuard] },
  { path: 'tasks/:id', component: TaskDetail, canActivate: [authGuard] },
  { path: 'tasks/:id/edit', component: TaskForm, canActivate: [authGuard] },
];
