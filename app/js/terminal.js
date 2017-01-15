import {Widget} from 'phosphor/lib/ui/widget'

class Terminal extends Widget {
    constructor(store) {
        super();
        this.store = store;

        this.addClass('content');
        this.node.innerHTML = 
            `<div class='terminal'>\> Welcome to Meter</div>`
    }
}

export {Terminal}
