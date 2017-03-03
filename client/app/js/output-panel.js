import * as d3 from 'd3'
import {Widget} from 'phosphor/lib/ui/widget'
import * as Actions from './actions'

class OutputPanel extends Widget {
    constructor(store) {
        super();
        this.store = store;
        this.store.subscribe('output_panel', this.on_output_panel_update.bind(this));
        this.auto_scroll = true;
        this.addClass('content');
        this.node.innerHTML = `
            <div id='output-panel' class='output-panel'>
                \> Welcome to Meter<br/>
            </div>
            <button id='clear-output-button'>Clear</button>`;
    }

    onAfterAttach(message) {
        d3.select('#output-panel')
            .on('mouseenter', ()=> {
                this.auto_scroll = false; 
            })
            .on('mouseleave', ()=> {
                this.auto_scroll = true; 
            });

        d3.select('#clear-output-button')
            .on('click', ()=> {
                this.store.dispatch(Actions.clear_log());
            });
    }

    on_output_panel_update(data) {
        var div = d3.select('#output-panel').node();
        if(data.output_panel.length) {
            var message = data.output_panel[data.output_panel.length-1];
            div.insertAdjacentHTML(
                'beforeend', `${message}<br/>`)
            if(this.auto_scroll) {
                div.scrollTop = div.scrollHeight;
            }
        } else {
            div.innerHTML = '';
        }
    }
}

export {OutputPanel}
