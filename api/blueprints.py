from datetime import datetime
from flask import Blueprint, jsonify, request

from werkzeug.security import generate_password_hash, check_password_hash
from .models import Todo, User, db
from .utils import todo_serializer, generate_response

todos = Blueprint("todos", __name__)


@todos.route("/todos/", methods=["GET"])
def list_all_todos():
    return jsonify([*map(todo_serializer, Todo.query.all())])


@todos.route("/todos/<int:todo_id>", methods=["GET"])
def list_todo(todo_id):
    todo = Todo.query.filter_by(id=todo_id).first()
    if not todo:
        return generate_response(404, "Task not found.")

    return jsonify(todo_serializer(todo))


@todos.route("/todos/", methods=["POST"])
def add_todo():
    post_data = request.get_json()
    if not post_data:
        return generate_response(400, "Invalid payload.")

    task = post_data.get("task")
    todo = Todo(task=task, created_on=datetime.utcnow(), updated_on=datetime.utcnow())
    db.session.add(todo)
    db.session.commit()

    return generate_response(201, "Task added.", todo_serializer(todo))


@todos.route("/todos/<int:todo_id>", methods=["PUT"])
def update_todo(todo_id):
    todo = Todo.query.filter_by(id=todo_id).first()
    if not todo:
        return generate_response(404, "Task not found.")

    post_data = request.get_json()
    if not post_data:
        return generate_response(400, "Invalid payload.")

    todo.done = post_data.get("done")
    todo.task = post_data.get("task")
    todo.updated_on = datetime.utcnow()
    db.session.commit()

    return generate_response(200, "Task updated.", todo_serializer(todo))


@todos.route("/todos/<int:todo_id>", methods=["DELETE"])
def delete_todo(todo_id):
    todo = Todo.query.filter_by(id=todo_id).first()
    if not todo:
        return generate_response(404, "Task not found.")

    db.session.delete(todo)
    db.session.commit()
    return generate_response(200, "Task deleted.")


@todos.route("/login", methods=["POST"])
def login():
    post_data = request.get_json()
    if not post_data:
        return generate_response(400, "Invalid payload.")

    username = post_data.get("username")
    password = post_data.get("password")
    user = User.query.filter_by(username=username).first()

    if not user or not check_password_hash(user.password, password):
        return generate_response(401, "Invalid username or password")

    return generate_response(200, "Logged in successfully.")


@todos.route("/signup", methods=["POST"])
def signup():
    post_data = request.get_json()
    if not post_data:
        return generate_response(400, "Invalid payload.")

    username = post_data.get("username")
    password = post_data.get("password")

    # Check if user with same username already exists
    if User.query.filter_by(username=username).first():
        return generate_response(409, "User already exists with this username.")

    user = User(
        username=username,
        password=generate_password_hash(password),
        created_on=datetime.utcnow(),
        updated_on=datetime.utcnow(),
    )

    db.session.add(user)
    db.session.commit()

    return generate_response(201, "User created successfully.")


@todos.route("/logout", methods=["POST"])
def logout():
    print("logout")
    return generate_response(200, "Logged out successfully.")
