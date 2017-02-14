import os
import re
import sys
from mido import MidiFile, MetaMessage, Message, tempo2bpm

dirname = ''
try:
    dirname = sys.argv[1]
except:
    print('Directory name should be first argument')
    sys.exit()

stop_words = set()
with open('stopwords.txt') as f:
    stop_words = set([line.rstrip() for line in f])

composers = set()
with open('composers.txt') as f:
    composers = set([line.rstrip().lower() for line in f])

musicians = set()
with open('musicians.txt') as f:
    musicians = set([line.rstrip().lower() for line in f])

soundtrack_composers = set()
with open('soundtrack-composers.txt') as f:
    soundtrack_composers = set([line.rstrip().lower() for line in f])

def clean_text(t, trim=0):
    result = t.lower()
    if trim > 0:
        result = result[:-trim]
    result = re.sub('[-_.]', ' ', result)
    return re.findall(r"[\w']+", result)

def create_ngrams(l, n):
    return zip(*[l[i:] for i in range(n)])

for f in os.listdir(dirname):
    if f.endswith('.mid') or f.endswith('.MID'):
        print('----------------------')
        print(f)
        try:
            m = MidiFile(dirname +'/'+ f)
            duration = 0
            bpms = {}
            bpm_duration = 0
            current_bpm = 120
            programs = set()
            words = set(clean_text(f, 4))
            for msg in m:
                duration += msg.time 
                bpm_duration += msg.time
                if isinstance(msg, MetaMessage):
                    if msg.type == 'set_tempo':
                        if current_bpm in bpms:
                            bpms[current_bpm] += bpm_duration
                        else:
                            bpms[current_bpm] = bpm_duration
                        bpm_duration = 0
                        current_bpm = round(tempo2bpm(msg.tempo))
                    if msg.type == 'program_change':
                        programs.add(msg.program)
                    if msg.type == 'text':
                        words |= set(clean_text(msg.text))
                    '''
                    if msg.type == 'track_name':
                        words |= set(clean_text(msg.name))
                    '''
            if current_bpm in bpms:
                bpms[current_bpm] += bpm_duration
            else:
                bpms[current_bpm] = bpm_duration
            words = words.difference(stop_words)
            print('BPM', max(bpms, key=bpms.get))
            print('Programs', programs)
            print('Duration', m.length)
            for i in range(1, 4):
                ngrams = create_ngrams(list(words), i)
                for gram in ngrams:
                    phrase = ' '.join(gram) 
                    if phrase in musicians:
                        print('Found Musician', phrase)
                    if phrase in composers:
                        print('Found Composer', phrase)
                    if phrase in soundtrack_composers:
                        print('Found Soundtrack Composer', phrase)
        except Exception as e:
            print('Could not open file', f)
            print(e)
