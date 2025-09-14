from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Cliente(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cedula = db.Column(db.String(20), unique=True, nullable=False)
    nombres = db.Column(db.String(100), nullable=False)
    apellidos = db.Column(db.String(100), nullable=False)
    direccion = db.Column(db.String(200))
    telefono = db.Column(db.String(20))
    porcinos = db.relationship("Porcino", backref="cliente", lazy=True)

class Porcino(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    identificacion = db.Column(db.String(20), unique=True, nullable=False)
    raza = db.Column(db.String(50), nullable=False)
    edad = db.Column(db.Integer)
    peso = db.Column(db.Float)
    alimentacion = db.Column(db.String(200))
    cliente_id = db.Column(db.Integer, db.ForeignKey("cliente.id"), nullable=False)

class Alimentacion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    descripcion = db.Column(db.String(200), nullable=False)
    dosis = db.Column(db.String(100), nullable=False)
