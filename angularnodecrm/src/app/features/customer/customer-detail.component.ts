import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, Customer, Note } from '../../core/api.service';
import { AlertComponent } from '../../shared/alert.component';

// PUBLIC_INTERFACE
@Component({
  standalone: true,
  selector: 'app-customer-detail',
  imports: [CommonModule, FormsModule, RouterLink, AlertComponent],
  template: `
    <div class="customer-detail" *ngIf="customer">
      <a routerLink="/dashboard" class="back">&larr; All Customers</a>
      <h2>{{ customer.name }}</h2>
      <div><b>Email:</b> {{ customer.email }}</div>
      <div><b>Phone:</b> {{ customer.phone || '-' }}</div>
      <div class="actions">
        <button (click)="editing = true" *ngIf="!editing">Edit</button>
        <button (click)="deleteCustomer()" class="danger">Delete</button>
      </div>
      <form *ngIf="editing" (ngSubmit)="saveEdit()" #f="ngForm" class="edit-form">
        <input name="name" [(ngModel)]="customer.name" required />
        <input name="email" [(ngModel)]="customer.email" required type="email" />
        <input name="phone" [(ngModel)]="customer.phone" />
        <button type="submit" [disabled]="f.invalid">Save</button>
        <button type="button" (click)="editing=false">Cancel</button>
      </form>
      <hr />
      <h3>Interaction Notes</h3>
      <app-alert *ngIf="noteError" [message]="noteError" (dismiss)="noteError=''"></app-alert>
      <ul class="notes-list">
        <li *ngFor="let note of notes">
          <span>{{ note.content }}</span>
          <span class="time">{{ note.date | date:'MMM d, y h:mm a' }}</span>
        </li>
      </ul>
      <form (ngSubmit)="addNote()" #nf="ngForm" class="note-form">
        <textarea name="content" required [(ngModel)]="noteText" placeholder="Add a note..." rows="2"></textarea>
        <button type="submit" [disabled]="!noteText.trim()">Add Note</button>
      </form>
    </div>
  `,
  styles: [`
    .customer-detail { background: #fff; max-width: 540px; margin: 3rem auto; border-radius: 10px; box-shadow:0 0 18px #f0f9f7; padding:2.2rem;}
    .back { color: #19d27b; text-decoration: underline;}
    .customer-detail h2 { margin-bottom:.55rem; color:#19d27b;}
    .actions { margin:1rem 0;}
    .actions button { background: #19d27b; color: #fff; border:none; margin-right:1.3rem; padding:0.5rem 1.1rem; border-radius:5px;}
    .actions .danger { background: #ff8080;}
    .edit-form input { width:100%; margin:.3rem 0; padding:.55rem;}
    .edit-form button { margin:.5rem .6rem .3rem 0;}
    h3 {margin-top:2.5rem;color:#424242;}
    .notes-list { list-style: none; padding: 0; margin: 0 0 2rem 0;}
    .notes-list li { background:#f8fcfb; margin-bottom:.7rem; border-radius:4px; padding:.5rem 1rem; display: flex; justify-content: space-between; align-items: center;}
    .notes-list .time { color:#616161; font-size: 0.89rem; margin-left: 1.5rem;}
    .note-form textarea { width:100%; border:1px solid #dfdfdf; border-radius:4px; resize:vertical; margin-bottom:.3rem; padding:.4rem .6rem;}
    .note-form button { background: #19d27b; color: #fff; border:none; padding:.5rem 1.2rem; border-radius:5px;}
  `]
})
export class CustomerDetailComponent implements OnInit {
  customer: Customer | null = null;
  notes: Note[] = [];
  noteText = '';
  noteError = '';
  editing = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.getCustomers().subscribe(customers => {
      this.customer = customers.find(c => c.id === id) || null;
    });
    this.api.getNotes(id).subscribe({
      next: notes => this.notes = notes,
      error: () => this.notes = []
    });
  }

  saveEdit() {
    if (!this.customer) { return; }
    this.api.updateCustomer(this.customer.id!, this.customer).subscribe({
      next: c => { this.customer = c; this.editing = false; },
      error: () => {}
    });
  }

  deleteCustomer() {
    if (!this.customer) return;
    if (typeof globalThis.confirm === 'function' && !globalThis.confirm('Delete this customer? This cannot be undone.')) return;
    this.api.deleteCustomer(this.customer.id!).subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: () => {}
    });
  }

  addNote() {
    const id = this.customer?.id;
    const content = this.noteText.trim();
    if (!id || !content) return;
    this.api.addNote(id, content).subscribe({
      next: n => {
        this.notes.unshift(n);
        this.noteText = '';
      },
      error: err => {
        this.noteError = err?.error?.message || "Couldn't add note.";
      }
    });
  }
}
