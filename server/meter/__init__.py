import json
from bson.json_util import loads, dumps
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config.from_object('config')
mongo = PyMongo(app)

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
    print('returning index.html')
    return app.send_static_file('build/index.html')

@app.route('/search', methods=['POST'])
def search():
    db_query = {}
    query = request.json
    results_per_request = 100
    if 'results_per_request' in query:
        results_per_request = query['results_per_request']

    for k, v in query.items():
        if isinstance(v, list) and len(v) > 0:
            db_query[k] = {'$in': v}
        if isinstance(v, str) and v is not '':
            db_query[k] = v
        if isinstance(v, float):
            db_query[k] = {'$gt' : v}

    print(db_query)

    results = []
    if len(query.keys()):
        query_result = mongo.db.midi_files.find(db_query).limit(results_per_request)
        for record in query_result:
            results.append(json.loads(dumps(record)))

    print('Number of results:', len(results))
        
    return jsonify(results)
