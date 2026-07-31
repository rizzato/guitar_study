import assert from 'node:assert/strict';

// Mock browser globals
globalThis.localStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = String(value);
  },
  clear() {
    this.store = {};
  }
};

const mockNavigator = {
  languages: [],
  language: '',
  userLanguage: ''
};

Object.defineProperty(globalThis, 'navigator', {
  value: mockNavigator,
  configurable: true,
  writable: true
});

// Import i18n functions
const { detectLanguage } = await import('../src/lib/i18n.js');

// Test 1: Fallback to English when navigator language is not supported (e.g., 'de')
localStorage.clear();
mockNavigator.languages = ['de', 'it'];
mockNavigator.language = 'de';

let detected = detectLanguage();
assert.equal(detected, 'en', `esperava que de/it fizesse fallback para en, obteve ${detected}`);

// Test 2: Preferred language match
localStorage.clear();
mockNavigator.languages = ['fr-FR', 'en-US'];
mockNavigator.language = 'fr-FR';

detected = detectLanguage();
assert.equal(detected, 'fr', `esperava que fr-FR selecionasse fr, obteve ${detected}`);

// Test 3: Saved language priority
localStorage.setItem('app_lang', 'es');
mockNavigator.languages = ['en-US'];

detected = detectLanguage();
assert.equal(detected, 'es', `esperava que o idioma salvo es vencesse, obteve ${detected}`);

console.log('Testes de i18n concluídos com sucesso!');
