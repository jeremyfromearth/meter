from flask import Flask
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
    return app.send_static_file('build/index.html')

@app.route('/file-search/')
def file_listing(endpoint):
    '''
    Request data format:
    #root
    {"path": ""}
    {"path": "classical/baroque/"
    {"path": "pop/beatles/white-album/"}
    '''
    pass
