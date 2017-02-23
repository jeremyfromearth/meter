import os
import re
import sys
import hashlib
from math import log
from pymongo import MongoClient
from pandas import DataFrame, Series
from random import random, shuffle
from analytics import TermFreqInverseDocFreq
from mido import MidiFile, MetaMessage, Message, tempo2bpm

DB_VERSION = '1.0.0'

dirname = ''
sample_size = 1.0
file_upload_count = 0
client = MongoClient('localhost', 27017)
db = client.meter

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
    # trim the string by the supplied trim param
    if trim > 0:
        result = result[:-trim]
    # remove numbers at the end of a file name
    result = re.sub('\d+$', '', result)
    # remove camel case
    result = first_cap_re.sub(r'\1 \2', result)
    result = all_cap_re.sub(r'\1 \2', result).lower()
    # replace common seperators with spaces
    result = re.sub('[-_.]', ' ', result)
    # return list of words
    return re.findall(r"[\w']+", result)

def create_ngrams(l, n):
    return zip(*[l[i:] for i in range(n)])

# load terms from files
stop_words = create_set_from_file('./data/stopwords.txt')
composers = create_set_from_file('./data/composers.txt')
musicians = create_set_from_file('./data/artists.txt') 
soundtrack_composers = create_set_from_file('./data/soundtrack-composers.txt')
genres = create_set_from_file('./data/genres.txt')
videogames = create_set_from_file('./data/video-game-titles.txt')
instruments = create_set_from_file('./data/instruments.txt')

bb_songs = []
with open('./data/billboard-top-100-1950-2015.txt') as f:
    bb_songs = [line.rstrip().lower().split(',') for line in f]

song_titles = []
with open('./data/top-10k-songs-with-artists.txt') as f:
    song_titles = [line.rstrip().lower().split(',') for line in f]

# iterate over all files in supplied directory
index = 0
files = os.listdir(dirname)
for f in files:
    if f.endswith('.mid') or f.endswith('.MID'):
        index += 1
        r = random()
        if r <= sample_size:
            try:
                with open(dirname +'/'+ f, 'rb') as midi_file:
                    sha256 = hashlib.sha256()
                    for block in iter(lambda: midi_file.read(65536), b''):
                        sha256.update(block)
                    checksum = sha256.hexdigest()
                    document_exists = db.midi_files.find_one({'checksum' : checksum})
                    if document_exists is None:
                        m = MidiFile(dirname +'/'+ f)
                        data = {'db_version': DB_VERSION}
                        duration = 0
                        bpms = {}
                        bpm_duration = 0
                        current_bpm = 120
                        programs = set()
                        filename = clean_text(f, 4)
                        words = [] + filename
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
                                words += clean_text(msg.text)

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

                        raw_text = ' '.join(words)
                        data['checksum'] = checksum
                        data['raw_text'] = raw_text
                        data['filename'] = f
                        data['bpm'] =  max(bpms, key=bpms.get)
                        data['programs'] = programs
                        data['duration'] = m.length
                        data['keywords'] = set(words)
                        data['artists'] = set()
                        data['titles'] = set()
                        data['years'] = set()
                        data['instruments'] = set()
                        data['composers'] = set()
                        data['soundtrack_composers'] = set()
                        data['genres'] = set()
                        data['game_titles'] = set()

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
                                    if len(song) >= 2 and song[1] == phrase:
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
                                    data['artists'].add(phrase)
                                if phrase in composers:
                                    data['composers'].add(phrase)
                                if phrase in soundtrack_composers:
                                    data['soundtrack_composers'].add(phrase)
                                if phrase in genres:
                                    data['genres'].add(phrase)
                                if phrase in videogames:
                                    data['game_titles'].add(phrase)
                                if phrase in instruments:
                                    data['instruments'].add(phrase)

                        found_in_bb = False
                        for k, v in bb_artists.items():
                            if k in bb_track_titles:
                                found_in_bb = True
                                data['artists'].add(bb_artists[k])
                                data['years'].add(bb_songs[k][0])
                                data['titles'].add(bb_track_titles[k])

                        for k, v in artists.items():
                            if k in track_titles:
                                if not found_in_bb:
                                    data['artists'].add(artists[k])
                                    data['titles'].add(track_titles[k])

                        year_search = re.findall(' (\d{4}) ', raw_text)
                        if len(year_search) > 0:
                            data['years'] |= set([int(y) for y in year_search if int(y) > 1800 and int(y) < 2017])
                        try:
                            new_data = {}
                            for k, v in data.items():
                                if isinstance(v, set):
                                    new_data[k] = list(v)
                                else:
                                    new_data[k] = v
                            obj_id = str(db.midi_files.insert(new_data))
                            file_upload_count += 1
                            print('Added', f, 'to database')
                        except Exception as e:
                            print('Error adding data to db')
                            print(e)
            except Exception as e:
                print('Could not open file', f)
                print(e)

