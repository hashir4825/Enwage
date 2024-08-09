import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define interfaces for your data models
export interface Client {
  id: number;
  name: string;
  // Add other properties as needed
}

export interface State {
  id: number;
  name: string;
  // Add other properties as needed
}

@Injectable({
  providedIn: 'root'
})
export class DropdownDataService {
  private clientsUrl = 'https://localhost:7129/api/Client'; // URL to web API
  private statesUrl = 'https://localhost:7129/api/State'; // URL to web API

  constructor(private http: HttpClient) { }

  // Method to get all clients
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.clientsUrl);
  }

  // Method to get all states
  getAllStates(): Observable<State[]> {
    return this.http.get<State[]>(this.statesUrl);
  }
}
