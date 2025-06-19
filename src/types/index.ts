export interface IProduct {
	id: string;
	title: string;
	description: string;
	category: string;
	price: number | null;
	image: string;
	isInCart: boolean;
}

export interface ICart {
	items: IProduct[];
	totalCost: number;
	count: number;
}

export enum PaymentMethodEnum {
	Online = 'online',
	offline = 'offline',
}

export interface IOrder {
	address: string;
	email: string;
	phone: string;
	paymentMethod: PaymentMethodEnum;
	items: IProduct[];
	totalCost: number;
	status: string;
}

export interface IEvents {
	on<T extends object>(event: string, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(event: string, data?: T): void;
}

export interface IModal {
	content: HTMLElement;
	open(): void;
	close(): void;
}

export interface IForm {
	validate(): boolean;
	errors: string[];
}
