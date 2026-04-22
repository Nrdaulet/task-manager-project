import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';

import { TaskService, Task } from '../task.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList implements OnInit, OnDestroy {
  tasks: Task[] = [];
  loading = true;
  error = '';

  private routerSub!: Subscription;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  ngOnDestroy(): void {}

  loadTasks(): void {
    this.loading = true;
    this.error = '';

    this.taskService.getTasks().subscribe({
      next: (res) => {
        this.tasks = res.full_tasks;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load tasks';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteTask(id: number, event: Event): void {
    event.stopPropagation();

    if (!confirm('Delete this task?')) return;

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to delete task';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }
}
