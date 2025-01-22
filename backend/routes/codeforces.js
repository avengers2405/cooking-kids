import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import crypto from 'crypto';
import http2 from 'http2';
import zlib from 'zlib';
import cookieParser from "../helper/cookie.js";

dotenv.config({path: '../.env'});

const router = express.Router();

// Helper function to perform SHA-1 hash (browser environment can use Web Crypto API)
function sha1(input) {
    return crypto.createHash('sha1').update(input, 'utf8').digest('hex');
}

router.get('/problem-solved', async (request, response) => {
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

    console.log('trying for pow');
    // to get pow
    try{
        const res = await axios.get(`https://mirror.codeforces.com/enter`);
        let pow_suffix = '';
        res.headers['set-cookie'].forEach((cookie)=>{
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

    // to get csrf and 3 cookies
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
                'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
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
            cookies.set(pr[0], pr[1]);
        })
        console.log('now cookies: ', cookies);
        // expected (from postman):
        // JSESSIONID, httponly, expires with session
        // pow, expires in a day
        // 39ce7, expires in ~ 2 weeks
    } catch (error){
        console.log(error.message);
    }
    console.log('here, evolution! ');

    // to get cookies: 70a7c28f3de, evercookie_cache, evercookie_etag, evercookie_png
    try{
        let cookieString = Array.from(cookies.entries())
        .map(([key, value])=>`${key}=${value}`)
        .join(';');

        console.log('cookie for getting additional cookies: ', cookieString);
        const client = http2.connect('https://www.leetcode.com');

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://mirror.codeforces.com/2fdcd78/ees?name=70a7c28f3de&cookie=evercookie_etag',
            headers: { 
                'Host':'mirror.codeforces.com',
                'accept':'text/javascript, text/html, application/xml, text/xml, */*',
                'accept-encoding':'gzip, deflate, br, zstd',
                'accept-language':'en-US,en;q=0.7',
                'cache-control':'no-cache',
                'Cookie': cookieString,
                'pragma':'no-cache',
                'priority':'u=1, i',
                'referer':'https://mirror.codeforces.com/enter',
                'sec-ch-ua':'"Not A(Brand";v="8", "Chromium";v="132", "Brave";v="132"',
                'sec-ch-ua-mobile':'?0',
                'sec-ch-ua-platform':"Windows",
                'sec-fetch-dest':'empty',
                'sec-fetch-mode':'cors',
                'sec-fetch-site':'same-origin',
                'sec-gpc':'1',
                'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
                'x-requested-with':'XMLHttpRequest'
            }
        };
        const res = await axios.request(config);
        console.log('res for cookies: ', res.data);
        console.log('raw response: ', res);
        // const res = await axios.get('');
    } catch (error){
        console.log('Error: ', error.message);
    }

    // to login
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
                'bfaa': 'f7er8h5z5hgffgp2yyqg9cltq6db5fdt',
                'handleOrEmail': 'akshitmishra24@gmail.com',
                'password': 'Akshit24!',
                'remember': 'on',
                '_tta': '900'
            },
            {
                headers: {
                    'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
                    'Cookie': cookieString
                },
                maxRedirects: 0,
                validateStatus: function (status){
                    if (status==302 || status==200) return true;
                    return false;
                }
            }
        )
        // console.log(res.data);
        // console.log();
        console.log('status: ', res.status);
        console.log('res headers cookies: ', res.headers);
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
})

export default router;