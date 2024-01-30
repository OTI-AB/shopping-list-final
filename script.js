const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearAllBtn = document.getElementById('clear');
const filter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;
let isDuplicate = false;

const displayItems = () => {
	const itemsFromStorage = getItemsFromStorage();
	itemsFromStorage.forEach((item) => addItemToDOM(item));
	checkUI();
};

const onAddItemSubmit = (e) => {
	e.preventDefault();

	const newItem = itemInput.value;

	if (newItem === '') {
		alert('Please enter an item');
		return;
	}

	if (isEditMode) {
		const itemToEdit = itemList.querySelector('.edit-mode');

		removeItemFromStorage(itemToEdit.textContent);
		itemToEdit.classList.remove('edit-mode');

		itemToEdit.remove();

		isEditMode = false;
	}

	checkForDuplicate(newItem);

	if (isDuplicate) {
		return;
	}

	addItemToDOM(newItem);

	checkUI();
	itemInput.value = '';
	addItemToStorage(newItem);
};

const addItemToDOM = (item) => {
	const li = document.createElement('li');
	li.appendChild(document.createTextNode(item));

	const btn = createButton('remove-item btn-link text-red');
	li.appendChild(btn);
	const icon = createIcon('fa-solid fa-xmark');
	btn.appendChild(icon);

	itemList.appendChild(li);
};

const createButton = (classes) => {
	const btn = document.createElement('button');
	btn.className = classes;
	return btn;
};

const createIcon = (classes) => {
	const icon = document.createElement('i');
	icon.className = classes;
	return icon;
};

const addItemToStorage = (item) => {
	const itemsFromStorage = getItemsFromStorage();

	itemsFromStorage.push(item);

	localStorage.setItem('items', JSON.stringify(itemsFromStorage));
};

const getItemsFromStorage = () => {
	let itemsFromStorage;

	if (localStorage.getItem('items') === null) {
		itemsFromStorage = [];
	} else {
		itemsFromStorage = JSON.parse(localStorage.getItem('items'));
	}

	return itemsFromStorage;
};

const onClickItem = (e) => {
	if (e.target.parentElement.classList.contains('remove-item')) {
		removeItem(e.target.parentElement.parentElement);
	} else if (e.target.classList.contains('items')) {
		alert('Please click inside the box of the item you wish to edit');
	} else {
		setItemToEdit(e.target);
	}
};

const checkForDuplicate = (item) => {
	isDuplicate = false;
	const lis = itemList.querySelectorAll('li');
	lis.forEach((i) => {
		let iLower = i.firstChild.textContent.toLowerCase();

		if (iLower === item.toLowerCase()) {
			isDuplicate = true;
			alert('This item is already in you list');
			itemInput.value = '';
		}
	});
};

const setItemToEdit = (item) => {
	isEditMode = true;

	itemList
		.querySelectorAll('li')
		.forEach((i) => i.classList.remove('edit-mode'));

	item.classList.add('edit-mode');
	configEditBtn();

	itemInput.value = item.textContent;
};

const configEditBtn = () => {
	if (isEditMode) {
		formBtn.innerHTML = '<i class="fa-solid fa-edit"> </i> Edit Item ';
		formBtn.style.backgroundColor = 'green';
		formBtn.style.color = 'yellow';
	}
};

const removeItem = (item) => {
	if (confirm('Are you sure?!')) {
		item.remove();

		removeItemFromStorage(item.textContent);
	}

	checkUI();
};

const removeItemFromStorage = (item) => {
	let itemsFromStorage = getItemsFromStorage();
	itemsFromStorage = itemsFromStorage.filter((fi) => fi !== item);

	localStorage.setItem('items', JSON.stringify(itemsFromStorage));
};

const removeAll = (e) => {
	const lis = document.querySelectorAll('li');
	if (confirm('Are you positive?')) {
		lis.forEach((li) => {
			li.remove();
		});
		localStorage.clear();
	}

	checkUI();
};

const filterItems = (e) => {
	const text = e.target.value.toLowerCase();
	const lis = document.querySelectorAll('li');

	lis.forEach((item) => {
		const itemName = item.firstChild.textContent.toLowerCase();
		if (itemName.includes(text)) {
			item.style.display = 'flex';
		} else {
			item.style.display = 'none';
		}
	});
};

const checkUI = () => {
	itemInput.value = '';

	const lis = document.querySelectorAll('li');
	if (lis.length === 0) {
		clearAllBtn.style.display = 'none';
		filter.style.display = 'none';
	} else {
		clearAllBtn.style.display = 'block';
		filter.style.display = 'block';
	}

	formBtn.innerHTML = '<i class="fa-solid fa-plus"> </i> Add Item ';
	formBtn.style.backgroundColor = 'black';
	formBtn.style.color = 'white';
};

const init = () => {
	// Event Listeners
	itemForm.addEventListener('submit', onAddItemSubmit);
	itemList.addEventListener('click', onClickItem);
	clearAllBtn.addEventListener('click', removeAll);
	filter.addEventListener('input', filterItems);
	document.addEventListener('DOMContentLoaded', displayItems);

	checkUI();
};

init();
