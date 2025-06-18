import { IEvents, IProduct, ICart, IOrder, PaymentMethodEnum } from "../types";
import { Api } from "../components/base/api";

class AppData {
    protected api: Api;
    protected events: IEvents;
    products: IProduct[];
    cart: ICart;
    order: IOrder;

    constructor(api: Api, events: IEvents) {
        this.api = api;
        this.events = events;
        this.products = [];
        this.cart = {
            items: [],
            totalCost: 0,
            count: 0
        };
        this.order = { 
            address: '',
            email: '',
            phone: '',
            paymentMethod: PaymentMethodEnum.Online,
            items: [],
            totalCost: 0,
            status: '',
        };
    }

    async getProducts(): Promise<IProduct[]> {
        try {
            const products = await this.api.get('/products') as IProduct[];
            this.products = products;
            this.events.emit('products:changed', { products });
            return products;
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }

    toggleProductInCart(product: IProduct): void {
        if (product.price == null) return;

        const productIdx = this.products.find((item) => item.id === product.id);

        if (productIdx.isInCart) {
            productIdx.isInCart = false;
            this.cart.items = this.cart.items.filter((item) => item.id !== product.id);
        } else {
            productIdx.isInCart = true;
            this.cart.items.push(productIdx);
        }
        this.computeCartItems();
        this.events.emit('cart:changed', this.cart);
        this.events.emit('product:changed', productIdx);
    }

    getCartTotal(): number {
        const cartTotalCost = this.cart.items.reduce((sum, item) => item.price == null ? sum : sum + item.price, 0);
        return cartTotalCost;
    }

    getCartCount(): number {
        return this.cart.items.length;
    }

    computeCartItems(): void {
        this.cart.count = this.getCartCount();
        this.cart.totalCost = this.getCartTotal();
    }

    clearCart(): void {
        this.cart.items.forEach((item) => {
            if (item.isInCart) {
                const productElem = this.products.find((product) => product.id === item.id);
                productElem.isInCart = false;
                this.events.emit('product:changed', productElem);
            }
        });

        this.cart.items.length = 0;
        this.computeCartItems();
        this.events.emit('cart:changed', this.cart);
    }

    setOrderField(field: keyof Omit<IOrder, 'items' | 'totalCost' | 'status'>, value: string): void {
        switch (field) {
            case 'address': 
                this.order.address = value;
                break;
            case 'email':
                this.order.email = value;
                break;
            case 'phone':
                this.order.phone = value;
                break;
            case 'paymentMethod': 
                this.order.paymentMethod = value as PaymentMethodEnum;
                break;
        }
    }

    setOrderItems(): void {
        this.order.items = this.cart.items;
        this.order.totalCost = this.cart.totalCost;
    }

    validateOrderStepOne(): boolean {
        if (this.order.address !== '') return true;
        return false; 
    }

    validateOrderStepTwo(): boolean {
        if (this.order.email !== '' && this.order.phone !== '') return true;
        return false;
    }

    clearOrder(): void {
        this.order = {
            address: '',
            email: '',
            phone: '',
            paymentMethod: PaymentMethodEnum.Online,
            items: [],
            totalCost: 0,
            status: ''
        }
    }
    
}   

export default AppData;