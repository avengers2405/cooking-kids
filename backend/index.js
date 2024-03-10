// start of our project

import express from "express"; //we need express.js so import it
import {PORT, mongoDBURL} from "./config.js"; //importing from config.js
//importing as many exports as we want seperated by comma
import mongoose from 'mongoose';
// import {userData} from './models/model0.js';
import routesBasic from './routes/routesBasic.js';
import cors from "cors";
// const routesBasic = require('./routes/routesBasic.js');
const app = express();

//for parsing data, or requests wont work
app.use(express.json());

app.use('/record', routesBasic);

app.use(cors({
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
})); 
// leave cors() empty to allow all websites all methods
// this is custom origin

//make it listen to a port
//we seperate code into diff files and folders.
//so diff files for things (idk why the shit tho fuck js for the sake of my life)

// creating a function to listen to the port

app.listen(PORT, () => {
    console.log(`App is listening to port: ${PORT}`);
});  

// till here, we will get cannot get '/'
// this is bcz default route to server is '/', and we have not yet handled it
// so we will make it

// app.get('/', (request, response)=> {
//     console.log(request);
//     console.log(response);
//     //we can send 1) status msg 2) msg with thte response, as follows
//     return response.status(244).send('Full stack journey !!');
// }); //get is method used to get resource from server, other methods also exist
// // the first param is string for route, the second param is callback function that handles the request

// to store a new book, we generally use post method
// get request doesnt have a body. it's url params go to 
// 'query', so access usingthat somehow not body.
// this is post bcz data is wanted to be secure.
// app.post('/record', async (request, response) => { //async can be used bcz post methods are asynchronous
//     try{
//         console.log(request);
//         console.log(request.body);
//         //check if all fields are filled for the book data that needs to be entered
//         // console.log("Pre processing");
//         if (!request.body.name || !request.body.rating || !request.body.rank || !request.body.problemsSolved){
//             // console.log("Pre processing1.1");
//             return response.status(400).send({ message: "Send all required fields!"});
//         } else {
//             // console.log("Pre processing2.1");
//             const newUser = {
//                 name: request.body.name,
//                 rating: request.body.rating,
//                 rank: request.body.rank,
//                 problemsSolved: request.body.problemsSolved,
//             };
//             const user0 = await userData.create(newUser);
//             console.log(`here, ${user0}`);
//             return response.status(201).send(user0);
//         }
//     }catch (error) { //here async is used for asynchronous operation so try-catch block is used
//         // console.log("Pre processing3.1");
//         console.log(error.message);
//         response.status(500).send({message: error.message});
//     }
// });

// //getting records from db
// app.get('/record', async (request, response) => {
//     try{
//         const users = await userData.find({});
//         return response.status(200).json({
//             count: users.length,
//             data: users
//         });  //json format return, count key and data, defined by us completely
//     }catch{
//         console.log(error.message);
//         response.status('500').send({message: error.message});
//     }
// });

// //getting record by id
// // since this is a get request, info is sent and recieved through url
// // id is sent as /record/<id>
// // app.get('/record/:id', async (request, response) => {
// //     try{
// //         const {id} = request.params;
// //         const users = await userData.findById(id);
// //         return response.status(200).json({
// //             count: users.length,
// //             data: users
// //         });  //json format return, count key and data, defined by us completely
// //     }catch{
// //         console.log(error.message);
// //         response.status('500').send({message: error.message});
// //     }
// // });

// //to update a user
// app.put('/record/:id', async (request, response) => {
//     try{
//         const {id} = request.params;
//         const users = await userData.findByIdAndUpdate(id, request.body);
//         return response.status(200).json({
//             count: users.length,
//             data: users
//         });  //json format return, count key and data, defined by us completely
//     }catch{
//         console.log(error.message);
//         response.status('500').send({message: error.message});
//     }
// });

// //to delete a record by id
// app.delete('/record/:id', async (request, response) => {
//     try{
//         const {id} = request.params;
//         const users = await userData.findByIdAndDelete(id);
//         return response.status(200).json({
//             count: users.length,
//             data: users
//         });  //json format return, count key and data, defined by us completely
//     }catch{
//         console.log(error.message);
//         response.status('500').send({message: error.message});
//     }
// });

// difference between try-catch and then-catch
// try catch wont work for asynchronous, so we need to use await to make it semantically similar to synchronous methods
// it has sth to do with promises
// whereas a then-catch is used to catch exceptions from asynchronous operation.
// bcz try-catch wont be able to catch async operation exceptions that arent awaited

mongoose.connect(mongoDBURL) //connects to DB
        .then(() => {        //try - catch block type, then-catch block
            console.log("App connected to DB successfully");
            app.get('/', (request, response)=> {
                console.log(request);
                console.log(response);
                return response.status(244).send('Full stack journey !!');
            }); //port connection placed here since we want to connect only if db connects
            
        })
        .catch((error) => {
            console.log(error);
        })