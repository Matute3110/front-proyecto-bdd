import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {
  private apiUrl = `${environment.apiUrl}/estudiantes`;

  constructor(private http: HttpClient) {}

  getEstudiantes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}