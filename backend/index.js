// start of our project

import express, { response } from "express";
import {PORT, mongoDBURL} from "./config.js";
import { z } from 'zod';
import axios from 'axios';
import { neon } from "@neondatabase/serverless";
import cors from "cors";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import leetcode from './routes/leetcode.js';
import codeforces from './routes/codeforces.js';

// import cookieParser from "cookie-parser";
// var cookieParser = require('cookie-parser');
dotenv.config();

const app = express();

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

app.use(express.json());
app.use(cors());
// app.use(cookieParser());
app.use('/leetcode', leetcode);
app.use('/codeforces', codeforces);

function validateSignUpInput(request, response, next){
    // console.log("In middleware, request body is: ", request.body);
    const schema = z.object({
        fName: z.string().trim().min(1, {message: "First Name is necessary"}).max(30, {message: "Max. fName size is 30"}),
        lName: z.string().trim().max(30, {message: "Max. lName size is 30"}),
        email: z.string().trim().max(30, {message: "Max. email size is 30"}).email("This is not a valid email"),
        username: z.string().trim().min(4, {message: "Min. username length is 4"}).max(15, {message: "Max. username length is 15"}),
        password: z.string().trim().min(8,{message: "Min. password length is 8"}).max(25, {message: "Max. password length is 25"}),
    });
    const data = schema.safeParse(request.body);
    if (!data.success){
        // console.log(request.body.email, request.body.username);
        console.log("Validation Unsuccessful: ", data.error);
        return response.status(403).json({data});
    } else {
        console.log("validation success.");
        next();
    }
}

app.post('/signup', validateSignUpInput, async(request, response)=>{
    // console.log("reached here after validation");
    
    const sql = neon(process.env.DB_URL, { ssl: true });
    console.log('sql: ', sql); // 403
    let data = await sql`SELECT COUNT(*) FROM Credentials WHERE username=${request.body.username}`;
    if (data[0].count!=0){
        console.log('username not unique: ', request.body.username);
        return response.status(418).send("Username is not unique");
    }
    console.log('ready: ', data);
    data = await sql`INSERT INTO Credentials(username, password) VALUES (${request.body.username}, ${request.body.password})`;
    // console.log(data);
    data = await sql`SELECT COUNT(*) FROM Credentials WHERE username=${request.body.username}`;
    // console.log(data);
    const token = jwt.sign(request.body.username, process.env.JWT_SECRET);
    if (data[0].count==1) return response.setHeader('Set-Cookie', `token=${token}; HttpOnly`).status(200).send("Successfully registered user!");
    // if (data[0].count==1) return response.json({data: {token: token}}).status(200);
    return response.status(500).send("Some error occurred");
})

app.get('/', (request, response)=>{
    console.log("get at '/'.");
    return response.status(200).send("Yay!");
})

app.post('/problem-solved', async (request, response)=>{

    //leetcode
    if (request.body.platform==1){
        response.redirect('/leetcode/problem-solved');
        return;
    }

    // codeforces
    if (request.body.platform==2){
        response.redirect('/codeforces/problem-solved');
        return;
    }
    return response.status(200).send('ok sent response, unreachable.');
})
