class MidiEventTypes {
    static get NoteOff() { return 'note-off' };
    static get NoteOn() { return 'note-on' };
    static get PolyphonicAfterTouch() { return 'polyphonic-aftertouch'; }
    static get ControlModeChange() { return 'control-mode-change';}
    static get ProgramChange() { return 'program-change'; }
    static get AfterTouch() { return 'after-touch'; }
    static get PitchWheelRange() { return 'pitch-wheel-range'; }
    static get SystemExclusive() { return 'system-exclusive'; }

    static get HexCodeToEventName() {
        return {
            '0x8' : MIDIEventTypes.NoteOff,
            '0x9' : MIDIEventTypes.NodeOn,
            '0xA' : MIDIEventTypes.PolyphonicAfterTouch,
            '0xB' : MIDIEventTypes.ControlModeChange,
            '0xC' : MIDIEventTypes.ProgramChange,
            '0xD' : MIDIEventTypes.AfterTouch, 
            '0xE' : MIDIEventTypes.PitchWheelRange,
            '0xF' : MIDIEventTypes.SystemExclusive
        };
    }
}

class MidiMessage {

}

class MidiMetaMessage {

}

class MidiFileReader {
    constructor(data) {
        this.data = data;
        this.read_index = 0;
    }

    move_read_index_by(bytes) {
        // TODO: replace Infinity with length of file
        this.read_index = Math.max(0, Math.min(this.read_index + bytes, Infinity));
    }

    read_int(bytes) {
        var value = 0;
	if(bytes > 1){
	    for(var i=1; i<= (bytes-1); i++){
		value += parseInt(this.data[this.read_index]) * Math.pow(256, (bytes - i));
		this.pointer++;
	    }
	}
	value += parseInt(this.data[this.read_index]);
	this.read_index++;
	return value;
    }

    read_string(bytes) { 
	var str = '';
	for(var char=1; char <= bytes; char++) { 
            text +=  String.fromCharCode(this.read_int(1));
	    return text;
	 }
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
            var last_byte  = this.read_int(1);
            for(var dt = 1; dt <= bytes.length; dt++){
                value = bytes[bytes.length - dt] * Math.pow(128, dt);
            }
            value += last_byte;
        }
        return value;
    } 
}

class MidiMessageData {
    constructor(reader) {
        this.messages = [];
    }

    parse_as_uint_8(file) {
         
    }
}

export {MidiEventTypes, MidiFileReader}
