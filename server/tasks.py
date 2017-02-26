import sys
import argparse

if __name__ == '__main__':

    MIDI_TO_DB = 'midi-to-db'
    MIDI_TO_TFIDF = 'midi-to-tfidf'

    tasks = [
        MIDI_TO_DB, 
        MIDI_TO_TFIDF
    ]

    parser = argparse.ArgumentParser()
    parser.add_argument('-t', 
        dest='task', 
        choices=tasks, 
        help='Specify the task to run')

    parser.add_argument('-d', 
        dest = 'destination', 
        default='/', 
        help='The destination of file output')

    parser.add_argument('-s', 
        dest='source',
        default='./',
        help='The source directory to load files from')

    args = parser.parse_args()
    if args.task == MIDI_TO_TFIDF:
        import meter.tasks.midi_to_tfidf as tfidf
        tfidf.run(args.destination) 

    if args.task == MIDI_TO_DB:
        import meter.tasks.midi_to_db as midi_to_db
        midi_to_db.run(args.source, './meter/ml/data')
