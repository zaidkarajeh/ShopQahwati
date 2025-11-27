import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  fullHeading2: string = 'اطلب القهوة الطازجة';
  fullHeading1: string = 'مباشرة من المزارع';

  typedHeading2: string = '';
  typedHeading1: string = '';

  ngOnInit(): void {
    this.startTyping();
  }

  startTyping() {
    this.typedHeading2 = '';
    this.typedHeading1 = '';

    // كتابة H2
    let index2 = 0;
    const interval2 = setInterval(() => {
      this.typedHeading2 += this.fullHeading2[index2];
      index2++;
      if (index2 >= this.fullHeading2.length) clearInterval(interval2);
    }, 100); // سرعة الكتابة 100ms لكل حرف

    // كتابة H1 بعد H2
    let index1 = 0;
    const interval1 = setInterval(() => {
      this.typedHeading1 += this.fullHeading1[index1];
      index1++;
      if (index1 >= this.fullHeading1.length) clearInterval(interval1);
    }, 120); // سرعة الكتابة 120ms لكل حرف
  }

}
