import { Component, inject, signal, computed, OnInit, HostListener, ElementRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, switchMap, filter } from 'rxjs';
import { environment } from '../../../environments/environments';


@Component({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  selector: 'app-payments-m',
  styleUrls: ['./payments-m.scss'],
  templateUrl: './payments-m.html',
})
export class PaymentsM implements OnInit {
  private http = inject(HttpClient);
  private eRef = inject(ElementRef); // Inyectamos ElementRef para detectar clics
  
  terminoBusqueda = signal('');
  mostrarLista = signal(false);
  
  todosLosEstudiantes = signal<any[]>([]);
  estudianteSeleccionado = signal<any>(null);
  cargos = signal<any[]>([]);

  estudiantesFiltrados = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase();
    if (!termino) return this.todosLosEstudiantes();
    return this.todosLosEstudiantes().filter(est => 
      est.nombre.toLowerCase().includes(termino) || 
      est.apellidos.toLowerCase().includes(termino) ||
      est.cedula.toLowerCase().includes(termino)
    );
  });

  totalDeuda = computed(() => 
    this.cargos().filter(c => c.estado === 'PENDIENTE')
                 .reduce((acc, curr) => acc + Number(curr.monto_esperado), 0)
  );
  
  cuotasPendientes = computed(() => 
    this.cargos().filter(c => c.estado === 'PENDIENTE').length
  );

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/students`).subscribe(res => {
      this.todosLosEstudiantes.set(res);
    });
  }

  // Detecta clics en cualquier parte del documento para cerrar la lista
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const searchBox = this.eRef.nativeElement.querySelector('.search-box');
    // Si el clic no fue dentro del buscador, cierra la lista
    if (searchBox && !searchBox.contains(event.target)) {
      this.mostrarLista.set(false);
    }
  }

  seleccionarEstudiante(estudiante: any) {
    this.estudianteSeleccionado.set(estudiante);
    this.terminoBusqueda.set('');
    this.mostrarLista.set(false);
    this.cargarResumen(estudiante.id);
  }

  cargarResumen(id: number) {
    this.http.get<any[]>(`${environment.apiUrl}/payments/student/${id}/summary`)
      .subscribe(res => {
        this.cargos.set(res);
        // Si el arreglo viene vacío, significa que no debe nada o se borró su historial
        if (res.length === 0) {
          alert('¡Este estudiante está al día! No tiene cuotas pendientes.');
          this.estudianteSeleccionado.set(null); // Oculta la tabla
        }
      });
  }

  procesarPago(cargoId: number) {
    // Llamamos al backend para pagar
    this.http.post(`${environment.apiUrl}/payments/pay`, { cargoId }).subscribe(() => {
      // Recargamos los datos del estudiante actual
      this.cargarResumen(this.estudianteSeleccionado().id);
    });
  }
}
