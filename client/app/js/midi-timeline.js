import {Widget} from 'phosphor/lib/ui/widget'

class MidiTimeline extends Widget {
    constructor() {
        super();
        this.addClass('content');        
        this.title.label = 'Midi Timeline';
    }
}

export {MidiTimeline}
