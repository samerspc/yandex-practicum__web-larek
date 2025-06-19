import Component from './base/Component';
import { IProduct, IEvents } from '../types';
import { CDN_URL } from '../utils/constants';

class ProductModal extends Component {
	protected _events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this._events = events;
	}

	render(product: IProduct) {
		const card = this.getProductModalTemplate();
		console.log(card);

		this.setText(card.querySelector('.card__category'), product.category);
		this.setText(card.querySelector('.card__title'), product.title);
		this.setText(card.querySelector('.card__text'), product.description);
		this.setText(
			card.querySelector('.card__price'),
			product.price !== null ? `${product.price} синапсов` : 'Бесценно'
		);
		(card.querySelector('.card__image') as HTMLImageElement).src =
			CDN_URL + product.image;

		const button = card.querySelector('.card__button') as HTMLButtonElement;
		button.textContent = product.isInCart ? 'Удалить из корзины' : 'В корзину';
		button.disabled = product.price === null;
		button.onclick = () => {
			this._events.emit('product:added', product);
		};

		this.container.innerHTML = '';
		this.container.appendChild(card);
	}

	// private getProductModalTemplate(): HTMLElement {
	//     const template = document.createElement('div');
	//     template.className = 'card card_full';

	//     template.innerHTML =
	//     `   <img class="card__image" src="<%=require('../images/Subtract.svg')%>" alt="" />
	// 		<div class="card__column">
	// 			<span class="card__category card__category_other"></span>
	// 			<h2 class="card__title"></h2>
	// 			<p class="card__text"></p>
	// 			<div class="card__row">
	// 				<button class="button card__button"></button>
	// 				<span class="card__price"></span>
	// 			</div>
	// 		</div>`;

	//     return template;
	// }

	private getProductModalTemplate(): HTMLElement {
		const template = document.getElementById(
			'card-preview'
		) as HTMLTemplateElement;
		return template.content.firstElementChild.cloneNode(true) as HTMLElement;
	}
}

export default ProductModal;
