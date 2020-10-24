class DragSorting {
    constructor({ containers = [], onDrop = null }) {
        this.containers = [...containers];

        this.selected_item = null;

        this.dragitems = [];

        this.onDrop =
            typeof onDrop === "function" ? onDrop.bind(this) : () => {};

        this.containers.forEach((c) => {
            this.dragitems.push(...c.querySelectorAll("[draggable]"));
        });

        this.dragitems.forEach((item) => {
            item.ondragstart = () => (this.selected_item = item);
            item.ondrag = this.handleDrag.bind(this);
            item.ondragend = this.handleDrop.bind(this);
        });
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

    handleDrag(event) {
        const selected_item = this.selected_item;

        const x = event.clientX;
        const y = event.clientY;

        selected_item.classList.add("drag-active");

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
        this.selected_item.classList.remove("drag-active");
        this.onDrop(this.selected_item);
        this.selected_item = null;
    }
}

window.sortable = new DragSorting({
    containers: document.querySelectorAll(".container"),
    onDrop(selected_item) {},
});
