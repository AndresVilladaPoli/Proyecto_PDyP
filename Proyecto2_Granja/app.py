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

@app.route("/clientes/<int:id>/editar", methods=["GET", "POST"])
def editar_cliente(id):
    cliente = Cliente.query.get_or_404(id)
    if request.method == "POST":
        cliente.cedula = request.form["cedula"]
        cliente.nombres = request.form["nombres"]
        cliente.apellidos = request.form["apellidos"]
        cliente.direccion = request.form["direccion"]
        cliente.telefono = request.form["telefono"]
        db.session.commit()
        return redirect(url_for("clientes"))
    return render_template("editar_cliente.html", cliente=cliente)

@app.route("/clientes/<int:id>")
def ver_cliente(id):
    cliente = Cliente.query.get_or_404(id)
    return render_template("ver_cliente.html", cliente=cliente)

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

@app.route("/porcinos/<int:id>/editar", methods=["GET", "POST"])
def editar_porcino(id):
    porcino = Porcino.query.get_or_404(id)
    clientes = Cliente.query.all()
    alimentaciones = Alimentacion.query.all()
    if request.method == "POST":
        porcino.identificacion = request.form['identificacion']
        porcino.raza = request.form['raza']
        porcino.edad = int(request.form.get('edad') or 0)
        porcino.peso = float(request.form.get('peso') or 0)
        porcino.alimentacion = request.form.get('alimentacion')
        porcino.cliente_id = int(request.form.get('cliente_id'))
        db.session.commit()
        return redirect(url_for("porcinos"))
    return render_template("editar_porcino.html", porcino=porcino, clientes=clientes, alimentaciones=alimentaciones)

@app.route("/porcinos/<int:id>")
def ver_porcino(id):
    porcino = Porcino.query.get_or_404(id)
    return render_template("ver_porcino.html", porcino=porcino)

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

@app.route("/alimentaciones/<int:id>/editar", methods=["GET", "POST"])
def editar_alimentacion(id):
    a = Alimentacion.query.get_or_404(id)
    if request.method == "POST":
        a.descripcion = request.form['descripcion']
        a.dosis = request.form['dosis']
        db.session.commit()
        return redirect(url_for("alimentaciones"))
    return render_template("editar_alimentacion.html", alimentacion=a)

@app.route("/alimentaciones/<int:id>")
def ver_alimentacion(id):
    a = Alimentacion.query.get_or_404(id)
    return render_template("ver_alimentacion.html", alimentacion=a)

#REPORTE
@app.route("/reporte")
def reporte():
    porcinos = Porcino.query.all()
    return render_template("reporte.html", porcinos=porcinos)

if __name__ == "__main__":
    app.run(debug=True)
