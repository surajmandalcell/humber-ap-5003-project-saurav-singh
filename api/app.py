import os
from flask import Flask, jsonify
from .config import config
from .models import db
from .blueprints import todos
from .utils import generate_response

app = Flask(__name__)

env_config = os.getenv("FLASK_CONFIG", "dev")

app.config.from_object(config[env_config])
db.init_app(app)

with app.app_context():
    db.create_all()


@app.route("/")
def index():
    return jsonify({"message": "Welcome to the Flask-React Todo App."})


@app.errorhandler(404)
def not_found(e):
    return generate_response(404, "Resource not found.")


@app.errorhandler(400)
def bad_request(e):
    return generate_response(400, "Bad request.")


app.register_blueprint(todos)

if __name__ == "__main__":
    app.run(host="0.0.0.0")
