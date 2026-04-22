import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../task.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm implements OnInit {
  isEditMode = false;
  taskId: number | null = null;
  loading = false;
  error = '';

  form = {
    title: '',
    description: '',
    status: 'pending' as Task['status'],
    priority: 'medium' as Task['priority'],
    due_date: '',
  };

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.taskId = Number(id);
      this.taskService.getTask(this.taskId).subscribe({
        next: (res) => {
          const t = res.task;
          this.form = {
            title: t.title,
            description: t.description,
            status: t.status,
            priority: t.priority,
            due_date: t.due_date || '',
          };
        },
        error: () => { this.error = 'Failed to load task'; }
      });
    }
  }

  onSubmit(): void {
    if (!this.form.title.trim()) {
      this.error = 'Title is required';
      return;
    }

    this.loading = true;
    this.error = '';

    const payload = {
      ...this.form,
      due_date: this.form.due_date || null,
    };

    const request$: Observable<any> = this.isEditMode && this.taskId
      ? this.taskService.updateTask(this.taskId, payload)
      : this.taskService.createTask(payload);

    request$.subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: () => {
        this.error = 'Failed to save task';
        this.loading = false;
      }
    });
  }
}
