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

document.addEventListener('DOMContentLoaded', initializeApp);
