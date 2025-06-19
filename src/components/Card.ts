import Component from './base/Component';
import type { IProduct } from '../types';
import { CDN_URL } from '../utils/constants';

class Card extends Component {
	_title: HTMLElement;
	_image: HTMLImageElement;
	_category: HTMLElement;
	_price: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);
		this._title = container.querySelector('.card__title');
		this._image = container.querySelector('.card__image');
		this._category = container.querySelector('.card__category');
		this._price = container.querySelector('.card__price');
	}

	render(data: IProduct): HTMLElement {
		this.setText(this._title, data.title);
		this.setText(this._category, data.category);
		this.setText(
			this._price,
			data.price !== null ? `${data.price.toString()} синапсов` : 'Бесценно'
		);
		this._image.src = CDN_URL + data.image;
		return this.container;
	}
}

export default Card;
