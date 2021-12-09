// @ts-ignore
const { Op } = require('sequelize');
const Sequelize = require('sequelize')
// @ts-ignore
const { User, Profession, Professional,ProfessionalOffer, ClientNeed, SpecificTechnicalActivity,Transactions } = require('../db.js')

module.exports ={
    newUser : async (req, res) => {
        const { 
            userName, 
            firstName, 
            lastName, 
            email, 
            phone, 
            city, 
            state, 
            photo, 
            dniFront, 
            dniBack, 
            password, 
            verified, 
            professional,
            certification_name,
            certification_img,status, 
            profession  
        } = req.body;
        try {
            let newUser = await User.create({ 
            user_name: userName,
            first_name : firstName,
            last_name: lastName,
            email,
            phone,
            city,
            state,
            photo,
            dni_front:dniFront,
            dni_back:dniBack, 
            password,
            verified,
            professional,
        })
        
        if(professional === 'true') {
            let newProfessional = await Professional.create({ 
                certification_name:certification_name,
                certification_img:certification_img,
                status,
            })

            let professions = profession
            if(typeof professions === 'string'){
                professions = professions.split(',');
            }
    
            const allProfessions = await Profession.findAll({ 
                where:{
                    name: {
                        [Op.in]: Array.isArray(professions) ? professions : [professions]
                    }
                }
            })  
            
                await newProfessional.setProfessions( allProfessions );
                await newUser.setProfessional( newProfessional )
        }
        res.status(200).send('User Created!') 
        } catch (error) {
            res.status(400).send(error.message);
        }
    },

    newSpecificalNeed : async (req, res) => {
        const {name, description, status, location, UserId} = req.body
        try {
            const newNeed = await ClientNeed.create({
                name,
                description,
                status,
                location
            })
    
            let allUsers = await User.findAll({
                where :{
                    id : UserId
                }
            })
            await newNeed.setUser(allUsers[0])
            res.status(200).send(allUsers)

        } catch (error) {
            res.status(400).send(error.message);
        }
    },

    newTechnicalActivity: async (req, res) => {
        const { professionalId ,name, price, photo, materials, decription, guarantee_time } = req.body
        try {
            let activityFromProfession = await SpecificTechnicalActivity.create({
                name,
                price,
                photo,
                materials,
                decription,
                guarantee_time
            })
            
            let professional = await Professional.findAll({
                where: { id: professionalId }
            })
            await activityFromProfession.setProfessional(professional[0])
            res.status(200).send(professional)
        } catch (error) {
            res.status(400).send(error.message);
        }
    },
    //COMENTAR QUE SE REQUIERE INPUT DIRECTO DE IDS DE USUARIOS 
    newTransaction : async (req, res) => {
        const {id} = req.body
        try {
            let newTransaction = await Transactions.create({
                id
            })
            res.status(200).send(newTransaction)

        } catch (error) {
            res.status(400).send(error.message)
        }
        
    },
    newProfessionalOffer : async (req, res) => {
        const {description, price, duration, materials, guarantee_time, professionalId} = req.body
        try {
            const newOffert = await ProfessionalOffer.create({
                description,
                price,
                duration,
                materials,
                guarantee_time
            })
            let offert = await Professional.findAll({
                where: { id: professionalId }
            })
            await newOffert.setProfessional(offert[0])
            res.status(200).send(newOffert)
            
        } catch (error) {
            res.status(400).send(error.message)
        }
        
    },
    getAllUsers: async (req, res) =>{ 
        try {
            const users = await User.findAll({
                include: [{ model:Professional }]
            })
            res.status(200).send(users)
            
        } catch (error) {
            res.status(400).send(error.message)
        }
    },
    getAllProfessionals: async (req, res) =>{ 
        try {
            const professionals = await User.findAll({
                where:{
                    professional: true,                  
                },
                include: [{ model: Professional, include:[{model:Profession}]}],
            })
            res.status(200).send(professionals)
            
        } catch (error) {
            res.status(400).send(error.message)
        }
    },
    getAllCommonUsers: async (req, res) => {
        try {
            const commonUsers = await User.findAll({
                where:{
                    professional: false,                  
                },
                include: [{ model: ClientNeed }],
            })
            res.status(200).send(commonUsers)
            
        } catch (error) {
            res.status(400).send(error.message)
        }
    },
    getByUserId : async (req, res) => {
        try {
            const id = req.params.id;
            let user = await User.findAll({
                where: { id: { [Op.eq]: id } }
            })
            if(user[0].dataValues.professional === true) {
                user = await User.findAll({
                    where: { id: { [Op.eq]: id } },
                    include: [{ model: Professional, include:[{model:Profession}]}],
                })
            }
            res.status(200).send(user)
            
        } catch (error) {
            res.status(400).send(error.message)
        }
    },
    getUserByActivityName: async (req, res) =>{
        try {
            const activities = await SpecificTechnicalActivity.findAll({ 
                include:[{ 
                    model: Professional, include:[{model:Profession}]
                }],
                where: {name:{ [Sequelize.Op.iLike]: `%${req.body.name}%`}}
            })
            const ids = await activities.map(e => e.Professional.UserId
                
            )
            let uniqueArr = [...new Set(ids)]
            let arrUsers = []
            for(let i= 0; i < uniqueArr.length; i++){
                arrUsers.push(await User.findAll({
                    where: {id: uniqueArr[i]}
                }))
            }
            res.status(200).send(arrUsers)
            
        } catch (error) {
            res.status(400).send(error.message)
        }
    },
    getAllActivities: async (req, res) =>{
        try {
            const activities = await SpecificTechnicalActivity.findAll({ 
                include:[{ 
                    model: Professional, include:[{model:Profession}]
                }],
            })
            res.status(200).send(activities)
            
        } catch (error) {
            res.status(400).send(error.message)
        }
    },
    getByActivityName: async (req, res) =>{
        try {
            const activities = await SpecificTechnicalActivity.findAll({ 
                include:[{ 
                    model: Professional, include:[{model:Profession}]
                }],
                where: {name:{ [Sequelize.Op.iLike]: `%${req.body.name}%`}}
            })
            res.status(200).send(activities)
            
        } catch (error) {
            res.status(400).send(error.message)
        }
    },
    getAllNeeds : async (req, res) => {
        try {
            const needs = await ClientNeed.findAll({
                include: [{ model:User },{ model: ProfessionalOffer} ],
            })
            res.status(200).send(needs)
            
        } catch (error) {
            res.status(400).send(error.message)
        }
    },
}

