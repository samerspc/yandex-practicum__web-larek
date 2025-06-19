import './scss/styles.scss';

import { IProduct, IOrder } from './types';

import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';

import AppData from './model/AppData';
import Gallery from './components/Gallery';
import ProductModal from './components/ProductModal';
import Basket from './components/Basket';
import OrderForm from './components/OrderForm';
import ContactsForm from './components/ContactsForm';

const api = new Api(API_URL);
const events = new EventEmitter();

const appData = new AppData(api, events);

// Product gallery
const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const gallery = new Gallery(galleryContainer, events);

// Product modal window
const productModalContainer = document.querySelector(
	'.modal__content'
) as HTMLElement;
const productModal = new ProductModal(productModalContainer, events);

// Basket modal window (используем тот же контейнер)
const basket = new Basket(productModalContainer, events);
const orderForm = new OrderForm(productModalContainer, events);
const contactsForm = new ContactsForm(productModalContainer, events);

// modal toggle function
const modalContainer = document.getElementById('modal-container');
const closeButton = modalContainer.querySelector('.modal__close');

function openModal() {
	modalContainer.classList.add('modal_active');
}
function closeModal() {
	modalContainer.classList.remove('modal_active');
}
if (closeButton) {
	closeButton.addEventListener('click', closeModal);
}
modalContainer.addEventListener('click', (event) => {
	if (event.target === modalContainer) {
		closeModal();
	}
});

// Открытие корзины по клику на иконку
const basketButton = document.querySelector('.header__basket');
basketButton.addEventListener('click', () => {
	basket.render(appData.cart);
	openModal();
});

// init events
// Галерея
events.on<{ products: IProduct[] }>('products:changed', ({ products }) => {
	gallery.render(products);
});
// Модалка товара
events.on<IProduct>('product:selected', (product) => {
	productModal.render(product);
	openModal();
});
// Добавление/удаление товара в корзину
events.on<IProduct>('product:added', (product) => {
	appData.toggleProductInCart(product);
});
// Удаление товара из корзины
events.on<IProduct>('cart:remove', (product) => {
	appData.toggleProductInCart(product);
	basket.render(appData.cart);
});
// Обновление счетчика корзины
const basketCounter = document.querySelector('.header__basket-counter');
events.on('cart:changed', () => {
	basketCounter.textContent = String(appData.cart.count);
});

// === Оформление заказа ===
let orderStep: 1 | 2 = 1;

// Открытие формы заказа
// Шаг 1: способ оплаты и адрес
events.on('order:open', () => {
	orderStep = 1;
	orderForm.render(appData.order);
	openModal();
});
// Выбор способа оплаты
events.on<{ paymentMethod: string }>('order:payment', ({ paymentMethod }) => {
	appData.setOrderField('paymentMethod', paymentMethod);
	orderForm.render(appData.order);
});
// Ввод адреса
events.on<{ address: string }>('order:address', ({ address }) => {
	appData.setOrderField('address', address);
});
// Переход к шагу 2
events.on('order:next', () => {
	orderStep = 2;
	contactsForm.render(appData.order);
});
// Ввод email
events.on<{ email: string }>('order:email', ({ email }) => {
	appData.setOrderField('email', email);
});
// Ввод телефона
events.on<{ phone: string }>('order:phone', ({ phone }) => {
	appData.setOrderField('phone', phone);
});
// Отправка заказа
events.on('order:submit', async () => {
	await appData.submitOrder();
});
// Успех заказа
events.on('order:success', () => {
	// Показать модалку успеха
	const template = document.getElementById('success') as HTMLTemplateElement;
	const success = template.content.firstElementChild.cloneNode(
		true
	) as HTMLElement;
	productModalContainer.innerHTML = '';
	productModalContainer.appendChild(success);
	// Кнопка закрытия
	const closeBtn = success.querySelector(
		'.order-success__close'
	) as HTMLButtonElement;
	closeBtn.addEventListener('click', closeModal);
});
// Ошибка заказа
events.on('order:error', (err) => {
	alert('Ошибка оформления заказа!');
});

appData.getProducts();
