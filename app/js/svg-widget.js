import {Widget} from 'phosphor/lib/ui/widget'

class SVGWidget extends Widget {
    constructor(svg_id) {
        super();
        this.addClass('content');
        this.node.innerHTML = `<svg id=${svg_id}></svg>`;
        this.getSVG().style.width = '100%';
        this.getSVG().style.height = '100%';
    }

    getSVG() {
        return this.node.getElementsByTagName('svg')[0];
    }

    onResize() {
        var svg = this.getSVG();
        svg.setAttribute('width', svg.clientWidth);
        svg.setAttribute('height', svg.clientHeight);
    }
}
