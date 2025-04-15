var products, productSelect, addToCartBtn, cartContainer, totalDisplay, stockDisplay;
var lastSelectedProduct,
  bonusPoints = 0,
  totalAmount = 0,
  totalItemCount = 0;

function main() {
  products = [
    { id: 'p1', name: '상품1', price: 10000, stock: 50 },
    { id: 'p2', name: '상품2', price: 20000, stock: 30 },
    { id: 'p3', name: '상품3', price: 30000, stock: 20 },
    { id: 'p4', name: '상품4', price: 15000, stock: 0 },
    { id: 'p5', name: '상품5', price: 25000, stock: 10 },
  ];

  var root = document.getElementById('app');
  let container = document.createElement('div');
  var wrapper = document.createElement('div');
  let title = document.createElement('h1');
  cartContainer = document.createElement('div');
  totalDisplay = document.createElement('div');
  productSelect = document.createElement('select');
  addToCartBtn = document.createElement('button');
  stockDisplay = document.createElement('div');

  cartContainer.id = 'cart-items';
  totalDisplay.id = 'cart-total';
  productSelect.id = 'product-select';
  addToCartBtn.id = 'add-to-cart';
  stockDisplay.id = 'stock-status';
  container.className = 'bg-gray-100 p-8';
  wrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  title.className = 'text-2xl font-bold mb-4';
  totalDisplay.className = 'text-xl font-bold my-4';
  productSelect.className = 'border rounded p-2 mr-2';
  addToCartBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  stockDisplay.className = 'text-sm text-gray-500 mt-2';

  title.textContent = '장바구니';
  addToCartBtn.textContent = '추가';

  updateSelectOptions();

  wrapper.appendChild(title);
  wrapper.appendChild(cartContainer);
  wrapper.appendChild(totalDisplay);
  wrapper.appendChild(productSelect);
  wrapper.appendChild(addToCartBtn);
  wrapper.appendChild(stockDisplay);
  container.appendChild(wrapper);
  root.appendChild(container);

  calculateCart();

  setTimeout(function () {
    setInterval(function () {
      var luckyItem = products[Math.floor(Math.random() * products.length)];
      if (Math.random() < 0.3 && luckyItem.stock > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelectOptions();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedProduct) {
        var suggest = products.find(function (item) {
          return item.id !== lastSelectedProduct && item.stock > 0;
        });

        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.price = Math.round(suggest.price * 0.95);
          updateSelectOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function updateSelectOptions() {
  productSelect.innerHTML = '';
  products.forEach(function (item) {
    var opt = document.createElement('option');

    opt.value = item.id;
    opt.textContent = item.name + ' - ' + item.price + '원';

    if (item.stock === 0) opt.disabled = true;

    productSelect.appendChild(opt);
  });
}

function calculateCart() {
  totalAmount = 0;
  totalItemCount = 0;
  var cartItems = cartContainer.children;
  var originalTotal = 0;

  for (var i = 0; i < cartItems.length; i++) {
    (function () {
      var currentItem;

      for (var j = 0; j < products.length; j++) {
        if (products[j].id === cartItems[i].id) {
          currentItem = products[j];
          break;
        }
      }

      var quantity = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
      var itemTotal = currentItem.price * quantity;
      var disc = 0;
      totalItemCount += quantity;
      originalTotal += itemTotal;

      if (quantity >= 10) {
        if (currentItem.id === 'p1') disc = 0.1;
        else if (currentItem.id === 'p2') disc = 0.15;
        else if (currentItem.id === 'p3') disc = 0.2;
        else if (currentItem.id === 'p4') disc = 0.05;
        else if (currentItem.id === 'p5') disc = 0.25;
      }

      totalAmount += itemTotal * (1 - disc);
    })();
  }

  let discountRate = 0;

  // 두 개의 할인율을 비교하여 더 높은 할인율을 적용
  if (totalItemCount >= 30) {
    var bulkDiscount = totalAmount * 0.25;
    var itemDiscount = originalTotal - totalAmount;

    if (bulkDiscount > itemDiscount) {
      totalAmount = originalTotal * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (originalTotal - totalAmount) / originalTotal;
    }
  } else {
    discountRate = (originalTotal - totalAmount) / originalTotal;
  }

  // 화요일 체크
  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  totalDisplay.textContent = '총액: ' + Math.round(totalAmount) + '원';

  if (discountRate > 0) {
    var span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    totalDisplay.appendChild(span);
  }

  updateStockInfo();
  renderBonusPoints();
}

const renderBonusPoints = () => {
  // render와 로직 따로 빼기...
  bonusPoints = Math.floor(totalAmount / 1000);
  var pointsTag = document.getElementById('loyalty-points');

  if (!pointsTag) {
    pointsTag = document.createElement('span');
    pointsTag.id = 'loyalty-points';
    pointsTag.className = 'text-blue-500 ml-2';
    totalDisplay.appendChild(pointsTag);
  }

  pointsTag.textContent = '(포인트: ' + bonusPoints + ')';
};

function updateStockInfo() {
  var infoMsg = '';

  products.forEach(function (item) {
    if (item.stock < 5) {
      infoMsg +=
        item.name +
        ': ' +
        (item.stock > 0 ? '재고 부족 (' + item.stock + '개 남음)' : '품절') +
        '\n';
    }
  });

  stockDisplay.textContent = infoMsg;
}

main();

addToCartBtn.addEventListener('click', function () {
  var selectedItem = productSelect.value;
  // 선택된 아이템 정보 찾기
  var itemToAdd = products.find(function (p) {
    return p.id === selectedItem;
  });

  if (itemToAdd && itemToAdd.stock > 0) {
    var item = document.getElementById(itemToAdd.id);

    if (item) {
      var newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;

      if (newQty <= itemToAdd.stock) {
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQty;
        itemToAdd.stock--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      var newItem = document.createElement('div');

      newItem.id = itemToAdd.id;

      newItem.className = 'flex justify-between items-center mb-2';

      newItem.innerHTML =
        '<span>' +
        itemToAdd.name +
        ' - ' +
        itemToAdd.price +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        itemToAdd.id +
        '">삭제</button></div>';

      cartContainer.appendChild(newItem);

      itemToAdd.stock--;
    }

    calculateCart();

    lastSelectedProduct = selectedItem;
  }
});

cartContainer.addEventListener('click', function (event) {
  var target = event.target;

  // 수량 변경 또는 삭제 될 때
  if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
    var productId = target.dataset.productId;
    var itemElement = document.getElementById(productId);
    var product = products.find(function (p) {
      return p.id === productId;
    });

    // 수량 변경 될 때
    if (target.classList.contains('quantity-change')) {
      // 변경되는 수량 (-1, +1)
      var qtyChange = parseInt(target.dataset.change);
      var newQty =
        parseInt(itemElement.querySelector('span').textContent.split('x ')[1]) + qtyChange;

      // 수량 + 변경되는 수량이 남은 재고보다 작거나 같을 때
      if (
        newQty > 0 &&
        newQty <=
          product.stock + parseInt(itemElement.querySelector('span').textContent.split('x ')[1])
      ) {
        // 가격 수량 변경
        itemElement.querySelector('span').textContent =
          itemElement.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty;
        product.stock -= qtyChange;
      } else if (newQty <= 0) {
        // 새 수량이 0보다 작을 경우 삭제
        itemElement.remove();
        product.stock -= qtyChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (target.classList.contains('remove-item')) {
      // 삭제 버튼인 경우
      var remQty = parseInt(itemElement.querySelector('span').textContent.split('x ')[1]);

      product.stock += remQty;
      itemElement.remove();
    }

    calculateCart();
  }
});
