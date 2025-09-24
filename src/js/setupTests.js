/* eslint-env jest */
// Setup file for Jest tests
// This file is run before each test file

// Mock DOM methods that might not be available in jsdom
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock getBoundingClientRect for elements
Element.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
}));

// Mock scrollTo
window.scrollTo = jest.fn();
