import Component from './base/Component';
import Card from './Card';
import { IEvents, IProduct } from '../types';

class Gallery extends Component {
	protected _items: HTMLElement[];
	protected _events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this._items = [];
		this._events = events;
	}

	render(products: IProduct[]) {
		products.forEach((product) => {
			const card = new Card(this.createCardTemplate());
			const element = card.render(product);

			element.addEventListener('click', () => {
				this._events.emit('product:selected', product);
			});

			this._items.push(element);
		});

		this.container.replaceChildren(...this._items);
		return this.container;
	}

	private createCardTemplate(): HTMLButtonElement {
		const template = document.createElement('button');
		template.className = 'card gallery__item';
		template.innerHTML = `
            <span class="card__category card__category_soft"></span>
			<h2 class="card__title"></h2>
			<img class="card__image" src="<%=require('../images/Subtract.svg')%>" alt="" />
			<span class="card__price"></span>
        `;
		return template;
	}
}

export default Gallery;
