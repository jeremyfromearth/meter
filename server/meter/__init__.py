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

@app.route('/search/', methods=['GET'])
def search():
    print(request.headers)
    return jsonify({'data': 'here'})
    '''
    search_filters = request.headers[search]

    search:
        artist: true
        composers: true
        albums: true
        song_title: true
        genres: []
        date-range: (a, b)
    pass
    '''
