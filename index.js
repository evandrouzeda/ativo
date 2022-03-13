const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Mongodb = require('./config/mongodb')
const { ObjectId } = require('mongodb')
require('dotenv').config()
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())



const mongodb = new Mongodb()
const getAtivos = async (request, response, next) => {
    const { userid } = request.query
    const db = await mongodb.getDB()
    db.collection("Ativos").find({ usuario: new ObjectId(userid) }).toArray()
        .then(result => response.status(200).json(result))
        .catch(error => response.status(401).json({status: 'error', message: 'Erro: ' + error}))
}

const addAtivo = async (request, response, next) => {
    const { userid } = request.query
    const ativo = request.body
    ativo.usuario = new ObjectId(userid)
    ativo.carteira = ativo.carteira ? new ObjectId(ativo.carteira) : ""
    const db = await mongodb.getDB()
    db.collection("Ativos").insertOne(ativo)
        .then(result => response.status(201).json({ status: 'success', result}))
        .catch(error => response.status(401).json({ status: 'error', message: 'Erro: ' + error }))
}

const updateAtivo = async (request, response, next) => {
    const { userid } = request.query
    const ativo = request.body
    const filter = { 
        _id: new ObjectId(ativo._id),
        usuario: new ObjectId(userid)
    }
    delete ativo._id
    delete ativo.usuario
    const db = await mongodb.getDB()
    ativo.carteira = ativo.carteira ? new ObjectId(ativo.carteira) : ""
    db.collection("Ativos").updateOne(filter, {$set: ativo})
        .then(result => response.status(201).json({ status: 'success', message: 'Ativo atualizada.' }))
        .catch(error => response.status(401).json({ status: 'error', message: 'Erro: ' + error }))
}

const deleteAtivo = async (request, response, next) => {
    const { userid } = request.query
    const query = { 
        _id: new ObjectId(request.params.id),
        usuario: new ObjectId(userid)
    }
    const db = await mongodb.getDB()
    db.collection("Ativos").deleteOne(query)
        .then(result => response.status(201).json({ status: 'success', message: 'Ativo removida.' }))
        .catch(error => response.status(401).json({ status: 'error', message: 'Erro: ' + error }))
}

const getAtivoPorID = async (request, response, next) => {
    const { userid } = request.query
    const query = { 
        _id: new ObjectId(request.params.id),
        usuario: new ObjectId(userid)
    }
    const db = await mongodb.getDB()
    db.collection("Ativos").findOne(query)
        .then(result => response.status(201).json(result))
        .catch(error => response.status(401).json({ status: 'error', message: 'Erro: ' + error }))
}

app
    .route('/ativo')
    // GET endpoint
    .get(getAtivos)
    // POST endpoint
    .post(addAtivo)
    // PUT
    .put(updateAtivo)  

app.route('/ativo/:id')
    .get(getAtivoPorID) 
    .delete(deleteAtivo) 


// Start server
app.listen(process.env.PORT || 5000, () => {
    console.log(`Servidor rodando nas porta 5000`)
})