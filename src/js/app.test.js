import { PopoverWidget } from "./app";

// Mock setTimeout to execute immediately
jest.useFakeTimers();

describe("PopoverWidget", () => {
  let popoverWidget;
  let mockTargetElement;

  beforeEach(() => {
    // Clear DOM
    document.body.innerHTML = "";

    // Create a mock target element
    mockTargetElement = document.createElement("button");
    mockTargetElement.getBoundingClientRect = jest.fn(() => ({
      left: 100,
      top: 200,
      width: 150,
      height: 40,
    }));
    document.body.appendChild(mockTargetElement);

    popoverWidget = new PopoverWidget();

    // Reset timers
    jest.clearAllTimers();
  });

  afterEach(() => {
    // Clean up
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

      // Fast-forward timers to execute setTimeout
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
      // First show a popover
      popoverWidget.show(mockTargetElement, "Title", "Content");
      jest.runAllTimers();

      expect(popoverWidget.isVisible).toBe(true);
      expect(popoverWidget.popover).toBeTruthy();

      popoverWidget.hide();

      expect(popoverWidget.popover.classList.contains("show")).toBe(false);
      // isVisible is set to false immediately in hide() method
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

    test("should not adjust if popover is null", () => {
      popoverWidget.popover = null;

      expect(() => popoverWidget.adjustPositionForViewport()).not.toThrow();
    });
  });
});
