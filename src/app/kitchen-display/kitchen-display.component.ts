import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { interval, Subscription, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OrderRequestDTO, OrderResponseDTO, OrderService } from '../services/order.service';
import { OrderRealtimeService } from '../services/order-realtime.service';

@Component({
    selector: 'app-kitchen-display',
    standalone: true,
    imports: [CommonModule, RouterLink, NgIf, NgFor, NgClass, DatePipe],
    templateUrl: './kitchen-display.component.html',
})
export class KitchenDisplayComponent implements OnInit, OnDestroy {

    allOrders$: Observable<OrderResponseDTO[]>;
    private readonly subscriptions = new Subscription();

    newOrders: OrderResponseDTO[] = [];
    preparingOrders: OrderResponseDTO[] = [];
    readyOrders: OrderResponseDTO[] = [];

    private timerSubscription!: Subscription;
    private currentServerTime: Date = new Date();
    orderStatuses: string[] = ['PENDING', 'PREPARING', 'COMPLETED', 'CANCELLED'];

    constructor(
        private readonly orderService: OrderService, // Mantén OrderService para 'updateOrder'
        private readonly orderRealtimeService: OrderRealtimeService // ¡NUEVO: Inyección del servicio de tiempo real!
    ) {
        // ¡CORRECCIÓN! Inicializa allOrders$ usando el observable del OrderRealtimeService
        this.allOrders$ = this.orderRealtimeService.orders$.pipe(
            tap((orders) => {
                this.newOrders = orders.filter(order => order.status === 'PENDING');
                this.preparingOrders = orders.filter(order => order.status === 'PREPARING');
                this.readyOrders = orders.filter(order => order.status === 'COMPLETED');
            })
        );
    }

    ngOnInit(): void {
        this.subscriptions.add(this.allOrders$.subscribe({
            next: (orders) => {
                console.log('Órdenes recibidas en tiempo real (KitchenDisplayComponent):', orders);
            },
            error: (error) => console.error('Error en la suscripción a órdenes en tiempo real:', error)
        }));

        this.timerSubscription = interval(60 * 1000)
            .pipe(
                tap(() => this.currentServerTime = new Date())
            )
            .subscribe();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
    }

    calculateTimeRemaining(order: OrderResponseDTO): number | undefined {
        if (order.status === 'PREPARING' && order.createdAt) {
            const createdDate = new Date(order.createdAt);
            const estimatedPreparationTimeMinutes = 15;

            const elapsedMilliseconds = this.currentServerTime.getTime() - createdDate.getTime();
            const elapsedMinutes = Math.floor(elapsedMilliseconds / (1000 * 60));

            const remaining = estimatedPreparationTimeMinutes - elapsedMinutes;
            return remaining;
        }
        return undefined;
    }

    updateOrderStatus(orderId: number, newStatus: string): void {
        const request: OrderRequestDTO = { status: newStatus };

        this.subscriptions.add(
            this.orderService.updateOrder(orderId, request).subscribe({
                next: (response: OrderResponseDTO) => {
                    console.log(`Orden ${orderId} actualizada a estado: ${newStatus}`, response);
                },
                error: (error: any) => {
                    console.error(`Error al actualizar la orden ${orderId}:`, error);
                }
            })
        );
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'PENDING':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
            case 'PREPARING':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
            case 'COMPLETED':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
            case 'CANCELLED':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    }

    // ¡NUEVO! Este método ya está definido y ahora también se usa en el HTML.
    getPriorityColor(priority: string): string {
        switch (priority) {
            case 'urgent':
                return 'bg-red-500 text-white';
            case 'high':
                return 'bg-orange-400 text-white';
            case 'normal':
                return 'bg-blue-300 text-black';
            default:
                return 'bg-gray-300 text-black';
        }
    }

    getPriorityText(priority: string): string {
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