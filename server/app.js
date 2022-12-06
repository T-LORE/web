const express = require('express');
const { Sequelize, DataTypes, Model } = require('sequelize');
const validator = require('validator').default
const cors = require('cors')
const app = express();
const { createToken, verifyToken, createPasswordHash, comparePassword } = require('./auth-service')

const sequelize = new Sequelize('admin_info', 'user', '12345', {
    host: 'localhost',
    dialect: 'mysql' 
  });


class Info extends Model {}
class Admin extends Model {}

function stringType() {
    return {
        type: DataTypes.STRING,
        allowNull: false
    }
}

Info.init({
    fio:stringType(),
    phone:stringType(),
    email:stringType()
       
}, {
    modelName: 'Info',
    sequelize
})


Admin.init({
    name: stringType(),
    password: stringType()
}, {
    modelName: 'Admin',
    sequelize
})

start()

async function start(){
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        console.log('connected to database')
        startApp()
    } catch (error) {
        console.error(error)
    }
}

function startApp() {

    app.use(cors())

    app.use(express.json())

    app.get('/', function(req, res){
        res.send('Hello from expasdasdress')
        console.log()

    })

    app.post('/api/admin', async function(req, res){
        const passwordHash = createPasswordHash(req.body.password)
        
        const neAdmin = await Admin.create({
            name: req.body.name,
            password: passwordHash
        })
    })
    

    app.post('/api/info',  async function(req, res){
        const info = req.body
        let validationError = []
        if (!validator.isMobilePhone(info.phone.replace(/\D/g, ''), ['ru-RU'])){
            validationError.push('Wrong phone number')
        }
        if(!validator.isEmail(info.email, ['ru-RU'])){
            validationError.push('Wrong email')
        }
        if(!validator.isLength(info.fio, {min: 4, max: 80})){
            validationError.push('Wrong fio')
        }

        if (validationError.length){
            res.status(400).send({message: validationError})
        } else {
            const infoFromDB = await Info.create(info)
            res.send(infoFromDB)
        }
        
            console.log('sent')
        
    })

    app.get('/api/info', verifyToken, async function(req, res){
        const orders = await Info.findAll()
        res.send(orders)
    })

    app.post('/api/login',async function(req, res){
        const userFromDB = await Admin.findOne({where: {name: req.body.name}})
        if (comparePassword(req.body.password, userFromDB.password)) {
            const token = createToken(userFromDB)
            res.send({
                token
            })
        } else {
            res.status(403).send({
                message: 'Wrong password'
            })
        }
        
    })

    app.listen(3000, function(){
        console.log('server started http://localhost:3000')
        console.log('listen')
    })
}

