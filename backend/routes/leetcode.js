import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config({path: '../.env'});

const router = express.Router();

router.get('/problem-solved', async (request, response)=>{
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://leetcode.com/api/',
        headers: { }
    };
    
    axios.request(config)
    .then((response) => {
    console.log('some response: ', JSON.stringify(response.data));
    })
    .catch((error) => {
    console.log('error: ', error);
    });
    
    console.log("tested base url"); 
})

export default router;