import os
import re
import sys
from random import random
from mido import MidiFile, MetaMessage, Message, tempo2bpm

DB_VERSION = '1.0.0'

dirname = ''
try:
    dirname = sys.argv[1]
except:
    print('Directory name should be first argument')
    sys.exit()

def create_set_from_file(filename):
    with open(filename) as f:
        return set([line.rstrip().lower() for line in f])

first_cap_re = re.compile('(.)([A-Z][a-z0-9]+)')
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
sample_size = 0.01

# load terms from files
stop_words = create_set_from_file('stopwords.txt')
composers = create_set_from_file('composers.txt')
musicians = create_set_from_file('artists.txt') 
soundtrack_composers = create_set_from_file('soundtrack-composers.txt')
genres = create_set_from_file('genres.txt')
videogames = create_set_from_file('video-game-titles.txt')
instruments = create_set_from_file('instruments.txt')

bb_songs = []
with open('billboard-top-100-1950-2015.txt') as f:
    bb_songs = [line.rstrip().lower().split(',') for line in f]

song_titles = []
with open('top-10k-songs-with-artists.txt') as f:
    song_titles = [line.rstrip().lower().split(',') for line in f]

# iterate over all files in supplied directory
for f in os.listdir(dirname):
    if f.endswith('.mid') or f.endswith('.MID'):
        r = random()
        if r < sample_size:
            print('----------------------')
            print(f)
            try:
                m = MidiFile(dirname +'/'+ f)
                data = {'db_version': DB_VERSION}
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

                keywords = ' '.join(words)
                data['filename'] = f
                data['bpm'] =  max(bpms, key=bpms.get)
                data['programs'] = programs
                data['duration'] = m.length
                data['keywords'] = keywords
                data['artists'] = []
                data['titles'] = []
                data['years'] = []
                data['instruments'] = []
                data['composers'] = []
                data['soundtrack_composers'] = []
                data['genres'] = []
                data['game_titles'] = []

                artists = {} 
                track_titles = {}

                bb_years = {}
                bb_artists = {}
                bb_track_titles = {}
                
                for i in range(1, 5):
                    ngrams = create_ngrams(words, i)
                    for gram in ngrams:
                        phrase = ' '.join(gram) 
                        for j in range(len(bb_songs)):
                            song = bb_songs[j]
                            if len(song) >= 2 and song[1] in phrase:
                                bb_track_titles[j] = song[1]
                            if len(song) >= 3: 
                                if song[2] in phrase or song[2] == 'The ' + phrase:
                                    bb_artists[j] = song[2]

                        for j in range(len(song_titles)):
                            song = song_titles[j]
                            if song[0] in phrase:
                                track_titles[j] = song[0]
                            if song[1] in phrase:
                                artists[j] = song[1]

                        if phrase in musicians:
                            data['artists'].append(phrase)
                        if phrase in composers:
                            data['composers'].append(phrase)
                        if phrase in soundtrack_composers:
                            data['soundtrack_composers'].append(phrase)
                        if phrase in genres:
                            data['genres'].append(phrase)
                        if phrase in videogames:
                            data['game_titles'].append(phrase)
                        if phrase in instruments:
                            data['instruments'].append(phrase)

                found_in_bb = False
                for k, v in bb_artists.items():
                    if k in bb_track_titles:
                        found_in_bb = True
                        data['artists'].append(bb_artists[k])
                        data['years'].append(bb_songs[k][0])
                        data['titles'].append(bb_track_titles[k])

                for k, v in artists.items():
                    if k in track_titles:
                        if not found_in_bb:
                            data['artists'].append[k]
                            data['titles'].append(track_titles[k])

                year_search = re.findall(' (\d{4}) ', keywords)
                if len(year_search) > 0:
                    data['years'] += [int(y) for y in year_search if int(y) > 1800 and int(y) < 2017]

                print(data)

            except Exception as e:
                print('Could not open file', f)
                print(e)
                pass

print('Successfully found', successes)
