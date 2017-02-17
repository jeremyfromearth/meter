import os
import re
import sys
from random import random
from mido import MidiFile, MetaMessage, Message, tempo2bpm

dirname = ''
try:
    dirname = sys.argv[1]
except:
    print('Directory name should be first argument')
    sys.exit()

def create_set_from_file(filename):
    with open(filename) as f:
        return set([line.rstrip().lower() for line in f])

first_cap_re = re.compile('(.)([A-Z][a-z]+)')
all_cap_re = re.compile('([a-z0-9])([A-Z])')
def clean_text(t, trim=0):
    result = t
    if trim > 0:
        result = result[:-trim]
    result = first_cap_re.sub(r'\1 \2', result)
    result = all_cap_re.sub(r'\1 \2', result).lower()
    result = re.sub('[-_.]', ' ', result)
    return re.findall(r"[\w']+", result)

def create_ngrams(l, n):
    return zip(*[l[i:] for i in range(n)])

# percentage of filess to analyze
sample_size = 0.00001

# load terms from files
stop_words = create_set_from_file('stopwords.txt')
composers = create_set_from_file('composers.txt')
musicians = create_set_from_file('artists.txt') 
soundtrack_composers = create_set_from_file('soundtrack-composers.txt')
genres = create_set_from_file('genres.txt')
songs = create_set_from_file('top-10k-songs.txt')
videogames = create_set_from_file('video-game-titles.txt')
instruments = create_set_from_file('instruments.txt')

# iterate over all files in supplied directory
for f in os.listdir(dirname):
    if f.endswith('.mid') or f.endswith('.MID'):
        r = random()
        if r < sample_size:
            print('----------------------')
            print(f)
            try:
                m = MidiFile(dirname +'/'+ f)
                duration = 0
                bpms = {}
                bpm_duration = 0
                current_bpm = 120
                programs = set()
                filename = clean_text(f, 4)
                words = [] + (filename)
                lyrics = []
                for msg in m:
                    duration += msg.time 
                    bpm_duration += msg.time

                    if msg.type == 'set_tempo':
                        if current_bpm in bpms:
                            bpms[current_bpm] += bpm_duration
                        else:
                            bpms[current_bpm] = bpm_duration
                        bpm_duration = 0
                        current_bpm = round(tempo2bpm(msg.tempo))
                    
                    if msg.type == 'text':
                        words += set(clean_text(msg.text))

                    if msg.type == 'track_name':
                        words += clean_text(msg.name)

                    if msg.type == 'program_change':
                        programs.add(msg.program)

                    if msg.type == 'lyrics':
                        lyrics.append(msg.text)

                if current_bpm in bpms:
                    bpms[current_bpm] += bpm_duration
                else:
                    bpms[current_bpm] = bpm_duration
                for word in words:
                    if word in stop_words:
                        words.remove(word)
                print('Filename:', filename)
                print('BPM:', max(bpms, key=bpms.get))
                print('Programs:', programs)
                print('Duration:', m.length)
                print('Lyrics:', ' '.join(lyrics))
                years = []
                key_words = ' '.join(words)
                year_search = re.findall(' (\d{4}) ', key_words)
                if len(year_search) > 0:
                    years = set([int(y) for y in year_search if int(y) > 1800 and int(y) < 2017])
                print('Years', years)
                print('Keywords:', key_words)
                for i in range(1, 8):
                    ngrams = create_ngrams(words, i)
                    for gram in ngrams:
                        phrase = ' '.join(gram) 
                        if phrase in musicians:
                            print('Musician:', phrase)
                        if phrase in composers:
                            print('Composer:', phrase)
                        if phrase in soundtrack_composers:
                            print('Soundtrack Composer:', phrase)
                        if phrase in genres:
                            print('Genre:', phrase)	
                        if phrase in songs:
                            print('Song:', phrase)
                        if phrase in videogames:
                            print('Video Game:', phrase)
                        if phrase in instruments:
                            print('Instrument:', phrase)

				
            except Exception as e:
                print('Could not open file', f)
                print(e)
