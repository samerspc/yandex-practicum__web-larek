import Component from "./base/Component";
import Card from "./Card";
import { IEvents, IProduct } from "../types";

class Gallery extends Component {
    protected _items: HTMLElement[];
    protected _events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this._items = [];
        this._events = events;
        this._events.on('products:changed', this.render.bind(this));
    }

    render(products: IProduct[]) {
        products.map((product) => {
            const card = new Card(this.createCardTemplate());
            const element = card.render(product);
            
            element.addEventListener('click', () => {
                this._events.emit('product:selected', product);
            });

            this._items.push(element);

            const button = element.querySelector('.button');
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                this._events.emit('product:added', product);
            });

            return element;
        });

        this.container.replaceChildren(...this._items);
        return this.container;
    }

    private createCardTemplate(): HTMLElement {
        const template = document.createElement('div');
        template.className = 'card card_full';
        template.innerHTML = `
            <img class="card__image" src="" alt="" />
			<div class="card__column">
				<span class="card__category card__category_other"></span>
				<h2 class="card__title"></h2>
				<p class="card__text"></p>
                <div class="card__row">
					<button class="button">Купить</button>
					<span class="card__price"></span>
				</div>
			</div>
        `;
        return template;
    }
}

export default Gallery;