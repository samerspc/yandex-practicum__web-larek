import Component from './base/Component';
import { IEvents, IOrder } from '../types';

class OrderForm extends Component {
	protected _events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this._events = events;
	}

	render(order: IOrder) {
		const template = document.getElementById('order') as HTMLTemplateElement;
		const form = template.content.firstElementChild.cloneNode(
			true
		) as HTMLFormElement;
		const addressInput = form.querySelector(
			'input[name="address"]'
		) as HTMLInputElement;
		const onlineBtn = form.querySelector(
			'button[name="card"]'
		) as HTMLButtonElement;
		const offlineBtn = form.querySelector(
			'button[name="cash"]'
		) as HTMLButtonElement;
		const nextBtn = form.querySelector('.order__button') as HTMLButtonElement;
		const errors = form.querySelector('.form__errors') as HTMLElement;

		// Установить значения
		addressInput.value = order.address;
		if (order.paymentMethod === 'online') {
			onlineBtn.classList.add('button_alt-active');
			offlineBtn.classList.remove('button_alt-active');
		} else {
			offlineBtn.classList.add('button_alt-active');
			onlineBtn.classList.remove('button_alt-active');
		}

		// Обработчики выбора оплаты
		onlineBtn.addEventListener('click', () => {
			this._events.emit('order:payment', { paymentMethod: 'online' });
		});
		offlineBtn.addEventListener('click', () => {
			this._events.emit('order:payment', { paymentMethod: 'offline' });
		});

		// Обработчик ввода адреса
		addressInput.addEventListener('input', (e) => {
			this._events.emit('order:address', {
				address: (e.target as HTMLInputElement).value,
			});
		});

		// Валидация
		const validate = () => {
			if (!addressInput.value) {
				errors.textContent = 'Введите адрес';
				nextBtn.disabled = true;
			} else {
				errors.textContent = '';
				nextBtn.disabled = false;
			}
		};
		addressInput.addEventListener('input', validate);
		validate();

		// Кнопка далее
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			if (!nextBtn.disabled) {
				this._events.emit('order:next');
			}
		});

		this.container.innerHTML = '';
		this.container.appendChild(form);
	}
}

export default OrderForm;
