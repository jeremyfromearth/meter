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
    query = request.json
    results_per_request = 100
    keywords = [s.strip().lower() for s in query['keywords']]
    db_query = {'keywords' : {'$all': keywords}}
    query_result = mongo.db.midi_files.find(db_query, {'filename': 1, 'checksum': 1, 'scores' : 1})

    results = []
    for record in query_result:
        rank = 0
        for w in keywords:
            if 'scores' in record and w in record['scores']:
                rank += record['scores'][w]['rank']
        results.append({'filename' : record['filename'], 'rank': rank})
    results = sorted(results, key=lambda k : k['rank'], reverse=True)[:results_per_request]
    return jsonify(results)
