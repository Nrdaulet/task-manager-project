import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task, Comment } from '../task.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetail implements OnInit {
  task: Task | null = null;
  comments: Comment[] = [];
  newCommentText = '';
  loading = true;
  error = '';
  taskId!: number;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    this.taskService.getTask(this.taskId).subscribe({
      next: (res) => {
        this.task = res.task;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Task not found';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
    this.loadComments();
  }

  loadComments(): void {
    this.taskService.getComments(this.taskId).subscribe({
      next: (res) => {
        this.comments = res.comments;
        this.cdr.detectChanges();
      }
    });
  }

  addComment(): void {
    if (!this.newCommentText.trim()) return;
    this.taskService.addComment(this.taskId, this.newCommentText).subscribe({
      next: (res) => {
        this.comments.push(res.comment);
        this.newCommentText = '';
        this.cdr.detectChanges();
      },
      error: () => { this.error = 'Failed to add comment'; }
    });
  }

  deleteComment(commentId: number): void {
    this.taskService.deleteComment(this.taskId, commentId).subscribe({
      next: () => {
        this.comments = this.comments.filter(c => c.id !== commentId);
        this.cdr.detectChanges();
      },
      error: () => { this.error = 'Failed to delete comment'; }
    });
  }

  deleteTask(): void {
    if (!this.task || !confirm('Delete this task?')) return;
    this.taskService.deleteTask(this.task.id).subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: () => { this.error = 'Failed to delete task'; }
    });
  }

  getPriorityClass(priority: string): string { return `priority-${priority}`; }
  getStatusClass(status: string): string { return `status-${status}`; }
}
