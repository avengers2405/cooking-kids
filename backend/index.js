// start of our project

import express, { response } from "express";
import {PORT, mongoDBURL} from "./config.js";
import { z } from 'zod';
import axios from 'axios';
import { neon } from "@neondatabase/serverless";
import routesBasic from './routes/routesBasic.js';
import cors from "cors";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import leetcode from './routes/leetcode.js';

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

// Helper function to perform SHA-1 hash (browser environment can use Web Crypto API)
function sha1(input) {
    return crypto.createHash('sha1').update(input, 'utf8').digest('hex');
}

function cookieParser(cookieString) {
	if (cookieString === "")
		return {};
	let pairs = cookieString.split(";");

	// Separate keys from values in each pair string
	// Returns a new array which looks like
	// [[key1,value1], [key2,value2], ...]
	let splittedPairs = pairs.map(cookie => cookie.split("="));
	const cookieObj = splittedPairs.reduce(function (obj, cookie) {

		// cookie[0] is the key of cookie
		// cookie[1] is the value of the cookie 
		// decodeURIComponent() decodes the cookie 
		// string, to handle cookies with special
		// characters, e.g. '$'.
		// string.trim() trims the blank spaces 
		// auround the key and value.
        if (cookie.length<2) return obj;
        // console.log('inside func: ', cookie);
		obj[decodeURIComponent(cookie[0].trim())]
			= decodeURIComponent(cookie[1].trim());

		return obj;
	}, {});

    // const cookieObj = 

	return cookieObj;
}

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
        console.log('here');
        response.redirect('/leetcode/problem-solved');
        return;
        console.log('redirected, unreachable');
        // try{
        //     const res = await axios.get('https://leetcode.com/', {
        //         headers: {
        //             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
        //             'Accept': '*/*',
        //             'Accept-Encoding': 'gzip, deflate, br',
        //             'Accept-Language': 'en-US,en;q=0.5',
        //             // 'Referer': 'https://leetcode.com/',
        //             'Connection': 'keep-alive',
        //             // 'Upgrade-Insecure-Requests': '1',
        //             // 'DNT': '1', // Do Not Track header
        //             'Cache-Control': 'no-cache',
        //             // 'Pragma': 'no-cache'
        //         }
        //     });
        //     console.log(res);
        // } catch(error){
        //     console.log(error.message);
        //     console.log("byrrr");
        // }       
        // console.log("done"); 
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
        
        var cookies = new Map();

        try{
            const res = await axios.get(`https://codeforces.com`);
            console.log(res);
        } catch( error ){
            console.log(error.message);
        }

        // let config = {
        //     method: 'get',
        //     maxBodyLength: Infinity,
        //     url: 'https://mirror.codeforces.com/',
        //     headers: {
        //         'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        //         'accept-encoding': 'gzip, deflate, br, zstd',
        //         'accept-language': 'en-US,en;q=0.7',
        //         'cache-control':'no-cache',
        //         'pragma':'no-cache',
        //         'priority':'u=0, i',
        //         'sec-ch-ua':'"Brave";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        //         'sec-ch-ua-mobile':'?0',
        //         'sec-ch-ua-platform':'"Windows"',
        //         'sec-fetch-dest':'document',
        //         'sec-fetch-mode':'navigate',
        //         'sec-fetch-site':'none',
        //         'sec-fetch-user':'?1',
        //         'sec-gpc':'1',
        //         'upgrade-insecure-requests':'1',
        //         'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        //     }
        // };
        
        // axios.request(config)
        // .then((response) => {
        // console.log(JSON.stringify(response.data));
        // })
        // .catch((error) => {
        // console.log(error);
        // });

        try{
            const res=await axios.get(`https://mirror.codeforces.com/enter`);
            let pow_suffix = '';
            res.headers['set-cookie'].forEach((cookie, ind)=>{
                // console.log('cookie is : ', cookie);
                var cookieObj = cookieParser(cookie);
                // console.log('parsed: ', cookieObj, cookieObj['pow']);
                if (cookieObj['pow']) pow_suffix=cookieObj['pow'];
            });
            // console.log('recieved cookie: ', res.headers['set-cookie']);
            // console.log('pow_suffix: ', pow_suffix);
            let idx = 0;
            let attempt = '';
            while (true) {
                attempt = `${idx}_${pow_suffix}`;
                let hsh = sha1(attempt);
                if (hsh.startsWith('0000')) {
                    break;
                }
                idx++;
            }
            console.log('final attempt success: ', attempt);
            res.headers['set-cookie'][1] = res.headers['set-cookie'][1].replace(/(pow=)[^;]+/, `$1${attempt}`);
            // console.log('new cookies: ',  res.headers['set-cookie']);
            res.headers['set-cookie'].forEach((data)=>{
                let imp = data.split(';');
                let pr = imp[0].split('=');
                cookies.set(pr[0], pr[1]);
            })
            console.log('cookies after calling for PoW: ', cookies);
        } catch(error){
            console.log(error.message);
        }
        var csrf_token='';
        try{
            let cookieString = Array.from(cookies.entries())
            .map(([key, value])=>`${key}=${value}`)
            .join(';');

            console.log('cookie for submitting PoW: ', cookieString);

            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'https://mirror.codeforces.com/enter',
                headers: { 
                    'Cookie': cookieString
                }
            };
            const res = await axios.request(config);
            // console.log(res.data);
            csrf_token = res.data.split("<input type='hidden' name='csrf_token' value=")[1].split("'")[1];
            console.log('csrf token: ', csrf_token);
            console.log('cookies: ', res.headers);
            res.headers['set-cookie'].forEach((data)=>{
                let imp = data.split(';');
                let pr = imp[0].split('=');
                // cookies+=imp[0]+'; ';
                cookies.set(pr[0], pr[1]);
            })
            console.log('now cookies: ', cookies);
        } catch (error){
            console.log(error.message);
        }
        console.log('here, evolution! ');
        try{
            let cookieString = Array.from(cookies.entries())
            .map(([key, value])=>`${key}=${value}`)
            .join(';');
            cookieString+=';';
            console.log('set cookieString: ', cookieString);

            // const res = await axios.request(config);
            const res = await axios.post('https://mirror.codeforces.com/enter',
                {
                    'csrf_token': csrf_token,
                    'action': 'enter',
                    'ftaa': (Math.random() + 1).toString(36).substring(2)+(Math.random() + 1).toString(36).substring(4),
                    'bfaa': 'f7er8h5z5hfd2gp2yyqg9cltq6db5fdt',
                    'handleOrEmail': 'akshitmishra24@gmail.com',
                    'password': 'Akshit24!',
                    'remember': 'on',
                    '_tta': '900'
                },
                {
                    headers: {
                        'Cookie': cookieString
                    },
                    maxRedirects: 1,
                    validateStatus: function (status){
                        if (status==302 || status==200) return true;
                        return false;
                    }
                }
            )
            // console.log(res.data);
            // console.log();
            console.log('status: ', res.status);
            // console.log(res.data);
            // NOT GETTING SET-COOKIE HEADER
            // res.headers['set-cookie'].forEach((data)=>{
            //     let imp = data.split(';');
            //     let pr = imp[0].split('=');
            //     // cookies+=imp[0]+'; ';
            //     cookies.set(pr[0], pr[1]);
            // })
            if (res.data!=undefined && res.data.includes("<input type='hidden' name='csrf_token' value=")){
                csrf_token = res.data.split("<input type='hidden' name='csrf_token' value=")[1].split("'")[1];
                console.log('csrf token: ', csrf_token);
            }

            console.log('logged in cookies: ', cookies);
            console.log('here');

        } catch (error){
            console.log(error.message);
        }

        try{
            let cookieString = Array.from(cookies.entries())
            .map(([key, value])=>`${key}=${value}`)
            .join(';');
            cookieString+=';';
            console.log('set cookieString: ', cookieString);

            let res = await axios.get(`https://mirror.codeforces.com/`, {
                headers:{
                    'Cookie': cookieString
                }
            });
            console.log(res.data);
        } catch (error) {
            console.log(error.message);
        }

        // try {
        //     let res = await axios.get(`https://mirror.codeforces.com/contest/2042/submission/294402753`);
        //     // console.log(res);
        //     if (res.data.includes('<p>Please wait. Your browser is being checked. It may take a few seconds...</p>')){
        //         let pow_suffix = '';
        //         res.headers['set-cookie'].forEach((cookie, ind)=>{
        //             // console.log('cookie is : ', cookie);
        //             var cookieObj = cookieParser(cookie);
        //             // console.log('parsed: ', cookieObj, cookieObj['pow']);
        //             if (cookieObj['pow']) pow_suffix=cookieObj['pow'];
        //         });
        //         // console.log('recieved cookie: ', res.headers['set-cookie']);
        //         // console.log('pow_suffix: ', pow_suffix);
        //         let idx = 0;
        //         let attempt = '';
        //         while (true) {
        //             attempt = `${idx}_${pow_suffix}`;
        //             let hsh = sha1(attempt);
        //             if (hsh.startsWith('0000')) {
        //                 break;
        //             }
        //             idx++;
        //         }
        //         console.log('final attempt success: ', attempt);
        //         res.headers['set-cookie'][1] = res.headers['set-cookie'][1].replace(/(pow=)[^;]+/, `$1${attempt}`);
        //         // console.log('new cookies: ',  res.headers['set-cookie']);
        //         res.headers['set-cookie'].forEach((data)=>{
        //             let imp = data.split(';');
        //             let pr = imp[0].split('=');
        //             cookies.set(pr[0], pr[1]);
        //         })
        //         console.log('cookies after calling for PoW: ', cookies);
        //         let cookieString = Array.from(cookies.entries())
        //         .map(([key, value])=>`${key}=${value}`)
        //         .join(';');
        //         cookieString+=';';
        //         console.log('set cookieString: ', cookieString);
        //         res = await axios.get(`https://mirror.codeforces.com/contest/2042/submission/294402753`,
        //             {headers: {
        //                 'Cookie': cookieString
        //             }}
        //         )
        //         console.log(res.data);
        //         if (res.data.includes('Accepted') || res.data.includes('test details')) console.log('success');
        //         else if (res.data.includes('avengers2405')) console.log('atleast its still logged in');
        //         else console.log('faluire');
        //     }
        //     console.log('done');
        // } catch (error) {
        //     console.log(error.message);
        // }

        /* for testing only, valid code
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
        */
    }
    return response.status(200).send('ok sent response, unreachable.');
})
