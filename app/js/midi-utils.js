class MIDIEventTypes {
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

class MIDIFile {
    constructor() {
        this.messages = [];
    }

    parse_as_uint_8(file) {
         
    }
}

export {MIDIEventTypes}
