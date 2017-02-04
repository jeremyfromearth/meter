from flask import Flask
app = Flask(__name__)
app.config.from_object('config')

# serves static files from static folder
if app.config['DEBUG']:
    import os
    from werkzeug import SharedDataMiddleware
    app.wsgi_app = SharedDataMiddleware(app.wsgi_app, {
        '/' : os.path.join(os.path.dirname(__file__), 'static')})

@app.route('/')
def index():
    return app.send_static_file('build/index.html')
