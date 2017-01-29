class MidiMessage { 
    static get SequenceNumber() { return 0x00; }
    static get Text() { return 0x01; }
    static get Copyright() { return 0x02; }
    static get TrackName() { return 0x03; }
    static get InstrumentName() { return 0x04; }
    static get Lyric() { return 0x05; }
    static get Marker() { return 0x06; }
    static get CueMarker() { return 0x07; }
    static get DeviceName() { return 0x09; }
    static get NoteOff() { return 0x8; };
    static get NoteOn() { return 0x9; };
    static get PolyphonicAfterTouch() { return 0xA; }
    static get ControlModeChange() { return 0xB;}
    static get ProgramChange() { return 0xC; }
    static get AfterTouch() { return 0xD; }
    static get PitchWheelRange() { return 0xE; }
    static get SystemExclusive() { return 0xF; }
    static get ChannelPrefix() { return 0x20; }
    static get MidiPort() { return 0x21; }
    static get EndOfTrack() { return 0x2F; }
    static get SetTempo() { return 0x51; }
    static get SmpteOffest() { return 0x54; }
    static get TimeSignature() { return 0x58; }
    static get KeySignature() { return 0x59; }
    static get SequencerSpecific() { return 0x7F; }

    static get Names() {
        return {
            0x8: 'note-off',
            0x9: 'note-on',
            0xA: 'polyphonic-aftertouch',
            0xB: 'control-mode-change',
            0xC: 'program-change',
            0xD: 'after-touch', 
            0xE: 'pitch-wheel-range',
            0xF: 'system-exclusive'
        };
    }

    static get MetaNames() {
        return {
            0x00: 'sequence-number',
            0x01: 'text',
            0x02: 'copyright',
            0x03: 'track-name',
            0x04: 'instrument-name',
            0x05: 'lyric',
            0x06: 'marker',
            0x07: 'cue-marker',
            0x09: 'device-name',
            0x20: 'channel-prefix',
            0x21: 'midi-port',
            0x2F: 'end-of-track',
            0x51: 'set-tempo',
            0x58: 'time-signature',
            0x59: 'key-signature',
            0x7F: 'sequencer-specific',
        }
    }

    static get Keys() {
        return {
            '-7': {0: 'Cb', 1: 'Abm'},
            '-6': {0: 'Gb', 1: 'Ebm'},
            '-5': {0: 'Db', 1: 'Bbm'},
            '-4': {0: 'Ab', 1: 'Fm'}, 
            '-3': {0: 'Eb', 1: 'Cm'}, 
            '-2': {0: 'Bb', 1: 'Gm'},
            '-1': {0: 'F', 1: 'Dm'},
             '0': {0: 'C', 1: 'Am'},
             '1': {0: 'G', 1: 'Em'},
             '2': {0: 'D', 1: 'Bm'},
             '3': {0: 'A', 1: 'F#m'},
             '4': {0: 'E', 1: 'C#m'},
             '5': {0: 'B', 1: 'G#m'},
             '6': {0: 'F#', 1: 'D#m'},
             '7': {0: 'C#', 1: 'A#m'}
        }
    }

    static get Framerates() {
        return [24, 25, 29.97, 30];
    }

    constructor() {
        this.meta = false;
        this.type = false;
    }

    get name() {
        if(this.meta) return MidiMessage.MetaNames[this.type];
        return MidiMessage.Names[this.type];
    }
}

class MidiFileReader {
    constructor(data) {
        this.data = data;
        this.read_index = 0;
    }

    move_read_index_by(bytes) {
        if(!this.data) return;
        this.read_index = Math.max(0, Math.min(this.read_index + bytes, this.data.length-1));
    }

    move_read_index_to(position) {
        this.read_index = Math.max(0, position);
    }

    read_int(bytes) {
        var value = 0;
	if(bytes > 1){
	    for(var i = 1; i < bytes; i++){
		value += parseInt(this.data[this.read_index]) * Math.pow(256, (bytes - i));
		this.read_index++;
	    }
	}
	value += parseInt(this.data[this.read_index]);
	this.read_index++;
	return value;
    }

   read_int_vlv() {
        var value = 0;
        if(parseInt(this.data[this.read_index]) < 128) {
            value = this.read_int(1);
        }else{
            var bytes = [];
            while(parseInt(this.data[this.read_index]) >= 128){
                bytes.push(this.read_int(1) - 128);
            }
            var last_byte = this.read_int(1);
            for(var dt = 1; dt <= bytes.length; dt++){
                value = bytes[bytes.length - dt] * Math.pow(128, dt);
            }
            value += last_byte;
        }
        return value;
    } 

    read_string(bytes) { 
	var str = '';
	for(var char = 0; char < bytes; char++) { 
            str +=  String.fromCharCode(this.read_int(1));
	 }
	return str;
    }
}

