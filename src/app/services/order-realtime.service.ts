import { Injectable, OnDestroy } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// DTOs

export interface OrderDetailSimplifiedDTO {
  productId: number;
  quantity: number;
  name?: string;
  notes?: string;
}

export interface OrderRequestDTO {
  userId: number;
  restaurantId: number;
  tableNumber: number;
  status: string;
  totalAmount: number;
  orderCode: string;
}

export interface OrderResponseDTO {
  id: number;
  userId: number;
  restaurantId: number;
  tableNumber: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
  orderCode: string;
  products: OrderDetailSimplifiedDTO[];
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId?: number;
  restaurantId?: number;
  tax?: number;
  currency?: string;
}

// Interfaces específicas para Supabase

interface SupabaseOrder {
  id: number;
  user_id: number;
  restaurant_id: number;
  table_number: number;
  status: string;
  created_at: string;
  updated_at: string;
  total_amount: number;
  order_code: string;
  order_details: {
    product_id: number;
    quantity: number;
    name?: string;
    notes?: string;
  }[];
}

interface InsertedOrder {
  id: number;
  user_id: number;
  restaurant_id: number;
  table_number: number;
  status: string;
  total_amount: number;
  order_code: string;
}

// Servicio

@Injectable({ providedIn: 'root' })
export class OrderRealtimeService implements OnDestroy {
  private readonly supabase: SupabaseClient;
  private readonly ordersSubject = new BehaviorSubject<OrderResponseDTO[]>([]);
  public orders$: Observable<OrderResponseDTO[]> = this.ordersSubject.asObservable();

  private currentOrders: OrderResponseDTO[] = [];
  private orderChannel: any;
  private isSubscribed = false;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.subscribeToOrderChanges();
    this.fetchInitialOrders();
  }

  private subscribeToOrderChanges(): void {
    if (this.isSubscribed) return;

    this.orderChannel = this.supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, async () => {
        console.log('Change received!');
        await this.fetchInitialOrders();
      })
      .subscribe();

    this.isSubscribed = true;
  }

  ngOnDestroy(): void {
    if (this.orderChannel) {
      this.supabase.removeChannel(this.orderChannel);
    }
    this.ordersSubject.complete();
  }

  async fetchInitialOrders(): Promise<void> {
    const { data, error } = await this.supabase
      .from('orders')
      .select(`
        *,
        order_details (
          product_id,
          quantity
        )
      `);

    if (error) {
      console.error('Error fetching initial orders:', error);
      return;
    }

    const typedData = data as SupabaseOrder[];

    this.currentOrders = (typedData || []).map(order => ({
      id: order.id,
      userId: order.user_id,
      restaurantId: order.restaurant_id,
      tableNumber: order.table_number,
      status: order.status,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      totalAmount: order.total_amount,
      orderCode: order.order_code,
      products: order.order_details.map(detail => ({
        productId: detail.product_id,
        quantity: detail.quantity,
        name: detail.name,
        notes: detail.notes
      }))
    }));

    this.ordersSubject.next([...this.currentOrders]);
  }

  async fetchOrderWithDetails(orderId: number): Promise<OrderResponseDTO | null> {
    const { data, error } = await this.supabase
      .from('orders')
      .select(`
        *,
        order_details (
          product_id,
          quantity,
          name,
          notes
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      console.error(`Error fetching order ${orderId} with details:`, error);
      return null;
    }

    const typedData = data as SupabaseOrder;

    return {
      id: typedData.id,
      userId: typedData.user_id,
      restaurantId: typedData.restaurant_id,
      tableNumber: typedData.table_number,
      status: typedData.status,
      createdAt: typedData.created_at,
      updatedAt: typedData.updated_at,
      totalAmount: typedData.total_amount,
      orderCode: typedData.order_code,
      products: typedData.order_details.map(detail => ({
        productId: detail.product_id,
        quantity: detail.quantity,
        name: detail.name,
        notes: detail.notes
      }))
    };
  }

  async createTestOrder(): Promise<OrderResponseDTO | null> {
    const testProducts: OrderDetailSimplifiedDTO[] = [
      { productId: 1, quantity: 2, name: 'Hamburguesa Clásica', notes: 'Sin cebolla' },
      { productId: 3, quantity: 1, name: 'Patatas Fritas Grandes' }
    ];

    const newOrderData: Partial<InsertedOrder> = {
      user_id: 1,
      restaurant_id: 101,
      table_number: Math.floor(Math.random() * 20) + 1,
      status: 'PENDING',
      total_amount: parseFloat((Math.random() * 50 + 10).toFixed(2)),
      order_code: `ORD-${Date.now()}`
    };

    try {
      const { data: inserted, error: orderError } = await this.supabase
        .from('orders')
        .insert(newOrderData)
        .select()
        .single();

      if (orderError || !inserted) {
        console.error('Error inserting main test order:', orderError);
        return null;
      }

      const orderDetailsRecords = testProducts.map(p => ({
        order_id: inserted.id,
        product_id: p.productId,
        quantity: p.quantity,
        name: p.name,
        notes: p.notes
      }));

      const { error: detailsError } = await this.supabase
        .from('order_details')
        .insert(orderDetailsRecords);

      if (detailsError) {
        console.error('Error inserting order details:', detailsError);
        return null;
      }

      return this.fetchOrderWithDetails(inserted.id);
    } catch (e) {
      console.error('Unexpected error during test order creation:', e);
      return null;
    }
  }
}
