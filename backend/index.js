// start of our project

import express from "express";
import {PORT, mongoDBURL} from "./config.js";
// import mongoose from 'mongoose';
import axios from 'axios';

import routesBasic from './routes/routesBasic.js';
import cors from "cors";

const app = express();

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

app.use(express.json());

app.use(cors());

app.get('/', (request, response)=>{
    console.log("get at '/'.");
    // console.log(request);
    // console.log(response);
    return response.status(200).send("Yay!");
})

app.post('/problem-solved', async (request, response)=>{
    // console.log(request.headers);

    //leetcode
    if (request.body.platform==1){
        // query lc api
        // let config = {
        //     method: 'get',
        //     maxBodyLength: Infinity,
        //     url: 'https://leetcode.com/',
        //     headers: { }
        // };
        try{
            const res = await axios.get('https://leetcode.com/', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'en-US,en;q=0.5',
                    // 'Referer': 'https://leetcode.com/',
                    'Connection': 'keep-alive',
                    // 'Upgrade-Insecure-Requests': '1',
                    // 'DNT': '1', // Do Not Track header
                    'Cache-Control': 'no-cache',
                    // 'Pragma': 'no-cache'
                }
            });
            console.log(res);
        } catch(error){
            console.log(error.message);
            console.log("byrrr");
        }       
        console.log("done"); 
        // axios.request(config)
        // .then((response) => {
        //     console.log(JSON.stringify(response.data));
        // })
        // .catch((error) => {
        //     console.log(error);
        //     console.log("bye");
        // });
        // const res = await axios.get('https://leetcode.com/', {headers: {

        // }}); //make get request to get cookies
        // console.log(res);

        // const data = {
        //     query: `{
        //         matchedUser(username: "${request.body.username}"){
        //             username
        //             submitStats: submitStatsGlobal {
        //                 acSubmissionNum {
        //                     difficulty
        //                     count
        //                     submissions
        //                 }
        //             }
        //         }
        //     }`,
        //     variables: {}
        // };

        // try{
        //     const lcres = await axios.post('https://leetcode.com/graphql', 
        //         data,
        //         {headers: { 
        //             'Content-Type': 'application/json'
        //         }},
        //     );
        //     console.log('Result: ', lcres.data);
        // } catch (error){
        //     console.log(error);
        // }

        // console.log("NEXT REQUEST \n\n");

        // const data2 = {

        //     query: `{
        //         matchedUser(username: "${request.body.username}"){
        //             contributions{
        //                 points
        //             }
        //             profile {
        //                 reputation
        //                 ranking
        //             }
        //             submissionCalendar
        //             username
        //             submitStats: submitStatsGlobal {
        //                 acSubmissionNum {
        //                     difficulty
        //                     count
        //                     submissions
        //                 }
        //             }
        //         }
        //     }`,
        //     variables: {}
        // };
        // console.log(data2.length);
        // try {
        //     const lc_res = await axios.post('https://leetcode.com/graphql', 
        //         data2,
        //         {headers: {
        //             'Content-Type': 'application/json'
        //         }}
        //     );
        //     console.log("leetcode response: ", lc_res.data);
        // } catch (error) {
        //     console.log(error);
        // }
        
        // console.log("here in lc");
    }

    // codeforces
    if (request.body.platform==2){
        // query cf api 
        // https://codeforces.com/api/user.status?handle=Fefer_Ivan&from=1&count=10
        // let itr =10;
        try{
            const res = await axios.get(`https://codeforces.com`);
            console.log(res);
        } catch( error ){
            console.log(error.message);
        }
        try{
            let i=1
            let res;
            const acSubmissions = [];
            do {
                res = await axios.get(`https://codeforces.com/api/user.status?handle=${request.body.username}&from=${i}&count=100`);
                i+=100;
                res.data.result.forEach((record) => {
                    if (record.verdict!="OK") return;
                    acSubmissions.push({
                        "problemId": record.problem.contestId+record.problem.index,
                        "date": new Date(record.creationTimeSeconds*1000),
                        "handle": record.author.members[0].handle,
                        "lang": record.programmingLanguage
                    });
                    return;
                });
                // console.log(res.data, res.data.result.length);
            } while (res.data.result.length) //console.log("recieved data: ", acSubmissions);

            return response.status(200).send(acSubmissions);
        } catch (error){
            console.log(error.message);
        }
        // axiosInstance.interceptors.response.use(res => {
        //     console.log(res.request._header)
        //     return res;
        // }, error => Promise.reject(error));
    }
    return response.status(200).send('ok sent response, unreachable.');
})

app.post('/signup', async(request, response)=>{
    
})

// mongoose.connect(mongoDBURL) //connects to DB
//         .then(() => {        //try - catch block type, then-catch block
//             console.log("App connected to DB successfully");
//             app.get('/', (request, response)=> {
//                 console.log(request);
//                 console.log(response);
//                 return response.status(244).send('Full stack journey !!');
//             }); //port connection placed here since we want to connect only if db connects
            
//         })
//         .catch((error) => {
//             console.log(error);
//         })
// console.log("ready");