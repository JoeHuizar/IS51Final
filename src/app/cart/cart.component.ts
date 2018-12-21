import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { LocalStorageService } from '../localStorageService';
import { IUser } from '../login/login.component';
import { Bike } from '../cart/bike.model';

export interface IOrder {
  id?: string;
  image?: string;
  description?: string;
  price?: number;
  quantity?: number;
}
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  nameParams: string;
  bikes: Array<Bike> = [];
  localStorageService: LocalStorageService<Bike>;
  currentUser: IUser;
  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {
    this.localStorageService = new LocalStorageService('bikes');
  }

  async ngOnInit() {
    // const currentUser = this.localStorageService.getItemsFromLocalStorage('user');
    // if (currentUser === null) {
    //   this.router.navigate(['login']);
    // }
    this.loadBikes();
    this.activatedRoute.params.subscribe((data: IUser) => {
      console.log('data passed from login component to this component: ', data);
      this.currentUser = data;
    });
  }

  async loadBikes() {
    const savedBikes = this.localStorageService.getItemsFromLocalStorage('bikes');
    if (savedBikes && savedBikes.length > 0) {
      this.bikes = savedBikes;
    } else {
    this.bikes = await this.loadItemsFromFile();
    }
  }


  async loadItemsFromFile() {
    const data = await this.http.get('assets/inventory.json').toPromise();
    return data.json();
  }

  addBike() {
    this.bikes.unshift(new Bike({}));
  }

  deleteBike(index: number) {
    this.bikes.splice(index, 1);
    this.localStorageService.saveItemsToLocalStorage(this.bikes);
    this.toastService.showToast('success', 4000, 'Success: Item deleted!');
  }

  saveBike(bike: Bike) {
    this.localStorageService.saveItemsToLocalStorage(this.bikes);
    this.toastService.showToast('success', 4000, 'Success: Items Saved!');
  }

  goToCheckout(bikes: IOrder) {
    let subTotal = 0;
    let total = 0;
    let tax = .15;

    for (let i = 0, len = this.bikes.length; i < len; i++) {
      const bike = this.bikes[i];
      subTotal += bike.price;
      total = subTotal + tax;
    }
    if (this.nameParams == '' || this.nameParams == null) {
      this.toastService.showToast('danger', 4000, 'Name input field not specified!');
    } else {
      this.localStorageService.saveItemsToLocalStorage(this.bikes);
      this.router.navigate(['invoice', bikes]);
    }
  }


}
