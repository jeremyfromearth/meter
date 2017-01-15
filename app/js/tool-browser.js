import {Widget} from 'phosphor/lib/ui/widget'

class ToolBrowser extends Widget {
    constructor(store) {
        super();
        this.store = store;
        this.store.subscribe('tools', this.on_tool_update.bind(this));

        this.addClass('content');
        this.title.label = 'Tools';
    }

    on_tool_update(data) {

    }
}

export {ToolBrowser}
