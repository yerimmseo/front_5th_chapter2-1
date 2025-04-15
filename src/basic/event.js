import { AppState } from './state';
import {
  addCartItem,
  removeCartItem,
  updateCartItemQuantity,
  updateCartTotal,
  updateProductSelect,
  updateStockInfo,
} from './elements';

export const setupEventListeners = (elements) => {
  const { productSelect, addToCartBtn, cartContainer } = elements;

  // 상품 추가 버튼 이벤트
  addToCartBtn.addEventListener('click', () => {
    const selectedProductId = productSelect.value;
    const selectedProduct = AppState.findProduct(selectedProductId);

    if (selectedProduct && selectedProduct.stock > 0) {
      // 재고 감소
      if (AppState.decreaseStock(selectedProductId)) {
        // 장바구니에 추가
        addCartItem(selectedProduct);

        // 총액 및 재고 정보 업데이트
        updateCartTotal();
        updateStockInfo();
        updateProductSelect();

        // 마지막 선택 상품 기록
        AppState.lastSelectedProduct = selectedProductId;
      } else {
        alert('재고가 부족합니다.');
      }
    }
  });

  // 장바구니 아이템 관련 이벤트 (수량 변경, 삭제)
  cartContainer.addEventListener('click', (event) => {
    const target = event.target;

    if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
      const productId = target.dataset.productId;
      const product = AppState.findProduct(productId);

      if (!product) {
        return;
      }

      if (target.classList.contains('quantity-change')) {
        // 수량 변경될 때
        const quantityChange = parseInt(target.dataset.change);

        if (quantityChange > 0) {
          if (product.stock < 1) {
            alert('재고가 부족합니다.');
            return;
          }

          if (updateCartItemQuantity(productId, quantityChange)) {
            AppState.decreaseStock(productId, quantityChange);
          }
        } else {
          if (updateCartItemQuantity(productId, quantityChange)) {
            AppState.increaseStock(productId, -quantityChange);
          }
        }
      } else if (target.classList.contains('remove-item')) {
        // 아이템 삭제
        const itemElement = document.getElementById(productId);
        const quantity = parseInt(itemElement.querySelector('span').textContent.split('x ')[1]);

        if (removeCartItem(productId)) {
          AppState.increaseStock(productId, quantity);
        }
      }

      updateCartTotal();
      updateStockInfo();
      updateProductSelect();
    }
  });
};

// 랜덤 할인
export const setupPromotions = () => {
  setTimeout(() => {
    setInterval(() => {
      const luckyItem = AppState.products[Math.floor(Math.random() * AppState.products.length)];
      if (Math.random() < 0.3 && luckyItem.stock > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        updateProductSelect();
        updateCartTotal();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(() => {
    setInterval(() => {
      if (AppState.lastSelectedProduct) {
        const suggestedProduct = AppState.products.find(
          (product) => product.id !== AppState.lastSelectedProduct && product.stock > 0
        );

        if (suggestedProduct) {
          alert(`${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          suggestedProduct.price = Math.round(suggestedProduct.price * 0.95);
          updateProductSelect();
          updateCartTotal();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};
