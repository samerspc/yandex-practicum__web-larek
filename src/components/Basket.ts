import { IEvents, ICart } from '../types';
import Component from './base/Component';

class Basket extends Component {
	protected _events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this._events = events;
	}

	render(cart: ICart) {
		const basketTemplate = document.getElementById(
			'basket'
		) as HTMLTemplateElement;
		const basket = basketTemplate.content.firstElementChild.cloneNode(
			true
		) as HTMLElement;
		const list = basket.querySelector('.basket__list') as HTMLElement;
		const total = basket.querySelector('.basket__price') as HTMLElement;
		const orderButton = basket.querySelector(
			'.basket__button'
		) as HTMLButtonElement;

		list.innerHTML = '';

		cart.items.forEach((product, i) => {
			const itemTemplate = document.getElementById(
				'card-basket'
			) as HTMLTemplateElement;
			const item = itemTemplate.content.firstElementChild.cloneNode(
				true
			) as HTMLElement;
			item.querySelector('.basket__item-index').textContent = String(i + 1);
			item.querySelector('.card__title').textContent = product.title;
			item.querySelector('.card__price').textContent =
				product.price !== null ? `${product.price} синапсов` : 'Бесценно';
			const deleteButton = item.querySelector(
				'.basket__item-delete'
			) as HTMLButtonElement;
			deleteButton.addEventListener('click', () => {
				this._events.emit('cart:remove', product);
			});
			list.appendChild(item);
		});

		total.textContent = `${cart.totalCost} синапсов`;

		orderButton.disabled = cart.items.length === 0;
		orderButton.addEventListener('click', () => {
			this._events.emit('order:open');
		});

		this.container.innerHTML = '';
		this.container.appendChild(basket);
	}
}

export default Basket;
