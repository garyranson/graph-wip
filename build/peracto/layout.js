const zeroBorder = Object.freeze({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
});
const zeroSize = Object.freeze({
    width: 0,
    height: 0
});
class RectangleVertexClass {
    getMinimumSize() {
        return zeroSize;
    }
    getMaximumSize() {
        return undefined;
    }
    getInsets() {
        return zeroBorder;
    }
    layout(container) {
    }
    preferred(container) {
        throw "not implemented";
    }
}
class ContainerVertexClass {
    getMinimumSize() {
        return zeroSize;
    }
    getMaximumSize() {
        return undefined;
    }
    getInsets() {
        return zeroBorder;
    }
    layout(container) {
    }
    preferred(container) {
        throw "not implemented";
    }
}
class Vertex {
    getMinimumSize() {
        return this._vertexClass.getMinimumSize();
    }
    getMaximumSize() {
        return this._vertexClass.getMinimumSize();
    }
    doLayout() {
    }
    isVisible() {
        return true;
    }
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    setLocation(x, y) {
        this.x = x;
        this.y = y;
    }
    getLocation() {
        return {
            x: this.x,
            y: this.y
        };
    }
    getSize() {
        return {
            width: this.width,
            height: this.height
        };
    }
    getPreferredSize() {
        return this._bounds;
    }
}
class ContainerVertex extends Vertex {
    doLayout() {
        this._vertexClass.layout(this);
    }
    getInsets() {
        return this._vertexClass.getInsets();
    }
    getPreferredSize() {
        const margin = this.getInsets();
        const size = this._vertexClass.preferred(this);
        const minSize = this.getMinimumSize();
        const maxSize = this.getMaximumSize();
        let width = size.width + margin.left + margin.right;
        let height = size.height + margin.top + margin.bottom;
        if (minSize) {
            if (width < minSize.width)
                width = minSize.width;
            if (height < minSize.height)
                height = minSize.height;
        }
        if (maxSize) {
            if (width > maxSize.width)
                width = maxSize.width;
            if (height > maxSize.height)
                height = maxSize.height;
        }
        return { width, height };
    }
    getChildren() {
        return this._children;
    }
}
function FlowLayout(config) {
    const _hGap = config.hGap;
    const _vGap = config.vGap;
    const alignment = config.alignment;
    return Object.freeze({
        layout,
        preferred: (container) => {
            return getSize(container, 0);
        },
        minimum: (container) => {
            return getSize(container, 1);
        },
        maximum: (container) => {
            return getSize(container, 2);
        },
    });
    function align(row, offsetX, offsetY, rowWidth, parentWidth) {
        let locationX = offsetX;
        switch (alignment) {
            case 'center':
                locationX += (_hGap + parentWidth - rowWidth) / 2;
                break;
            case 'right':
                locationX += parentWidth - rowWidth + _hGap;
                break;
        }
        for (const item of row) {
            item.setLocation(locationX, offsetY);
            item.doLayout();
            locationX += item.getBounds().width + _hGap;
        }
    }
    function layout(container) {
        const parentSize = container.getBounds();
        const insets = container.getInsets();
        const items = container.getChildren();
        let currentRow = [];
        let rowWidth = 0;
        let rowHeight = 0;
        let offsetX = insets.left;
        let offsetY = insets.top;
        let parentWidth = parentSize.width - insets.left + insets.right;
        for (const item of items) {
            if (item.isVisible()) {
                const itemSize = item.getPreferredSize();
                if ((rowWidth + itemSize.width) > parentWidth) {
                    align(currentRow, offsetX, offsetY, rowWidth, parentWidth);
                    currentRow = [];
                    offsetY += rowHeight;
                    offsetX = insets.left;
                    rowWidth = 0;
                    rowHeight = 0;
                }
                rowHeight = Math.max(rowHeight, itemSize.height + _vGap);
                rowWidth += itemSize.width + _hGap;
                currentRow.push(item);
            }
        }
        align(currentRow, offsetX, offsetY, rowWidth, parentWidth);
    }
    function getSize(container, type) {
        const items = container.getChildren();
        let width = 0;
        let height = 0;
        for (const item of items) {
            if (item.isVisible()) {
                const sz = type == 0 ? item.getPreferredSize() : type == 1 ? item.getMinimumSize() : item.getMaximumSize();
                if (sz) {
                    height = Math.max(height, sz.height);
                    width += sz.width;
                }
            }
        }
        const insets = container.getInsets();
        return {
            'width': width + insets.left + insets.right + (items.length - 1) * _hGap,
            'height': height + insets.top + insets.bottom
        };
    }
}
function ContainerLayout(config) {
    return Object.freeze({
        layout,
        preferred: (container) => {
            return getSize(container, 0);
        },
        minimum: (container) => {
            return getSize(container, 1);
        },
        maximum: (container) => {
            return getSize(container, 2);
        },
    });
    function layout(container) {
        const parentSize = container.getBounds();
        const insets = container.getInsets();
        const items = container.getChildren();
        let currentRow = [];
        let rowWidth = 0;
        let rowHeight = 0;
        let offsetX = insets.left;
        let offsetY = insets.top;
        let parentWidth = parentSize.width - insets.left + insets.right;
        for (const item of items) {
            if (item.isVisible()) {
                const itemSize = item.getPreferredSize();
                if ((rowWidth + itemSize.width) > parentWidth) {
                    align(currentRow, offsetX, offsetY, rowWidth, parentWidth);
                    currentRow = [];
                    offsetY += rowHeight;
                    offsetX = insets.left;
                    rowWidth = 0;
                    rowHeight = 0;
                }
                rowHeight = Math.max(rowHeight, itemSize.height + _vGap);
                rowWidth += itemSize.width + _hGap;
                currentRow.push(item);
            }
        }
        align(currentRow, offsetX, offsetY, rowWidth, parentWidth);
    }
    function getSize(container, type) {
        let insets = container.getInsets();
        let items = container.getChildren();
        let width = 0;
        let height = 0;
        for (const item of items) {
            if (item.isVisible()) {
                const location = item.getLocation();
                const typeSize = type == 0 ? item.getPreferredSize() : type == 1 ? item.getMinimumSize() : item.getMaximumSize();
                const x2 = location.x + typeSize.width;
                const y2 = location.y + typeSize.height;
                if (x2 > width)
                    width = x2;
                if (y2 > height)
                    height = y2;
            }
        }
        return {
            width: width + insets.left + insets.right,
            height: height + insets.top + insets.bottom
        };
    }
}
//# sourceMappingURL=layout.js.map