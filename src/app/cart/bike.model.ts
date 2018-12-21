import { IOrder } from '../cart/cart.component';

export class Bike {

    id?: string;
    image?: string;
    description?: string;
    price?: number;
    quantity?: number;

    constructor(bike: IOrder) {
        Object.assign(this, bike);
    }

}