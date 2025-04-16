import { initializeElements } from './elements';
import { setupEventListeners, setupPromotions } from './event';

const initializeApp = () => {
  const rootElement = document.getElementById('app');

  if (!rootElement) {
    console.error('Root Element가 없습니다.');
    return;
  }

  const elements = initializeElements(rootElement);

  setupEventListeners(elements);
  setupPromotions();
};

// 모듈이 로드되는 즉시 조건을 확인하고 실행
// TEST 코드에서 element = null 인 경우가 있어서 추가함
if (typeof window !== 'undefined' && document.getElementById('app')) {
  initializeApp();
}
