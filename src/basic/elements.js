import { AppState } from './state';

let elements = {
  cartContainer: null,
  totalDisplay: null,
  productSelect: null,
  addToCartBtn: null,
  stockDisplay: null,
};

export const initializeElements = (rootElement) => {
  const container = document.createElement('div');
  const wrapper = document.createElement('div');
  const title = document.createElement('h1');

  elements.cartContainer = document.createElement('div');
  elements.totalDisplay = document.createElement('div');
  elements.productSelect = document.createElement('select');
  elements.addToCartBtn = document.createElement('button');
  elements.stockDisplay = document.createElement('div');

  elements.cartContainer.id = 'cart-items';
  elements.totalDisplay.id = 'cart-total';
  elements.productSelect.id = 'product-select';
  elements.addToCartBtn.id = 'add-to-cart';
  elements.stockDisplay.id = 'stock-status';

  container.className = 'bg-gray-100 p-8';
  wrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  title.className = 'text-2xl font-bold mb-4';
  elements.totalDisplay.className = 'text-xl font-bold my-4';
  elements.productSelect.className = 'border rounded p-2 mr-2';
  elements.addToCartBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  elements.stockDisplay.className = 'text-sm text-gray-500 mt-2';

  title.textContent = '장바구니';
  elements.addToCartBtn.textContent = '추가';

  wrapper.appendChild(title);
  wrapper.appendChild(elements.cartContainer);
  wrapper.appendChild(elements.totalDisplay);
  wrapper.appendChild(elements.productSelect);
  wrapper.appendChild(elements.addToCartBtn);
  wrapper.appendChild(elements.stockDisplay);
  container.appendChild(wrapper);
  rootElement.appendChild(container);

  updateProductSelect();
  updateCartTotal();
  updateStockInfo();

  return elements;
};

export const updateProductSelect = () => {
  const currentSelectedValue = elements.productSelect.value;

  elements.productSelect.innerHTML = '';
  AppState.products.forEach((product) => {
    const option = document.createElement('option');

    option.value = product.id;
    option.textContent = `${product.name} - ${product.price}원`;

    if (product.stock === 0) {
      option.disabled = true;
    }

    elements.productSelect.appendChild(option);
  });

  if (currentSelectedValue) {
    // 해당 옵션이 존재하고 비활성화되지 않았는지 확인
    const optionExists = Array.from(elements.productSelect.options).some(
      (option) => option.value === currentSelectedValue && !option.disabled
    );

    if (optionExists) {
      elements.productSelect.value = currentSelectedValue;
    }
  }
};

// 장바구니 아이템 추가
export const addCartItem = (product, quantity = 1) => {
  const existingItem = document.getElementById(product.id);

  if (existingItem) {
    // 기존 아이템에 수량 증가
    const currentQuantity = parseInt(existingItem.querySelector('span').textContent.split('x ')[1]);
    const newQuantity = currentQuantity + quantity;

    existingItem.querySelector('span').textContent =
      `${product.name} - ${product.price}원 x ${newQuantity}`;
  } else {
    // 새 아이템 추가
    const newItem = document.createElement('div');

    newItem.id = product.id;
    newItem.className = 'flex justify-between items-center mb-2';
    newItem.innerHTML = `
      <span>${product.name} - ${product.price}원 x ${quantity}</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>
      </div>
    `;

    elements.cartContainer.appendChild(newItem);
  }
};

// 장바구니 아이템 수량 변경
export const updateCartItemQuantity = (productId, quantityChange) => {
  const itemElement = document.getElementById(productId);
  if (!itemElement) {
    return false;
  }

  const product = AppState.findProduct(productId);
  if (!product) {
    return false;
  }

  const currentQuantity = parseInt(itemElement.querySelector('span').textContent.split('x ')[1]);
  const newQuantity = currentQuantity + quantityChange;

  if (newQuantity <= 0) {
    itemElement.remove();
    return true;
  }

  if (quantityChange > 0 && product.stock < quantityChange) {
    alert('재고가 부족합니다.');
    return false;
  }

  // 수량 업데이트
  const namePrice = itemElement.querySelector('span').textContent.split('x ')[0];
  itemElement.querySelector('span').textContent = `${namePrice}x ${newQuantity}`;

  return true;
};

// 장바구니 아이템 삭제
export const removeCartItem = (productId) => {
  const itemElement = document.getElementById(productId);
  if (itemElement) {
    itemElement.remove();
    return true;
  }
  return false;
};

// 장바구니 총액 업데이트
export const updateCartTotal = () => {
  const result = AppState.calculateCart(elements.cartContainer);

  elements.totalDisplay.textContent = `총액: ${result.total}원`;

  if (result.discountRate > 0) {
    const discountSpan = document.createElement('span');
    discountSpan.className = 'text-green-500 ml-2';
    discountSpan.textContent = `(${(result.discountRate * 100).toFixed(1)}% 할인 적용)`;
    elements.totalDisplay.appendChild(discountSpan);
  }

  let pointsTag = document.getElementById('loyalty-points');
  if (!pointsTag) {
    pointsTag = document.createElement('span');
    pointsTag.id = 'loyalty-points';
    pointsTag.className = 'text-blue-500 ml-2';
    elements.totalDisplay.appendChild(pointsTag);
  }

  pointsTag.textContent = `(포인트: ${result.bonusPoints})`;
};

// 재고 정보 업데이트
export const updateStockInfo = () => {
  let infoMessage = '';

  AppState.products.forEach((product) => {
    if (product.stock < 5) {
      infoMessage += `${product.name}: ${product.stock > 0 ? `재고 부족 (${product.stock}개 남음)` : '품절'}\n`;
    }
  });

  elements.stockDisplay.textContent = infoMessage;
};

// 요소 참조
export const getElements = () => {
  return elements;
};
