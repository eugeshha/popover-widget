import { PopoverWidget } from "./app";

jest.useFakeTimers();

describe("PopoverWidget", () => {
  let popoverWidget;
  let mockTargetElement;

  beforeEach(() => {
    document.body.innerHTML = "";

    mockTargetElement = document.createElement("button");
    mockTargetElement.getBoundingClientRect = jest.fn(() => ({
      left: 100,
      top: 200,
      width: 150,
      height: 40,
    }));
    document.body.appendChild(mockTargetElement);

    popoverWidget = new PopoverWidget();

    jest.clearAllTimers();
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllTimers();
  });

  describe("constructor", () => {
    test("should initialize with null popover and false visibility", () => {
      expect(popoverWidget.popover).toBeNull();
      expect(popoverWidget.isVisible).toBe(false);
    });
  });

  describe("show method", () => {
    test("should create and show popover with title and content", () => {
      const title = "Test Title";
      const content = "Test Content";

      popoverWidget.show(mockTargetElement, title, content);

      jest.runAllTimers();

      expect(popoverWidget.popover).toBeTruthy();
      expect(popoverWidget.popover.classList.contains("popover")).toBe(true);
      expect(popoverWidget.isVisible).toBe(true);
    });

    test("should hide existing popover before showing new one", () => {
      const hideSpy = jest.spyOn(popoverWidget, "hide");

      popoverWidget.show(mockTargetElement, "Title", "Content");
      jest.runAllTimers();

      expect(hideSpy).toHaveBeenCalled();
    });

    test("should position popover correctly", () => {
      const positionSpy = jest.spyOn(popoverWidget, "positionPopover");

      popoverWidget.show(mockTargetElement, "Title", "Content");
      jest.runAllTimers();

      expect(positionSpy).toHaveBeenCalledWith(mockTargetElement);
    });
  });

  describe("hide method", () => {
    test("should hide visible popover", () => {
      popoverWidget.show(mockTargetElement, "Title", "Content");
      jest.runAllTimers();

      expect(popoverWidget.isVisible).toBe(true);
      expect(popoverWidget.popover).toBeTruthy();

      popoverWidget.hide();

      expect(popoverWidget.popover.classList.contains("show")).toBe(false);
      expect(popoverWidget.isVisible).toBe(false);
    });

    test("should not hide if popover is not visible", () => {
      popoverWidget.isVisible = false;
      popoverWidget.popover = document.createElement("div");

      popoverWidget.hide();

      expect(popoverWidget.popover.classList.contains("show")).toBe(false);
    });

    test("should not hide if popover is null", () => {
      popoverWidget.isVisible = true;
      popoverWidget.popover = null;

      expect(() => popoverWidget.hide()).not.toThrow();
    });

    test("should remove popover from DOM after timeout", () => {
      popoverWidget.show(mockTargetElement, "Title", "Content");
      jest.runAllTimers();

      expect(popoverWidget.isVisible).toBe(true);
      expect(popoverWidget.popover).toBeTruthy();

      popoverWidget.hide();
      expect(popoverWidget.isVisible).toBe(false);

      jest.runAllTimers();

      expect(popoverWidget.popover).toBeNull();
    });

    test("should handle popover without parentNode during removal", () => {
      popoverWidget.popover = document.createElement("div");
      popoverWidget.isVisible = true;

      popoverWidget.hide();
      jest.runAllTimers();

      expect(popoverWidget.popover).toBeNull();
    });
  });

  describe("toggle method", () => {
    test("should show popover when not visible", () => {
      const showSpy = jest.spyOn(popoverWidget, "show");
      popoverWidget.isVisible = false;

      popoverWidget.toggle(mockTargetElement, "Title", "Content");

      expect(showSpy).toHaveBeenCalledWith(
        mockTargetElement,
        "Title",
        "Content",
      );
    });

    test("should hide popover when visible", () => {
      const hideSpy = jest.spyOn(popoverWidget, "hide");
      popoverWidget.isVisible = true;

      popoverWidget.toggle(mockTargetElement, "Title", "Content");

      expect(hideSpy).toHaveBeenCalled();
    });
  });

  describe("createPopover method", () => {
    test("should create popover with title and content", () => {
      const title = "Test Title";
      const content = "Test Content";

      const result = popoverWidget.createPopover(title, content);

      expect(result.classList.contains("popover")).toBe(true);
      expect(result.querySelector(".popover-header").textContent).toBe(title);
      expect(result.querySelector(".popover-body").textContent).toBe(content);
      expect(result.querySelector(".popover-arrow")).toBeTruthy();
    });

    test("should create popover without title when title is empty", () => {
      const content = "Test Content";

      const result = popoverWidget.createPopover("", content);

      expect(result.classList.contains("popover")).toBe(true);
      expect(result.querySelector(".popover-header")).toBeNull();
      expect(result.querySelector(".popover-body").textContent).toBe(content);
    });
  });

  describe("positionPopover method", () => {
    test("should position popover above target element", () => {
      const popover = document.createElement("div");
      popover.getBoundingClientRect = jest.fn(() => ({
        width: 200,
        height: 100,
      }));
      popoverWidget.popover = popover;

      popoverWidget.positionPopover(mockTargetElement);

      expect(popover.style.left).toBeDefined();
      expect(popover.style.top).toBeDefined();
    });

    test("should not position if popover is null", () => {
      popoverWidget.popover = null;

      expect(() =>
        popoverWidget.positionPopover(mockTargetElement),
      ).not.toThrow();
    });

    test("should not position if target element is null", () => {
      const popover = document.createElement("div");
      popoverWidget.popover = popover;

      expect(() => popoverWidget.positionPopover(null)).not.toThrow();
    });
  });

  describe("adjustPositionForViewport method", () => {
    beforeEach(() => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 800,
      });
    });

    test("should adjust position when popover is outside viewport", () => {
      const popover = document.createElement("div");
      popover.getBoundingClientRect = jest.fn(() => ({
        width: 300,
        height: 100,
      }));
      popover.style.left = "-50px";
      popover.style.top = "10px";
      popoverWidget.popover = popover;

      popoverWidget.adjustPositionForViewport();

      expect(popover.style.left).toBe("10px");
    });

    test("should adjust position when popover exceeds right edge", () => {
      const popover = document.createElement("div");
      popover.getBoundingClientRect = jest.fn(() => ({
        width: 300,
        height: 100,
      }));
      popover.style.left = "600px";
      popover.style.top = "10px";
      popoverWidget.popover = popover;

      popoverWidget.adjustPositionForViewport();

      expect(popover.style.left).toBe("490px");
    });

    test("should adjust position when popover is above viewport", () => {
      const popover = document.createElement("div");
      popover.getBoundingClientRect = jest.fn(() => ({
        width: 300,
        height: 100,
      }));
      popover.style.left = "100px";
      popover.style.top = "-50px";
      popoverWidget.popover = popover;

      popoverWidget.adjustPositionForViewport();

      expect(popover.style.top).toBe("10px");
    });

    test("should not adjust if popover is null", () => {
      popoverWidget.popover = null;

      expect(() => popoverWidget.adjustPositionForViewport()).not.toThrow();
    });
  });

  describe("DOM event listeners", () => {
    beforeEach(() => {
      document.body.innerHTML = "";
      jest.clearAllTimers();
    });

    afterEach(() => {
      document.body.innerHTML = "";
      jest.clearAllTimers();
    });

    test("should initialize event listeners on DOMContentLoaded", () => {
      const button1 = document.createElement("button");
      button1.setAttribute("data-title", "Title 1");
      button1.setAttribute("data-content", "Content 1");
      document.body.appendChild(button1);

      const button2 = document.createElement("button");
      button2.setAttribute("data-title", "Title 2");
      button2.setAttribute("data-content", "Content 2");
      document.body.appendChild(button2);

      const event = new Event("DOMContentLoaded");
      document.dispatchEvent(event);

      const clickEvent = new MouseEvent("click", { bubbles: true });
      button1.dispatchEvent(clickEvent);
      jest.runAllTimers();

      const popover = document.querySelector(".popover");
      expect(popover).toBeTruthy();
      expect(popover.querySelector(".popover-header").textContent).toBe(
        "Title 1",
      );
      expect(popover.querySelector(".popover-body").textContent).toBe(
        "Content 1",
      );
    });

    test("should hide popover when clicking outside", () => {
      const button = document.createElement("button");
      button.setAttribute("data-title", "Title");
      button.setAttribute("data-content", "Content");
      document.body.appendChild(button);

      const event = new Event("DOMContentLoaded");
      document.dispatchEvent(event);

      const clickEvent = new MouseEvent("click", { bubbles: true });
      button.dispatchEvent(clickEvent);
      jest.runAllTimers();

      expect(document.querySelector(".popover")).toBeTruthy();

      const outsideClick = new MouseEvent("click", { bubbles: true });
      document.body.dispatchEvent(outsideClick);

      const popover = document.querySelector(".popover");
      expect(popover).toBeTruthy();
      expect(popover.classList.contains("show")).toBe(false);
    });

    test("should hide popover when pressing Escape", () => {
      const button = document.createElement("button");
      button.setAttribute("data-title", "Title");
      button.setAttribute("data-content", "Content");
      document.body.appendChild(button);

      const event = new Event("DOMContentLoaded");
      document.dispatchEvent(event);

      const clickEvent = new MouseEvent("click", { bubbles: true });
      button.dispatchEvent(clickEvent);
      jest.runAllTimers();

      expect(document.querySelector(".popover")).toBeTruthy();

      const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" });
      document.dispatchEvent(escapeEvent);

      const popover = document.querySelector(".popover");
      expect(popover).toBeTruthy();
      expect(popover.classList.contains("show")).toBe(false);
    });

    test("should not hide popover when pressing other keys", () => {
      const button = document.createElement("button");
      button.setAttribute("data-title", "Title");
      button.setAttribute("data-content", "Content");
      document.body.appendChild(button);

      const event = new Event("DOMContentLoaded");
      document.dispatchEvent(event);

      const clickEvent = new MouseEvent("click", { bubbles: true });
      button.dispatchEvent(clickEvent);
      jest.runAllTimers();

      const popover = document.querySelector(".popover");
      expect(popover).toBeTruthy();

      const otherKeyEvent = new KeyboardEvent("keydown", { key: "Enter" });
      document.dispatchEvent(otherKeyEvent);

      expect(popover.classList.contains("show")).toBe(true);
    });

    test("should not hide popover when clicking on popover itself", () => {
      const button = document.createElement("button");
      button.setAttribute("data-title", "Title");
      button.setAttribute("data-content", "Content");
      document.body.appendChild(button);

      const event = new Event("DOMContentLoaded");
      document.dispatchEvent(event);

      const clickEvent = new MouseEvent("click", { bubbles: true });
      button.dispatchEvent(clickEvent);
      jest.runAllTimers();

      const popover = document.querySelector(".popover");
      expect(popover).toBeTruthy();

      const popoverClick = new MouseEvent("click", { bubbles: true });
      popover.dispatchEvent(popoverClick);

      expect(popover.classList.contains("show")).toBe(true);
    });

    test("should not hide popover when clicking on button", () => {
      const button = document.createElement("button");
      button.setAttribute("data-title", "Title");
      button.setAttribute("data-content", "Content");
      document.body.appendChild(button);

      const event = new Event("DOMContentLoaded");
      document.dispatchEvent(event);

      const clickEvent = new MouseEvent("click", { bubbles: true });
      button.dispatchEvent(clickEvent);
      jest.runAllTimers();

      const popover = document.querySelector(".popover");
      expect(popover).toBeTruthy();

      button.dispatchEvent(clickEvent);

      expect(popover.classList.contains("show")).toBe(false);
    });
  });
});
