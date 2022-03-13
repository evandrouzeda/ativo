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
    const db = await mongodb.getDB()
    db.collection("Ativos").find({}).toArray()
        .then(result => response.status(200).json(result))
        .catch(error => response.status(401).json({status: 'error', message: 'Erro: ' + error}))
}

const addAtivo = async (request, response, next) => {
    const db = await mongodb.getDB()
    db.collection("Ativos").insertOne(request.body)
        .then(result => response.status(201).json({ status: 'success', result}))
        .catch(error => response.status(401).json({ status: 'error', message: 'Erro: ' + error }))
}

const updateAtivo = async (request, response, next) => {
    const { _id, nome } = request.body
    const db = await mongodb.getDB()
    db.collection("Ativos").updateOne({_id: new ObjectId(_id)}, {$set: {nome}})
        .then(result => response.status(201).json({ status: 'success', message: 'Ativo atualizada.' }))
        .catch(error => response.status(401).json({ status: 'error', message: 'Erro: ' + error }))
}

const deleteAtivo = async (request, response, next) => {
    const db = await mongodb.getDB()
    db.collection("Ativos").deleteOne({_id: new ObjectId(request.params.id)})
        .then(result => response.status(201).json({ status: 'success', message: 'Ativo removida.' }))
        .catch(error => response.status(401).json({ status: 'error', message: 'Erro: ' + error }))
}

const getAtivoPorID = async (request, response, next) => {
    const db = await mongodb.getDB()
    db.collection("Ativos").findOne({_id: new ObjectId(request.params.id)})
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