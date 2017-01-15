import * as d3 from 'd3'
import {Widget} from 'phosphor/lib/ui/widget'

class OutputPanel extends Widget {
    constructor(store) {
        super();
        this.store = store;
        this.store.subscribe('output_panel', this.on_output_panel_update.bind(this));

        this.auto_scroll = true;
        this.addClass('content');
        this.node.innerHTML = `<div id='terminal' class='terminal'>\> Welcome to Meter</div>`;
    }

    onAfterAttach(message) {
        d3.select('#terminal')
            .on('mouseenter', ()=> {
                this.auto_scroll = false; 
            })
            .on('mouseleave', ()=> {
                this.auto_scroll = true; 
            });
    }

    on_output_panel_update(data) {
        var div = this.node.getElementsByTagName('div')[0];
        if(data.output_panel.length) {
            var message = data.output_panel[data.output_panel.length-1];
            div.insertAdjacentHTML(
                'beforeend', `<br/>${message}`)
            if(this.auto_scroll) {
                div.scrollTop = div.scrollHeight;
            }
        }
    }
}

export {OutputPanel}
