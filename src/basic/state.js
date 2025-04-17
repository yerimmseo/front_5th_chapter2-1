// 상태를 객체 내부에 구성해서 응집도 올리기
export const AppState = {
  products: [
    { id: 'p1', name: '상품1', price: 10000, stock: 50 },
    { id: 'p2', name: '상품2', price: 20000, stock: 30 },
    { id: 'p3', name: '상품3', price: 30000, stock: 20 },
    { id: 'p4', name: '상품4', price: 15000, stock: 0 },
    { id: 'p5', name: '상품5', price: 25000, stock: 10 },
  ],
  lastSelectedProduct: null,
  bonusPoints: 0,
  totalAmount: 0,
  totalItemCount: 0,

  findProduct: function (productId) {
    return this.products.find((product) => product.id === productId);
  },

  calculateCart: function (cartElement) {
    const cartItems = cartElement.children;

    this.totalAmount = 0;
    this.totalItemCount = 0;
    let originalTotal = 0;

    for (let i = 0; i < cartItems.length; i++) {
      const itemElement = cartItems[i];
      const productId = itemElement.id;
      const currentProduct = this.findProduct(productId);

      if (currentProduct) {
        const quantity = parseInt(itemElement.querySelector('span').textContent.split('x ')[1]);
        const itemTotal = currentProduct.price * quantity;
        let discount = 0;

        this.totalItemCount += quantity;
        originalTotal += itemTotal;

        // 수량 할인
        if (quantity >= 10) {
          switch (productId) {
            case 'p1':
              discount = 0.1;
              break;
            case 'p2':
              discount = 0.15;
              break;
            case 'p3':
              discount = 0.2;
              break;
            case 'p4':
              discount = 0.05;
              break;
            case 'p5':
              discount = 0.25;
              break;
            default:
              break;
          }
        }

        this.totalAmount += itemTotal * (1 - discount);
      }
    }

    // 대량 구매 할인
    let discountRate = 0;
    if (this.totalItemCount >= 30) {
      const bulkDiscount = this.totalAmount * 0.25;
      const itemDiscount = originalTotal - this.totalAmount;

      // 두 개의 할인율을 비교하여 더 높은 할인율을 적용
      if (bulkDiscount > itemDiscount) {
        this.totalAmount = originalTotal * (1 - 0.25);
        discountRate = 0.25;
      } else {
        discountRate = (originalTotal - this.totalAmount) / originalTotal;
      }
    } else {
      discountRate = (originalTotal - this.totalAmount) / originalTotal;
    }

    // 화요일 할인
    if (new Date().getDay() === 2) {
      this.totalAmount *= 0.9;
      discountRate = Math.max(discountRate, 0.1);
    }

    this.bonusPoints = Math.floor(this.totalAmount / 1000);

    return {
      total: Math.round(this.totalAmount),
      discountRate,
      bonusPoints: this.bonusPoints,
    };
  },

  decreaseStock: function (productId, quantity = 1) {
    const product = this.findProduct(productId);
    if (product && product.stock >= quantity) {
      product.stock -= quantity;
      return true;
    }
    return false;
  },

  increaseStock: function (productId, quantity = 1) {
    const product = this.findProduct(productId);
    if (product) {
      product.stock += quantity;
      return true;
    }
    return false;
  },
};
