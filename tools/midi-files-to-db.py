import os
from mido import MidiFile, MetaMessage, Message, tempo2bpm

for f in os.listdir('./'):
    if f.endswith('.mid'):
        print('----------------------')
        print(f)
        try:
            m = MidiFile('./' + f)
            duration = 0
            bpms = {}
            bpm_duration = 0
            current_bpm = 120
            programs = set()
            for msg in m:
                duration += msg.time 
                bpm_duration += msg.time
                if isinstance(msg, MetaMessage):
                    if msg.type != 'lyrics' and msg.type != 'midi_port':
                        if msg.type == 'set_tempo':
                            if current_bpm in bpms:
                                bpms[current_bpm] += bpm_duration
                            else:
                                bpms[current_bpm] = bpm_duration
                            bpm_duration = 0
                            current_bpm = round(tempo2bpm(msg.tempo))
                else:
                    if msg.type == 'program_change':
                        programs.add(msg.program)

            if current_bpm in bpms:
                bpms[current_bpm] += bpm_duration
            else:
                print('bpm_duration', bpm_duration)
                bpms[current_bpm] = bpm_duration

            print('BPM', max(bpms, key=bpms.get))
            print('Programs', programs)
            print('Duration', m.length)
        except Exception as e:
            print('Could not open file', f)
            print(e)
