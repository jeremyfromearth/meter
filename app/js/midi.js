class MidiEventTypes {
    static get NoteOff() { return 'note-off' };
    static get NoteOn() { return 'note-on' };
    static get PolyphonicAfterTouch() { return 'polyphonic-aftertouch'; }
    static get ControlModeChange() { return 'control-mode-change';}
    static get ProgramChange() { return 'program-change'; }
    static get AfterTouch() { return 'after-touch'; }
    static get PitchWheelRange() { return 'pitch-wheel-range'; }
    static get SystemExclusive() { return 'system-exclusive'; }

    static get HexToName() {
        return {
            0x8 : MidiEventTypes.NoteOff,
            0x9 : MidiEventTypes.NoteOn,
            0xA : MidiEventTypes.PolyphonicAfterTouch,
            0xB : MidiEventTypes.ControlModeChange,
            0xC : MidiEventTypes.ProgramChange,
            0xD : MidiEventTypes.AfterTouch, 
            0xE : MidiEventTypes.PitchWheelRange,
            0xF : MidiEventTypes.SystemExclusive
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
            var last_byte  = this.read_int(1);
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
        this.messages = [];
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
            var index = 0;
            var end_of_track = false;
            var status_byte = null;
            var previous_status_byte = null;
            while(!end_of_track) {
                var delta = reader.read_int_vlv();
                status_byte = reader.read_int(1);
                if(status_byte >= 128) {
                    previous_status_byte = status_byte;
                } else {
                    status_byte = previous_status_byte;
                    reader.move_read_index_by(-1);
                }

                if(status_byte === 0xFF) {
                    var message = new MidiMetaMessage();
                    track.push(message);     
                    message.delta = delta;
                    message.type = reader.read_int(1);
                    var length = reader.read_int_vlv();
                    switch(message.type) {
                        case 0x2F:
                            end_of_track = true;
                            break;
                        case 0x01:
                        case 0x02:
                        case 0x03:
                        case 0x06:
                            message.data = reader.read_string(length);
                            break;
                        case 0x21:
                        case 0x51:
                        case 0x59:
                            message.data = reader.read_int(length);
                            break;
                        case 0x54:
                        case 0x58:
                            message.data = [];
                            message.data[0] = reader.read_int(1);
                            message.data[1] = reader.read_int(1);
                            message.data[2] = reader.read_int(1);
                            message.data[3] = reader.read_int(1);
                            break;
                        default:
                            console.warn('Unhandled type', message.type);
                            reader.read_int(length);
                            message.data = reader.read_int(length);
                    }
                } else {
                    var message = new MidiMessage();
                    track.push(message);
                    status_byte = status_byte.toString(16).split('');
                    if(!status_byte[1]) status_byte.unshift('0');
                    var message_hex = parseInt(status_byte[0], 16);
                    message.type = MidiEventTypes.HexToName[message_hex];
                    message.channel = parseInt(status_byte[1], 16);
                    switch(message.type) {
                        case 0xF:
                            var length = reader.read_int_vlv();
                            message.data = reader.read_int(length);
                            break;
                        case MidiEventTypes.PolyphonicAfterTouch:
                        case MidiEventTypes.ControlModeChange:
                        case MidiEventTypes.PitchWheelRange:
                        case MidiEventTypes.NoteOff:
                        case MidiEventTypes.NoteOn:
                            message.data = [];
                            message.data[0] = reader.read_int(1);
                            message.data[1] = reader.read_int(1);
                            break;
                        case MidiEventTypes.ProgramChange:
                        case MidiEventTypes.AfterTouch:
                            message.data = reader.read_int(1);
                            break;
                    }

                }
                index++;
            }
        }

        console.log(this.messages);
    }
}

export {MidiEventTypes, MidiFileReader, MidiMessageData}
