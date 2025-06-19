class Component {
	protected readonly container: HTMLElement;

	constructor(container: HTMLElement) {
		this.container = container;
	}

	showElement(element: HTMLElement) {
		element.style.display = 'block';
	}

	hideElement(element: HTMLElement) {
		element.style.display = 'none';
	}

	setText(element: HTMLElement, text: string) {
		element.textContent = text;
	}

	addCssClass(element: HTMLElement, cssClass: string) {
		element.classList.add(cssClass);
	}

	removeCssClass(element: HTMLElement, cssClass: string) {
		element.classList.remove(cssClass);
	}
}

export default Component;
