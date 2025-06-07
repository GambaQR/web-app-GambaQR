import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass } from '@angular/common'; // Directivas de Angular
import { RouterLink } from '@angular/router'; // Para enlaces de navegación
import { interval, Subscription } from 'rxjs'; // Para el temporizador
import { map } from 'rxjs/operators'; // Para el manejo de datos del temporizador

// Interfaz para un ítem de pedido en cocina
interface KitchenOrderItem {
    name: string;
    quantity: number;
    notes?: string;
}

// Interfaz para un pedido de cocina
interface KitchenOrder {
    id: string;
    table: string;
    items: KitchenOrderItem[];
    status: 'new' | 'preparing' | 'ready';
    orderTime: string; // Hora de la que se creó el pedido
    estimatedTime: number; // Tiempo estimado de preparación en minutos
    priority: 'normal' | 'high' | 'urgent';
    // Propiedad adicional para el tiempo restante (se calculará en el TS)
    timeRemaining?: number;
}

@Component({
    selector: 'app-kitchen-display',
    standalone: true,
    imports: [CommonModule, RouterLink, NgIf, NgFor, NgClass], // Asegúrate de importar lo necesario
    templateUrl: './kitchen-display.component.html',
})
export class KitchenDisplayComponent implements OnInit, OnDestroy {
    orders: KitchenOrder[] = [
        {
            id: "ORD-001",
            table: "Mesa 4",
            items: [
                { name: "Hamburguesa Clásica", quantity: 2, notes: "Sin cebolla" },
                { name: "Smoothie de Frutas", quantity: 1 },
            ],
            status: "new",
            orderTime: "14:30", // Formato HH:MM
            estimatedTime: 15, // En minutos
            priority: "normal",
        },
        {
            id: "ORD-002",
            table: "Mesa 7",
            items: [
                { name: "Ensalada Mediterránea", quantity: 1 },
                { name: "Pasta Carbonara", quantity: 1, notes: "Extra queso" },
            ],
            status: "preparing",
            orderTime: "14:25",
            estimatedTime: 12,
            priority: "high",
        },
        {
            id: "ORD-003",
            table: "Mesa 2",
            items: [
                { name: "Hamburguesa Clásica", quantity: 1 },
                { name: "Ensalada Mediterránea", quantity: 1 },
            ],
            status: "ready",
            orderTime: "14:20",
            estimatedTime: 0,
            priority: "normal",
        },
    ];

    private timeUpdateSubscription!: Subscription; // Para desuscribirse del temporizador

    constructor() { }

    ngOnInit(): void {
        // Iniciar el cálculo del tiempo restante cada segundo para pedidos en preparación
        this.timeUpdateSubscription = interval(1000)
            .pipe(
                map(() => {
                    // Actualizar la hora restante para cada pedido en preparación
                    this.orders = this.orders.map(order => {
                        if (order.status === 'preparing') {
                            const [hours, minutes] = order.orderTime.split(':').map(Number);
                            const orderDate = new Date(); // Usar la fecha actual para el cálculo
                            orderDate.setHours(hours, minutes, 0, 0);

                            const now = new Date();
                            const elapsedMinutes = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60));
                            let remaining = order.estimatedTime - elapsedMinutes;

                            if (remaining < 0) remaining = 0; // Evitar tiempos negativos

                            // Opcional: Cambiar a 'ready' automáticamente si el tiempo llega a 0
                            // if (remaining <= 0 && order.status === 'preparing') {
                            //   this.updateOrderStatus(order.id, 'ready');
                            //   return { ...order, timeRemaining: 0, estimatedTime: 0 }; // Asegurarse de que el objeto retorne actualizado para el map
                            // }

                            return { ...order, timeRemaining: remaining };
                        }
                        return order;
                    });
                })
            )
            .subscribe(); // Suscribirse para activar el observable

        // Calcular el tiempo restante inicial para los pedidos existentes
        this.orders = this.orders.map(order => {
            if (order.status === 'preparing') {
                const [hours, minutes] = order.orderTime.split(':').map(Number);
                const orderDate = new Date();
                orderDate.setHours(hours, minutes, 0, 0);

                const now = new Date();
                const elapsedMinutes = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60));
                let remaining = order.estimatedTime - elapsedMinutes;
                if (remaining < 0) remaining = 0;
                return { ...order, timeRemaining: remaining };
            }
            return order;
        });
    }

    ngOnDestroy(): void {
        if (this.timeUpdateSubscription) {
            this.timeUpdateSubscription.unsubscribe();
        }
    }

    updateOrderStatus(orderId: string, newStatus: KitchenOrder['status']): void {
        this.orders = this.orders.map(order => {
            if (order.id === orderId) {
                return {
                    ...order,
                    status: newStatus,
                    // Resetear tiempo estimado si pasa a ready
                    estimatedTime: newStatus === 'ready' ? 0 : order.estimatedTime,
                    timeRemaining: newStatus === 'ready' ? 0 : order.timeRemaining
                };
            }
            return order;
        });
    }

    // Getters para filtrar órdenes
    get newOrders(): KitchenOrder[] {
        return this.orders.filter(order => order.status === 'new');
    }

    get preparingOrders(): KitchenOrder[] {
        return this.orders.filter(order => order.status === 'preparing');
    }

    get readyOrders(): KitchenOrder[] {
        return this.orders.filter(order => order.status === 'ready');
    }

    // Getters para colores y textos (sin cambios, adaptados a métodos)
    getStatusColor(status: KitchenOrder['status']): string {
        switch (status) {
            case 'new':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
            case 'preparing':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
            case 'ready':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    }

    getStatusText(status: KitchenOrder['status']): string {
        switch (status) {
            case 'new':
                return 'Nuevo';
            case 'preparing':
                return 'Preparando';
            case 'ready':
                return 'Listo';
            default:
                return 'Desconocido';
        }
    }

    getPriorityColor(priority: KitchenOrder['priority']): string {
        switch (priority) {
            case 'urgent':
                return 'bg-red-500 text-white';
            case 'high':
                return 'bg-orange-500 text-white';
            case 'normal':
                return 'bg-purple-600 text-white'; // Usamos purple para normal
            default:
                return 'bg-gray-500 text-white';
        }
    }

    getPriorityText(priority: KitchenOrder['priority']): string {
        switch (priority) {
            case 'urgent':
                return 'Urgente';
            case 'high':
                return 'Alta';
            case 'normal':
                return 'Normal';
            default:
                return 'Normal';
        }
    }
}