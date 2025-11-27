// ========================
// CartService
// Manages shopping cart: add, remove, increase/decrease quantity, calculate total, and sync with localStorage
// ========================
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Cart item interface
export interface CartItem {
  id: string;       // Unique product ID
  title: string;    // Product title
  price: number;    // Product price
  img: string;      // Product image URL
  qty: number;      // Quantity of this item in cart
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  storageKey = 'my_cart'; // LocalStorage key for saving cart

  // Observable to track total number of items in the cart
  private totalItemsSubject = new BehaviorSubject<number>(0);
  totalItems$ = this.totalItemsSubject.asObservable();

  constructor() {
    this.updateTotalItems(); // Update total item count on service init
  }

  // ========================
  // GET CART
  // Retrieves cart items from localStorage
  // ========================
  getCart(): CartItem[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  // ========================
  // SAVE CART
  // Saves cart to localStorage and updates total items
  // ========================
  saveCart(cart: CartItem[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
    this.updateTotalItems();
  }

  // ========================
  // ADD TO CART
  // Adds product to cart or increases quantity if it already exists
  // ========================
  addToCart(product: Omit<CartItem, 'qty'>) {
    const cart = this.getCart();
    const existing = cart.find(i => i.id === product.id);

    if (existing) existing.qty++;
    else cart.push({ ...product, qty: 1 });

    this.saveCart(cart);
  }

  // ========================
  // INCREASE QUANTITY
  // Increases quantity of a specific item
  // ========================
  increaseQty(id: string) {
    const cart = this.getCart();
    const item = cart.find(i => i.id === id);
    if (item) item.qty++;
    this.saveCart(cart);
  }

  // ========================
  // DECREASE QUANTITY
  // Decreases quantity, or removes item if qty reaches 0
  // ========================
  decreaseQty(id: string) {
    let cart = this.getCart();
    const item = cart.find(i => i.id === id);

    if (item) {
      if (item.qty > 1) item.qty--;
      else cart = cart.filter(i => i.id !== id); // Remove if qty = 0
      this.saveCart(cart);
    }
  }

  // ========================
  // REMOVE ITEM
  // Removes an item completely from the cart
  // ========================
  removeItem(id: string) {
    const cart = this.getCart().filter(i => i.id !== id);
    this.saveCart(cart);
  }

  // ========================
  // GET TOTAL
  // Returns total price of all items in the cart
  // ========================
  getTotal(): number {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  // ========================
  // UPDATE TOTAL ITEMS
  // Updates the observable with total quantity of items
  // ========================
  private updateTotalItems() {
    const cart = this.getCart();
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    this.totalItemsSubject.next(total);
  }
}
