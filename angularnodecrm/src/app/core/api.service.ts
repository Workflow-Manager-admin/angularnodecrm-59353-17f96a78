import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Customer {
  id?: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Note {
  id?: string;
  customerId: string;
  content: string;
  date: string;
}

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class ApiService {
  /** Fetch all customers (GET) */
  getCustomers(): Observable<Customer[]> {
    return inject(HttpClient).get<Customer[]>('/api/customers');
  }

  /** Add customer (POST) */
  addCustomer(data: Customer): Observable<Customer> {
    return inject(HttpClient).post<Customer>('/api/customers', data);
  }

  /** Delete customer (DELETE) */
  deleteCustomer(id: string): Observable<void> {
    return inject(HttpClient).delete<void>(`/api/customers/${id}`);
  }

  /** Update customer (PUT) */
  updateCustomer(id: string, data: Customer): Observable<Customer> {
    return inject(HttpClient).put<Customer>(`/api/customers/${id}`, data);
  }

  /** Get interaction notes for a customer (GET) */
  getNotes(customerId: string): Observable<Note[]> {
    return inject(HttpClient).get<Note[]>(`/api/customers/${customerId}/notes`);
  }

  /** Add interaction note (POST) */
  addNote(customerId: string, content: string): Observable<Note> {
    return inject(HttpClient).post<Note>(`/api/customers/${customerId}/notes`, { content });
  }
}
