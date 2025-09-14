from flask import Flask, render_template, request, redirect, url_for
from models import db, Cliente, Porcino, Alimentacion

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///granja.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route("/")
def index():
    return render_template("index.html")

#CRUD CLIENTES
@app.route("/clientes")
def clientes():
    lista = Cliente.query.all()
    return render_template("clientes.html", clientes=lista)

@app.route("/clientes/nuevo", methods=["GET", "POST"])
def nuevo_cliente():
    if request.method == "POST":
        c = Cliente(
            cedula=request.form["cedula"],
            nombres=request.form["nombres"],
            apellidos=request.form["apellidos"],
            direccion=request.form["direccion"],
            telefono=request.form["telefono"]
        )
        db.session.add(c)
        db.session.commit()
        return redirect(url_for("clientes"))
    return render_template("nuevo_cliente.html")

@app.route("/clientes/eliminar/<int:id>")
def eliminar_cliente(id):
    c = Cliente.query.get(id)
    db.session.delete(c)
    db.session.commit()
    return redirect(url_for("clientes"))

#CRUD PORCINOS
@app.route("/porcinos")
def porcinos():
    lista = Porcino.query.all()
    return render_template("porcinos.html", porcinos=lista)

@app.route("/porcinos/nuevo", methods=["GET", "POST"])
def nuevo_porcino():
    if request.method == "POST":
        p = Porcino(
            identificacion=request.form["identificacion"],
            raza=request.form["raza"],
            edad=request.form["edad"],
            peso=request.form["peso"],
            alimentacion=request.form["alimentacion"],
            cliente_id=request.form["cliente_id"]
        )
        db.session.add(p)
        db.session.commit()
        return redirect(url_for("porcinos"))
    clientes = Cliente.query.all()
    return render_template("nuevo_porcino.html", clientes=clientes)

@app.route("/porcinos/eliminar/<int:id>")
def eliminar_porcino(id):
    p = Porcino.query.get(id)
    db.session.delete(p)
    db.session.commit()
    return redirect(url_for("porcinos"))

#CRUD ALIMENTACION
@app.route("/alimentaciones")
def alimentaciones():
    lista = Alimentacion.query.all()
    return render_template("alimentaciones.html", alimentaciones=lista)

@app.route("/alimentaciones/nuevo", methods=["GET", "POST"])
def nuevo_alimentacion():
    if request.method == "POST":
        a = Alimentacion(
            descripcion=request.form["descripcion"],
            dosis=request.form["dosis"]
        )
        db.session.add(a)
        db.session.commit()
        return redirect(url_for("alimentaciones"))
    return render_template("nuevo_alimentacion.html")

@app.route("/alimentaciones/eliminar/<int:id>")
def eliminar_alimentacion(id):
    a = Alimentacion.query.get(id)
    db.session.delete(a)
    db.session.commit()
    return redirect(url_for("alimentaciones"))

#REPORTE
@app.route("/reporte")
def reporte():
    porcinos = Porcino.query.all()
    return render_template("reporte.html", porcinos=porcinos)

if __name__ == "__main__":
    app.run(debug=True)
