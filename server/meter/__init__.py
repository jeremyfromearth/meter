import json
from bson.json_util import loads, dumps
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from meter.ml.tfidf import TermFreqInverseDocFreq

app = Flask(__name__) 
app.config.from_object('config')
mongo = PyMongo(app)
midi_tfidf = TermFreqInverseDocFreq()
midi_tfidf.load('./meter/resources/midi-tfidf.pkl')

# TODO: figure out approach for serving static files in production
# serve static files in debug mode using flask
if app.config['DEBUG']:
    import os
    from werkzeug import SharedDataMiddleware
    app.wsgi_app = SharedDataMiddleware(app.wsgi_app, {
      '/': os.path.join(os.path.dirname(__file__), 'static', 'build')
    })

@app.route('/')
def index():
    return app.send_static_file('build/index.html')

@app.route('/search', methods=['POST'])
def search():
    db_query = {}
    query = request.json
    results_per_request = 100
    if 'results_per_request' in query:
        results_per_request = query['results_per_request']

    terms = []
    for k, v in query.items():
        if isinstance(v, list) and len(v) > 0:
            db_query[k] = {'$in': v}
            terms += v
        if isinstance(v, str) and v is not '':
            db_query[k] = v
            terms.append(v)
        if isinstance(v, float):
            db_query[k] = {'$gt' : v}

    results = []
    if len(terms):
        query_result = mongo.db.midi_files.find(db_query, {'filename': 1, 'checksum': 1})
        for record in query_result:
            results.append(json.loads(dumps(record)))
    else:
        print('No terms, returning empty list')

    '''
    count = 0
    for result in results:
        #tfidf = midi_tfidf.get_sorted_terms_for_document(result['filename'])
        count+=1 
    '''

    print('Number of results:', len(results))
        
    return jsonify(results)
