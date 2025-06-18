import Component from "./base/Component";
import type { IProduct } from "../types";

class Card extends Component {
    _title: HTMLElement;
    _description: HTMLElement;
    _image: HTMLImageElement;
    _category: HTMLElement;
    _price: HTMLElement;
    _button?: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container)
        this._title = container.querySelector('.card__title');
        this._image = container.querySelector('.card__image');
        this._category = container.querySelector('.card__category');
        this._price = container.querySelector('.card__price');
        this._description = container.querySelector('.card__text');
        this._button = container.querySelector('.card__button');
    }   

    render(data: IProduct): HTMLElement {
        this.setText(this._title, data.title);
        this.setText(this._description, data.description);
        this.setText(this._category, data.category);
        this.setText(this._price, data.price !== null ? `${data.price.toString()} синапсов` : 'Бесценно');
        this._image.src = data.image;
        return this.container;
    }

}

export default Card;