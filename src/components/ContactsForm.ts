import Component from './base/Component';
import { IEvents, IOrder } from '../types';

class ContactsForm extends Component {
	protected _events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this._events = events;
	}

	render(order: IOrder) {
		const template = document.getElementById('contacts') as HTMLTemplateElement;
		const form = template.content.firstElementChild.cloneNode(
			true
		) as HTMLFormElement;
		const emailInput = form.querySelector(
			'input[name="email"]'
		) as HTMLInputElement;
		const phoneInput = form.querySelector(
			'input[name="phone"]'
		) as HTMLInputElement;
		const payBtn = form.querySelector(
			'button[type="submit"]'
		) as HTMLButtonElement;
		const errors = form.querySelector('.form__errors') as HTMLElement;

		// Установить значения
		emailInput.value = order.email;
		phoneInput.value = order.phone;

		// Валидация
		const validate = () => {
			if (!emailInput.value || !phoneInput.value) {
				errors.textContent = 'Заполните все поля';
				payBtn.disabled = true;
			} else {
				errors.textContent = '';
				payBtn.disabled = false;
			}
		};
		emailInput.addEventListener('input', validate);
		phoneInput.addEventListener('input', validate);
		validate();

		// Обработчики ввода
		emailInput.addEventListener('input', (e) => {
			this._events.emit('order:email', {
				email: (e.target as HTMLInputElement).value,
			});
		});
		phoneInput.addEventListener('input', (e) => {
			this._events.emit('order:phone', {
				phone: (e.target as HTMLInputElement).value,
			});
		});

		// Submit
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			if (!payBtn.disabled) {
				this._events.emit('order:submit');
			}
		});

		this.container.innerHTML = '';
		this.container.appendChild(form);
	}
}

export default ContactsForm;
