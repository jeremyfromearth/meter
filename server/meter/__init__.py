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
            t = [s.lower().strip() for s in v]
            db_query[k] = {'$in': t}
            terms += t 
        if isinstance(v, str) and v is not '':
            db_query[k] = v.lower()
            terms.append(db_query[k])
        if isinstance(v, float) or isinstance(v, int):
            db_query[k] = {'$lt' : v}

    results = []
    if len(terms):
        query_result = mongo.db.midi_files.find(db_query, {'filename': 1, 'checksum': 1})
        for record in query_result:
            results.append(json.loads(dumps(record)))

    print('Number of results:', len(results), 'for terms', terms)
        
    return jsonify(results)
