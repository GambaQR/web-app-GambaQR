import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common'; // Importar NgIf para renderizado condicional
import { RouterLink } from '@angular/router'; // Para la navegación

import { interval, Subscription } from 'rxjs'; // Para el temporizador
import { map, startWith } from 'rxjs/operators'; // Para el manejo de datos del temporizador

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIf], // Asegúrate de importar RouterLink y NgIf
  templateUrl: './order-confirmation.component.html',
})
export class OrderConfirmationComponent implements OnInit, OnDestroy {
  orderNumber: string = `ORD-${Math.random().toString(36).slice(2, 11).toUpperCase()}`;
  estimatedTime: number = 18; // Tiempo estimado en minutos
  tableNumber: string = 'Mesa 4'; // Asumiendo que la mesa se puede obtener de algún servicio o localstorage si es persistente.

  currentTime!: Date; // La hora actual que se actualizará
  estimatedDelivery!: Date; // La hora estimada de entrega

  private timerSubscription!: Subscription; // Para manejar la suscripción del temporizador

  constructor() {}

  ngOnInit(): void {
    // Iniciar el temporizador para actualizar la hora actual cada segundo
    this.timerSubscription = interval(1000)
      .pipe(
        startWith(0), // Emite un valor inicial inmediatamente al suscribirse
        map(() => new Date()) // Mapea cada emisión a la fecha y hora actuales
      )
      .subscribe(now => {
        this.currentTime = now;
        // Recalcular la hora estimada de entrega cada vez que la hora actual se actualiza
        this.estimatedDelivery = new Date(this.currentTime.getTime() + this.estimatedTime * 60000);
      });
  }

  ngOnDestroy(): void {
    // Es crucial desuscribirse para evitar fugas de memoria
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  // Puedes añadir lógica para formatear las horas si lo necesitas,
  // aunque toLocaleTimeString() ya es bastante útil.
}