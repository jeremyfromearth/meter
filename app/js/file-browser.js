import * as d3 from 'd3'
import {Widget, WidgetFlag} from 'phosphor/lib/ui/widget'

class FileBrowser extends Widget {
    constructor(store) {
        super();

        this.addClass('content');
        this.title.label = 'Files';

        this.store = store;   
        this.store.subscribe('blach', this.update_library.bind(this));
    }

    update_library(data) {
        if(this.midi_lib_list) this.midi_lib_list.remove();
        this.midi_lib_list = d3.select(this.node).append('ul');
        this.midi_lib_list.selectAll('li')
            .data(data.file_system.midi_library) 
            .enter()
            .append('li')
            .text(function(d) {
                return d.filename;
            });
    }
}

export {FileBrowser}
