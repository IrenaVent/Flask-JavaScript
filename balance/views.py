from flask import jsonify, render_template, request
from balance import app
from balance.models import DBManager

dbManager = DBManager("data/movimientos.db")

@app.route("/")
def inicio():
    return render_template("index.html")

@app.route("/api/v1.0/movimientos")
def lista_movimientos():
    movimientos = dbManager.consultaSQL("select * from movimientos order by fecha;")

    resultados = {
        "status": "success",
        "movimientos": movimientos
    }

    return jsonify(resultados)


@app.route("/api/v1.0/movimiento", methods=["POST"])
def modifica_movimiento():
    consulta = "INSERT INTO movimientos (fecha, concepto, ingreso_gasto, cantidad) values (:fecha, :concepto, :ingreso_gasto, :cantidad)"

    dbManager.modificaSQL(consulta, request.json)

    return jsonify({"status": "success"})