import {Widget} from 'phosphor/lib/ui/widget'

class OutputPanel extends Widget {
    constructor(store) {
        super();
        this.store = store;
        this.store.subscribe('output_panel', this.on_output_panel_update.bind(this));

        this.addClass('content');
        this.node.innerHTML = `<div id='terminal' class='terminal'>\> Welcome to Meter</div>`
    }
    
    on_output_panel_update(data) {
        var div = document.getElementById('terminal');
        if(data.output_panel.length) {
            var message = data.output_panel[data.output_panel.length-1];
            div.insertAdjacentHTML(
                'beforeend', `<br/>${message}`)
            div.scrollTop = div.scrollHeight;
        }
    }
}

export {OutputPanel}
