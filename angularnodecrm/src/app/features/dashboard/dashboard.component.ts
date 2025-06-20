import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, Customer } from '../../core/api.service';

// PUBLIC_INTERFACE
@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="dashboard">
      <div class="header">
        <h2>Customers</h2>
        <button (click)="showAdd()">+ Add Customer</button>
        <button (click)="logout()" class="logout">Logout</button>
      </div>
      <div *ngIf="customers.length === 0">No customers found.</div>
      <ul class="customer-list">
        <li *ngFor="let customer of customers" (click)="openCustomer(customer)">
          <span>{{ customer.name }}</span>
          <span class="email">{{ customer.email }}</span>
        </li>
      </ul>
      <div *ngIf="adding">
        <form class="add-form" (ngSubmit)="saveCustomer()" #f="ngForm">
          <input name="name" [(ngModel)]="newCustomer.name" required placeholder="Full Name" />
          <input name="email" [(ngModel)]="newCustomer.email" required type="email" placeholder="Email" />
          <input name="phone" [(ngModel)]="newCustomer.phone" placeholder="Phone" />
          <button type="submit" [disabled]="f.invalid">Save</button>
          <button type="button" (click)="adding = false">Cancel</button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { max-width: 620px; margin: 2.6rem auto; background: #fff; border-radius:10px; box-shadow: 0 2px 24px #e0eedd; padding: 2.2rem }
    .header { display: flex; justify-content: space-between; align-items: center; }
    .header h2 { margin: 0; color: #19d27b; }
    .header button { margin-left: 14px; background: #19d27b; border: none; color: #fff; padding: 0.5rem 1rem; border-radius: 5px; font-weight: 500;}
    .header button.logout { background: #ff8080; }
    .customer-list { margin: 2rem 0; list-style: none; padding: 0;}
    .customer-list li { display: flex; justify-content:space-between; align-items: center; padding: 0.7rem 1.1rem; border-radius:5px; cursor:pointer; transition: background .18s;}
    .customer-list li:hover { background: #f4faf7; }
    .customer-list .email { color: #454545; font-size: 0.93rem}
    .add-form input { margin:.3rem 0; padding:0.6rem; width:100%;border:1px solid #ddd; border-radius:4px;}
    .add-form button { margin: .65rem .55rem 0 0; padding: .53rem 1.1rem;}
  `]
})
export class DashboardComponent implements OnInit {
  customers: Customer[] = [];
  adding = false;
  newCustomer: Customer = { name: '', email: '', phone: '' };

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.api.getCustomers().subscribe({
      next: (customers) => this.customers = customers,
      error: () => this.customers = []
    });
  }

  openCustomer(customer: Customer) {
    this.router.navigate(['/dashboard/customer', customer.id]);
  }

  showAdd() {
    this.adding = true;
    this.newCustomer = { name: '', email: '', phone: '' };
  }

  saveCustomer() {
    if (!this.newCustomer.name || !this.newCustomer.email) return;
    this.api.addCustomer(this.newCustomer).subscribe({
      next: (created) => {
        this.customers.push(created);
        this.adding = false;
      },
      error: () => {}
    });
  }

  logout() {
    if (typeof globalThis.localStorage !== 'undefined') {
      globalThis.localStorage.clear();
    }
    this.router.navigateByUrl('/login');
  }
}
