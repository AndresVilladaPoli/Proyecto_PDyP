import strawberry
from typing import List
from models import db, Cliente, Porcino, Alimentacion

#TYPES
@strawberry.type
class ClienteType:
    id: int
    cedula: str
    nombres: str
    apellidos: str
    direccion: str
    telefono: str

@strawberry.type
class PorcinoType:
    id: int
    identificacion: str
    raza: str
    edad: int
    peso: float
    alimentacion: str
    cliente_id: int

@strawberry.type
class AlimentacionType:
    id: int
    descripcion: str
    dosis: str


#QUERIES
@strawberry.type
class Query:
    @strawberry.field
    def clientes(self) -> List[ClienteType]:
        return Cliente.query.all()

    @strawberry.field
    def porcinos(self) -> List[PorcinoType]:
        return Porcino.query.all()

    @strawberry.field
    def alimentaciones(self) -> List[AlimentacionType]:
        return Alimentacion.query.all()


#MUTATIONS
@strawberry.type
class Mutation:
    @strawberry.mutation
    def crear_cliente(self, cedula: str, nombres: str, apellidos: str, direccion: str, telefono: str) -> ClienteType:
        cliente = Cliente(
            cedula=cedula,
            nombres=nombres,
            apellidos=apellidos,
            direccion=direccion,
            telefono=telefono,
        )
        db.session.add(cliente)
        db.session.commit()
        return cliente

    @strawberry.mutation
    def crear_porcino(self, identificacion: str, raza: str, edad: int, peso: float, alimentacion: str, cliente_id: int) -> PorcinoType:
        porcino = Porcino(
            identificacion=identificacion,
            raza=raza,
            edad=edad,
            peso=peso,
            alimentacion=alimentacion,
            cliente_id=cliente_id,
        )
        db.session.add(porcino)
        db.session.commit()
        return porcino

    @strawberry.mutation
    def crear_alimentacion(self, descripcion: str, dosis: str) -> AlimentacionType:
        alim = Alimentacion(
            descripcion=descripcion,
            dosis=dosis
        )
        db.session.add(alim)
        db.session.commit()
        return alim


#SCHEMA FINAL
schema = strawberry.Schema(query=Query, mutation=Mutation)