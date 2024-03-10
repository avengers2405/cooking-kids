import express from "express";
import { userData } from "../models/model0.js";

const router = express.Router();

//creates a book as in post form
router.post('/', async (request, response) => { 
    try{
        console.log(request);
        console.log(request.body);
        if (!request.body.name || !request.body.rating || !request.body.rank || !request.body.problemsSolved){
            return response.status(400).send({ message: "Send all required fields!"});
        } else {
            const newUser = {
                name: request.body.name,
                rating: request.body.rating,
                rank: request.body.rank,
                problemsSolved: request.body.problemsSolved,
            };
            const user0 = await userData.create(newUser);
            console.log(`here, ${user0}`);
            return response.status(201).send(user0);
        }
    }catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

//gets all books
router.get('/', async (request, response) => {
    try{
        const users = await userData.find({});
        return response.status(200).json({
            count: users.length,
            data: users
        });
    }catch{
        console.log(error.message);
        response.status('500').send({message: error.message});
    }
});

//gets only a particular book by id
router.get('/:id', async (request, response) => {
    try{
        const {id} = request.params;
        const users = await userData.findById(id);
        return response.status(200).json({
            count: users.length,
            data: users
        });
    }catch{
        console.log(error.message);
        response.status('500').send({message: error.message});
    }
});

// updates a particular book by id
router.put('/:id', async (request, response) => {
    try{
        const {id} = request.params;
        const users = await userData.findByIdAndUpdate(id, request.body);
        return response.status(200).json({
            count: users.length,
            data: users
        });
    }catch{
        console.log(error.message);
        response.status('500').send({message: error.message});
    }
});

// deletes a book of the id
router.delete('/:id', async (request, response) => {
    try{
        const {id} = request.params;
        const users = await userData.findByIdAndDelete(id);
        return response.status(200).json({
            count: users.length,
            data: users
        });
    }catch{
        console.log(error.message);
        response.status('500').send({message: error.message});
    }
});

export default router;