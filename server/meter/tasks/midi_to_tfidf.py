def run(dest, sample_rate = 1.0):
    import pickle
    import numpy as np
    from math import log
    from random import random
    from pymongo import MongoClient
    from pandas import DataFrame, Series
    from meter.ml.tfidf import TermFreqInverseDocFreq

    client = MongoClient('localhost', 27017)
    db = client.meter

    i = 0
    tfidf_data = {}
    sample_rate = sample_rate
    count = db.midi_files.count()
    for f in db.midi_files.find({}, {'checksum' : 1, 'raw_text': 1, 'filename': 1}):
        i += 1
        if 'checksum' in f:
            tfidf_data[f['checksum']] = f
            print('\r', 'Processing {} of {} files'.format(i, count), end='')
        else:
            print('ERROR: Checksum not found for {}'.format(f))

    df = DataFrame.from_dict(tfidf_data, orient='index')
    tfidf = TermFreqInverseDocFreq()
    tfidf.create(df, 'raw_text', True)
    print('\nTFIDF Complete')
    print('Starting rank operation')

    i = 1
    checksums= list(tfidf.doc_id_to_index.keys())
    for checksum in checksums:
        print('\r', 'Processing {} of {} files'.format(i, count), end='')
        i += 1
        scores = {}
        terms = tfidf.get_sorted_terms_for_document(checksum).to_dict()
        for k, v in terms.items():
            if len(k) > 1 and v > 0.0:
                scores[k] =  {'tfidf': v, 'rank': np.log(len(k)) * v}
        db.midi_files.update({'checksum': checksum}, {'$set' : {'scores' : scores}}, upsert=False)
