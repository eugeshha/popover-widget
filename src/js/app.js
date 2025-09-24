export class PopoverWidget {
  constructor() {
    this.popover = null;
    this.isVisible = false;
  }

  show(targetElement, title, content) {
    this.hide();
    this.popover = this.createPopover(title, content);
    document.body.appendChild(this.popover);
    this.positionPopover(targetElement);
    setTimeout(() => {
      this.popover.classList.add("show");
      this.isVisible = true;
    }, 10);
  }

  hide() {
    if (this.popover && this.isVisible) {
      this.popover.classList.remove("show");
      this.isVisible = false;
      setTimeout(() => {
        if (this.popover && this.popover.parentNode) {
          this.popover.parentNode.removeChild(this.popover);
        }
        this.popover = null;
      }, 300);
    }
  }

  toggle(targetElement, title, content) {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show(targetElement, title, content);
    }
  }

  createPopover(title, content) {
    const popover = document.createElement("div");
    popover.className = "popover";
    if (title) {
      const header = document.createElement("div");
      header.className = "popover-header";
      header.textContent = title;
      popover.appendChild(header);
    }
    const body = document.createElement("div");
    body.className = "popover-body";
    body.textContent = content;
    popover.appendChild(body);
    const arrow = document.createElement("div");
    arrow.className = "popover-arrow";
    popover.appendChild(arrow);
    return popover;
  }

  positionPopover(targetElement) {
    if (!this.popover || !targetElement) return;
    const targetRect = targetElement.getBoundingClientRect();
    const popoverRect = this.popover.getBoundingClientRect();
    const left = targetRect.left + targetRect.width / 2 - popoverRect.width / 2;
    const top = targetRect.top - popoverRect.height - 10;
    this.popover.style.left = `${left}px`;
    this.popover.style.top = `${top}px`;
    this.adjustPositionForViewport();
  }

  adjustPositionForViewport() {
    if (!this.popover) return;
    const popoverRect = this.popover.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    let left = parseInt(this.popover.style.left);
    let top = parseInt(this.popover.style.top);
    if (left < 10) {
      left = 10;
    } else if (left + popoverRect.width > viewportWidth - 10) {
      left = viewportWidth - popoverRect.width - 10;
    }
    if (top < 10) {
      top = 10;
    }
    this.popover.style.left = `${left}px`;
    this.popover.style.top = `${top}px`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const popoverWidget = new PopoverWidget();
  const buttons = document.querySelectorAll("button[data-title][data-content]");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const title = button.getAttribute("data-title");
      const content = button.getAttribute("data-content");
      popoverWidget.toggle(button, title, content);
    });
  });
  document.addEventListener("click", (e) => {
    if (
      !e.target.closest("button[data-title][data-content]") &&
      !e.target.closest(".popover")
    ) {
      popoverWidget.hide();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      popoverWidget.hide();
    }
  });
});
