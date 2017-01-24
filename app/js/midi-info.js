import {Widget} from 'phosphor/lib/ui/widget'
import {MidiFileReader, MidiObject} from './midi'

class MidiInfo extends Widget {
    constructor(midi_object) {
        super();
        this.addClass('content');
        if(midi_object) update(midi_object);
        this.title.label = 'Midi Info';
        this.node.innerHTML = `<input type='file' id='file-reader'/>`
    }

    update(midi_object) {
        
    }
}

export {MidiInfo}
