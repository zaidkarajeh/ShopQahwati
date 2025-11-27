/* ========================
   Navbar Component
   Handles navbar logic, cart dropdown, and cart item interactions
   ======================== */
import { Component, OnInit,HostListener } from '@angular/core';
import { CartService, CartItem } from 'src/app/services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  showSearch = false;
searchText = '';
    isScrolled = false;

  /* State for showing/hiding the cart dropdown */
  showCart = false;

  /* Array of cart items */
  cartItems: CartItem[] = [];

  /* Total price of items in the cart */
  total = 0;

  /* Total number of items in the cart */
  totalItems = 0;

  /* Inject CartService to manage cart state */
  constructor(private cart: CartService) {}

  /* On component initialization: subscribe to cart changes */
  ngOnInit(): void {
    this.cart.totalItems$.subscribe(count => {
      this.totalItems = count;
      this.cartItems = this.cart.getCart();
      this.total = this.cart.getTotal();
    });
  }

  /* Toggle cart dropdown visibility */
  toggleCart() {
    this.showCart = !this.showCart;
  }

  /* Increase quantity of a specific cart item */
  inc(id: string) {
    this.cart.increaseQty(id);
  }

  /* Decrease quantity of a specific cart item */
  dec(id: string) {
    this.cart.decreaseQty(id);
  }

  /* Remove a specific item from the cart */
  remove(id: string) {
    this.cart.removeItem(id);
  }


  scrollTo(section: string) {
  const element = document.getElementById(section);
  if (element) {
    const yOffset = -150; 
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}


 @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }


  toggleSearch() {
  this.showSearch = !this.showSearch;
}

onSearch(event: Event) {
  this.searchText = (event.target as HTMLInputElement).value;
  console.log('بحث عن:', this.searchText);
}



}

