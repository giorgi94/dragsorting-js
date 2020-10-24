class DragSorting {
    constructor({ onDrop = null }) {
        this.containers = [
            ...document.querySelectorAll('[data-drag="container"]'),
        ];

        this.selected_item = null;

        this.dragitems = [];

        this.onDrop =
            typeof onDrop === "function" ? onDrop.bind(this) : () => {};

        this.containers.forEach((c) => {
            c.draggable = false;
            this.dragitems.push(...c.querySelectorAll('[data-drag="item"]'));
        });

        this.dragitems.forEach((item) => {
            item.onmousedown = (event) => {
                item.draggable = this.canDrag(item, event.target);
            };

            item.ondragstart = () => {
                this.selected_item = item;
            };

            item.ondrag = this.handleDrag.bind(this);
            item.ondragend = this.handleDrop.bind(this);

            item.ontouchstart = () => {
                item.draggable = this.canDrag(item, event.target);
                if (item.draggable) {
                    this.selected_item = item;
                }
            };

            item.ontouchmove = this.handleTouchMove.bind(this);
            item.ontouchend = this.handleDrop.bind(this);
        });
    }

    canDrag(item, target) {
        return (
            !item.querySelector('[data-drag="handle"]') ||
            target.dataset.drag === "handle"
        );
    }

    toJSON() {
        return this.dragitems.map((item) => {
            return {
                container: item.parentElement,
                element: item,
            };
        });
    }

    reOrder(items = []) {}

    handleTouchMove(event) {
        event.preventDefault();
        event.stopPropagation();

        const touchlocation = event.targetTouches[0];

        this.handleDrag({
            clientX: touchlocation.clientX,
            clientY: touchlocation.clientY,
        });
    }

    handleDrag(event) {
        if (!this.selected_item) {
            return;
        }

        const selected_item = this.selected_item;

        const x = event.clientX;
        const y = event.clientY;

        selected_item.style.opacity = 0.1;

        let swap_item = document.elementFromPoint(x, y);

        swap_item = this.dragitems.find(
            (item) => item.contains(swap_item) || item == swap_item
        );

        if (!swap_item) {
            let element = document.elementFromPoint(x, y);
            let container = this.containers.find((c) => c.contains(element));

            return !!container && container.appendChild(selected_item);
        }

        if (swap_item === selected_item.nextSibling) {
            swap_item = swap_item.nextSibling;
        }

        swap_item.parentElement.insertBefore(selected_item, swap_item);
    }

    handleDrop(event) {
        if (!this.selected_item) {
            return;
        }

        const item = this.selected_item;

        this.selected_item = null;
        item.style.opacity = 1;
        item.draggable = false;

        this.onDrop(item);
    }
}
