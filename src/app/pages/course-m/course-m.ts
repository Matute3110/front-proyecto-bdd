import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Curso } from '../../@core/interfaces/Curso.model';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-course-m',
  styleUrls: ['./course-m.scss'],
  templateUrl: './course-m.html',
})



export class CourseM implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  // Angular Signals para estado reactivo sin recargar la página
  cursos = signal<any[]>([]);
  loading = signal(false);

  cursoForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    monto_inicial: [null, Validators.required],
    monto_cuota: [null, Validators.required],
    cantidad_cuotas: [null, Validators.required]
  });

  ngOnInit() { this.cargarCursos(); }

  cargarCursos() {
    this.http.get<any[]>(`${environment.apiUrl}/courses`).subscribe(data => {
      // Transformamos los strings de MySQL a números para arreglar el bug matemático
      const parsedData = data.map(c => ({
        ...c,
        monto_inicial: Number(c.monto_inicial),
        monto_cuota: Number(c.monto_cuota),
        cantidad_cuotas: Number(c.cantidad_cuotas)
      }));
      this.cursos.set(parsedData);
    });
  }

  guardarCurso(event: Event) {
    event.preventDefault(); // Evita recarga nativa
    if (this.cursoForm.invalid) return;

    this.loading.set(true);
    this.http.post(`${environment.apiUrl}/courses`, this.cursoForm.value).subscribe({
      next: () => {
        this.cursoForm.reset();
        this.cargarCursos(); // Actualiza el Signal silenciosamente
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
