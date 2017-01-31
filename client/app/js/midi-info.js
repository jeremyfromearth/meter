import {Widget} from 'phosphor/lib/ui/widget'
import {MidiFileReader, MidiMessageData} from './midi'

class MidiInfo extends Widget {
    constructor(midi_object) {
        super();
        this.addClass('content');
        if(midi_object) update(midi_object);
        this.title.label = 'Midi Info';
        this.node.innerHTML = `<div><input type='file' id='file-reader'/><div></div></div>`;
    }

    onAfterAttach(msg) {
        var input = this.node.getElementsByTagName('input')[0];
        input.addEventListener('change', (event) => {
            if(event.target.files.length == 0) return;
            var reader = new FileReader();
            reader.readAsArrayBuffer(event.target.files[0]);
            reader.addEventListener('load', (event) => {
                var data = new Uint8Array(event.target.result) 
                var midi_reader = new MidiFileReader(data);
                var midi_object = new MidiMessageData(midi_reader);
                this.update(midi_object);
            });
        });
    }

    update(midi_object) {
        var div = this.node.getElementsByTagName('div')[1];
        div.innerHTML =
            `<ul>
                <li>Total tracks: ${midi_object.messages.length}</li>
                <li>Total messages: ${midi_object.message_count}</li>
                <li>Song duration: ${midi_object.duration}</li>
                <li>Tempo: ${Math.round((1000000 / midi_object.tempo) * 60)} BPM</li>
            </ul>`;
    }
}

export {MidiInfo}
