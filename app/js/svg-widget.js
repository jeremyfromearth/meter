import {Widget} from 'phosphor/lib/ui/widget'

class SVGWidget extends Widget {
    constructor(svg_id) {
        super();
        this.addClass('content');
        this.node.innerHTML = `<div><svg id=${svg_id}></svg></div>`;
    }

    getSVG() {
        return this.node.getElementsByTagName('svg')[0];
    }

    onResize() {
        var svg = this.getSVG();
        svg.setAttribute('width', svg.parentNode.clientWidth);
        svg.setAttribute('height', svg.parentNode.clientHeight);
    }
}

export {SVGWidget}