class MidiMessageData {
    constructor(reader) {
        this.duration = 0;
        this.messages = [];
        this.message_count = 0;
        if(reader.read_int(4) != 0x4D546864) {
            throw(Error('[MidiMessageData] - Header is not valid'));
        }
	var header_size = reader.read_int(4);
        this.formatType = reader.read_int(2);
        this.track_count = reader.read_int(2);
        var time_division_byte_1 = reader.read_int(1);
        var time_division_byte_2 = reader.read_int(1);
        if(time_division_byte_1 >= 128) {
            this.time_division = [];
            this.time_division[0] = time_divison_byte_1 - 128;
            this.time_division[1] = time_division_byte_2;
        } else {
            this.time_division  = (time_division_byte_1 * 256) + time_division_byte_2;
        }

        for(var i = 0; i < this.track_count; i++) {
            this.messages.push([]);
            var track = this.messages[i];
            if(reader.read_int(4) !== 0x4D54726B) {
                throw(Error('[MidiMessageData] - Track header is not valid'));    
            };
            reader.read_int(4);
            var end_of_track = false;
            var status_byte = null;
            var previous_status_byte = null;
            while(!end_of_track) {
                var delta = reader.read_int_vlv();
                this.duration += delta;
                status_byte = reader.read_int(1);
                if(status_byte >= 128) {
                    previous_status_byte = status_byte;
                } else {
                    status_byte = previous_status_byte;
                    reader.move_read_index_by(-1);
                }

                if(status_byte === 0xFF) {
                    var message = new MidiMessage();
                    message.delta = delta;
                    message.meta = true;
                    message.type = reader.read_int(1);
                    var length = reader.read_int_vlv();
                    switch(message.type) {
                        case MidiMessage.Text:
                        case MidiMessage.Copyright:
                        case MidiMessage.TrackName:
                        case MidiMessage.InstrumentName:
                        case MidiMessage.Lyric:
                        case MidiMessage.Marker:
                        case MidiMessage.CueMarker:
                        case MidiMessage.DeviceName:
                            message.data = reader.read_string(length);
                            break;
                        case MidiMessage.MidiPort:
                        case MidiMessage.ChannelPrefix:
                        case MidiMessage.SequenceNumber:
                            message.data = reader.read_int(1);
                            break;
                        case MidiMessage.EndOfTrack:
                            end_of_track = true;
                            break;
                        case MidiMessage.SetTempo:
                        case MidiMessage.SequencerNumber:
                            message.data = reader.read_int(length);
                            break;
                        case MidiMessage.SmpteOffest:
                            message.framerate = MidiMessage.Framerates[reader.read_int(1) >> 6];
                            message.hours = reader.read_int(1);
                            message.minutes = reader.read_int(1);
                            message.seconds = reader.read_int(1);
                            message.frames = reader.read_int(1);
                            message.sub_frames = reader.read_int(1);
                            break;
                        case MidiMessage.TimeSignature:
                            message.numerator = reader.read_int(1);
                            message.denominator = Math.pow(2, reader.read_int(1));
                            message.clocks_per_click = reader.read_int(1);
                            message.notated_32nd_notes_per_beat = reader.read_int(1);
                            break;
                        case MidiMessage.KeySignature:
                            var key_1 = reader.read_int(1);
                            if(key_1 > 127) key_1 -= 256; 
                            var key_2 = reader.read_int(1);
                            message.data = MidiMessage.Keys[key_1][key_2];
                            break;
                        case MidiMessage.SequencerSpecific:
                            message.data = [];
                            for(var j = 0; j < length; j++) {
                                message.data[j] = reader.read_int(1);
                            }
                            break;
                        default:
                            message.data = [];
                            for(var j = 0; j < length; j++) {
                                message.data.push(reader.read_int(1));
                            }
                            console.warn('Unhandled type', message);
                            if(isNaN(message.type)) return;
                            break;
                    }
                    track.push(message);     
                    this.message_count++;
                } else {
                    var message = new MidiMessage();
                    status_byte = status_byte.toString(16).split('');
                    if(!status_byte[1]) status_byte.unshift('0');
                    message.type = parseInt(status_byte[0], 16);
                    message.channel = parseInt(status_byte[1], 16);
                    switch(message.type) {
                        case MidiMessage.SystemExclusive:
                            var length = reader.read_int_vlv();
                            message.data = reader.read_int(length);
                            break;
                        case MidiMessage.PolyphonicAfterTouch:
                        case MidiMessage.ControlModeChange:
                        case MidiMessage.PitchWheelRange:
                        case MidiMessage.NoteOff:
                        case MidiMessage.NoteOn:
                            message.data = [];
                            message.data[0] = reader.read_int(1);
                            message.data[1] = reader.read_int(1);
                            break;
                        case MidiMessage.ProgramChange:
                        case MidiMessage.AfterTouch:
                            message.data = reader.read_int(1);
                            break;
                        default:
                            console.warn('Unhandled Midi event: ' + message.type);
                            break;
                    }
                    track.push(message);
                    this.message_count++;
                }
            }
        }
        console.log(`Completed with ${this.message_count} messages and a duration of ${this.duration}`);
    }
}

export {MidiFileReader, MidiMessageData, MidiMessage}
