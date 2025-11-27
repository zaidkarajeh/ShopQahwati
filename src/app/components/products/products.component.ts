// ========================
// ProductsComponent
// Handles product list, sale timer box, and cart operations (add, increase, decrease, remove items)
// ========================
import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { CartService, CartItem } from 'src/app/services/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  // Sale timer box visibility and time units
  showBox: boolean = false; // Whether the sale box is visible
  days: number = 0;         // Days remaining in timer
  hours: number = 0;        // Hours remaining
  minutes: number = 0;      // Minutes remaining
  seconds: number = 0;      // Seconds remaining

  // Cart properties
  showCart = false;             // Whether the cart dropdown is visible
  cartItems: CartItem[] = [];   // Array of items in the cart
  total = 0;                    // Total price of items in the cart
  totalItems = 0;               // Total quantity of products in cart
  messages: { [key: string]: boolean } = {}; // Temporary "added to cart" messages

  private timerSub!: Subscription; // Subscription for countdown timer

  constructor(private cart: CartService) {}

  // ========================
  // OnInit lifecycle hook
  // Loads cart and initializes sale box timer
  // ========================
  ngOnInit(): void {
    this.loadCart(); // Load cart initially

    const savedDate = localStorage.getItem('boxExpiry'); // Retrieve saved expiry date
    const now = new Date().getTime();                   // Current timestamp
    let expiryDate: number;

    // If no expiry date saved, create a new one for 3 days
    if (!savedDate) {
      expiryDate = now + 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
      localStorage.setItem('boxExpiry', expiryDate.toString());
    } else {
      expiryDate = +savedDate; // Convert saved string to number
    }

    // Show sale box if current time is before expiry
    if (now < expiryDate) {
      this.showBox = true;
      this.startTimer(expiryDate); // Start countdown
    }
  }

  // ========================
  // OnDestroy lifecycle hook
  // Unsubscribes from timer to avoid memory leaks
  // ========================
  ngOnDestroy(): void {
    if (this.timerSub) this.timerSub.unsubscribe();
  }

  // ========================
  // SALE BOX TIMER FUNCTION
  // Updates days, hours, minutes, seconds until expiry
  // ========================
  startTimer(expiryDate: number) {
    this.timerSub = interval(1000).subscribe(() => {
      const now = new Date().getTime();      // Current time
      const diff = expiryDate - now;         // Time remaining

      if (diff <= 0) {                       // Hide box when timer ends
        this.showBox = false;
        this.timerSub.unsubscribe();
      } else {                               // Calculate time units
        this.days = Math.floor(diff / (1000 * 60 * 60 * 24));
        this.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        this.seconds = Math.floor((diff % (1000 * 60)) / 1000);
      }
    });
  }

  // ========================
  // LOAD CART FUNCTION
  // Loads cart items and calculates total and total items
  // ========================
  loadCart() {
    this.cartItems = this.cart.getCart();
    this.total = this.cart.getTotal();
    this.totalItems = this.cartItems.reduce((sum, item) => sum + item.qty, 0);
  }

  // ========================
  // ADD PRODUCT FUNCTION
  // Adds a product to the cart and shows temporary message
  // ========================
  addProduct(id: string, title: string, price: number, img: string) {
    this.cart.addToCart({ id, title, price, img });
    this.loadCart();
    this.messages[id] = true;              // Show "added to cart" message
    setTimeout(() => { this.messages[id] = false; }, 2000); // Hide after 2s
  }

  // ========================
  // TOGGLE CART FUNCTION
  // Shows or hides the cart dropdown
  // ========================
  toggleCart() {
    this.showCart = !this.showCart;
    this.loadCart();
  }

  // ========================
  // INCREASE QUANTITY FUNCTION
  // Increases quantity of a product in the cart
  // ========================
  inc(id: string) {
    this.cart.increaseQty(id);
    this.loadCart();
  }

  // ========================
  // DECREASE QUANTITY FUNCTION
  // Decreases quantity of a product in the cart
  // ========================
  dec(id: string) {
    this.cart.decreaseQty(id);
    this.loadCart();
  }

  // ========================
  // REMOVE ITEM FUNCTION
  // Removes a product from the cart completely
  // ========================
  remove(id: string) {
    this.cart.removeItem(id);
    this.loadCart();
  }

}
