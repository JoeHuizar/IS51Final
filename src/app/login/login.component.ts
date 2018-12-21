import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { LocalStorageService } from '../localStorageService';

export interface IUser {
  id?: number;
  username: string;
  password: string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: IUser = { username: '', password: '' };
  localStorageService: LocalStorageService<IUser>;
  currentUser: IUser = null;
  constructor(private router: Router, private toastService: ToastService) {
    this.localStorageService = new LocalStorageService('user');
  }

  ngOnInit() {

  }

  login(user: IUser) {
    console.log("from login.. User: ", user);
    const defaultUser: IUser = { username: 'Joseph', password: 'Joseph123' };
    if (user.username !== '' && user.password !== '') {
      if (user.username === defaultUser.username && user.password === defaultUser.password) {
        this.localStorageService.saveItemsToLocalStorage(user);
        this.router.navigate(['cart', user]);
      } else {
        this.toastService.showToast('danger', 15000, 'Username and/or password not matching default user credentials');
      }
    } else {
      this.toastService.showToast('danger', 15000, 'Username and/or password not specified');
    }
  }


}
