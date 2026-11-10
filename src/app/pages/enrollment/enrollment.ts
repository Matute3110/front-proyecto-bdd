import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-enrollment',
  styleUrls: ['./enrollment.scss'],
  templateUrl: './enrollment.html',
})
export class EnrollmentComponent implements OnInit {
  private http = inject(HttpClient);

  estudiantes = signal<any[]>([]);
  cursos = signal<any[]>([]);
  selectedStudentId: number | null = null;
  selectedCourseId: number | null = null;
  mensaje = signal('');

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/students`).subscribe(res => this.estudiantes.set(res));
    this.http.get<any[]>(`${environment.apiUrl}/courses`).subscribe(res => this.cursos.set(res));
  }

  inscribir() {
    if (!this.selectedStudentId || !this.selectedCourseId) return;
    const payload = { estudianteId: this.selectedStudentId, cursoId: this.selectedCourseId };

    this.http.post(`${environment.apiUrl}/finance/enroll`, payload).subscribe(() => {
      this.mensaje.set('Inscripción exitosa. Cargos financieros generados.');
    });
  }
}
