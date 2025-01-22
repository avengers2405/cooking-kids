import express from "express";
import dotenv from "dotenv";
import http2 from 'http2';
import zlib from 'zlib';
import cookieParser from "../helper/cookie.js";

var cookies = new Map();

function getCookieString(cookies){
    let cookieString = Array.from(cookies.entries())
        .map(([key, value])=>`${key}=${value[0]}`)
        .join(';');
        cookieString+=';';
    return cookieString;
}

async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

dotenv.config({path: '../.env'});

const router = express.Router();
// This is required to prevent leaking real IP address on ALPN negotiation
// const resolveProtocol = http2.auto.createResolveProtocol(new Map(), new Map(), connect);



router.get('/problem-solved', async (request, response)=>{
    const client = http2.connect('https://www.leetcode.com');
    client.on('error', (err) => {
        console.log('client Error: ', err);
        client.close();
    });

    try {
        const res = client.request({
            ":authority": "leetcode.com",
            ":method": "GET",
            ":path": "/",
            ":scheme": "https",
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "accept-encoding":"gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.6",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "priority": "u=0, i",
            "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Brave\";v=\"132\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "sec-gpc": "1",
            "upgrade-insecure-requests": "1",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"
            });

            res.on('response', (responseHeaders) => {
                console.log('Response headers:', responseHeaders);
                responseHeaders['set-cookie'].forEach((data)=>{
                    let imp = data.split(';');
                    let pr = imp[0].split('=');
                    cookies.set(pr[0], [pr[1], imp[1]]);
                });
                console.log('set cookies: ', cookies);
            });

            let chunks = [];
            res.on('data', (chunk) => {
                chunks.push(chunk);
            });

            res.on('end', () => {
                // client.close();
                console.log('end reached.')
                const binaryData = Buffer.concat(chunks);
                zlib.brotliDecompress(binaryData, (err, decompressed) => {
                    if (err) {
                        console.error('Error decompressing Brotli:', err);
                    } else {
                        console.log('Decompressed content (UTF-8):', decompressed.toString('utf-8'));
                    }
                });
            });

            res.on('error', (err) => {
                client.close();
                console.log('Error: ', err);
            });

    // For GET requests, we can end the stream immediately
    // For POST requests, you would write data here before ending
    res.end();

    } catch (error) {
        console.error('outermost Error:', error.message);
    }

    console.log("tested yoooooo base url"); 

    await sleep(1436); //7.5 sec
    console.log('going for 2nd request');

    try{
        const res = client.request({
            ":authority": "leetcode.com",
            ":method": "GET",
            ":path": "/api/is_china_ip/",
            ":scheme": "https",
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.6",
            "cache-control": "no-cache",
            "cookie": getCookieString(cookies),
            "pragma": "no-cache",
            "priority": "u=1, i",
            "Referer": "https://leetcode.com/",
            "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Brave\";v=\"132\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "sec-gpc": "1",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"
        });

        res.on('response', (responseHeaders) =>{
            console.log('Response headers:', responseHeaders);
            responseHeaders['set-cookie'].forEach((data)=>{
                let imp = data.split(';');
                let pr = imp[0].split('=');
                cookies.set(pr[0], [pr[1], imp[1]]);
            });
            console.log('set cookies: ', cookies);
        });

        // let chunks = [];
        let data='';
        res.on('data', (chunk) => {
            // chunks.push(chunk);
            data+=chunk;
        });

        res.on('end', () => {
            console.log('end reached.')
            console.log('data from 2nd request: ', data);
            cookies.set("ip_check", data);
            cookies.set("_dd_s", `rum=0&expire=${Date.now()+15*60*1000}`);
        });
    } catch (error){
        console.error('Error in request:', error.message);
    }

    await sleep(2389);

    try{
        const res = client.request({
            ":authority": "leetcode.com",
            ":method": "GET",
            ":path": "/accounts/login/",
            ":scheme": "https",
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.8",
            "cache-control": "no-cache",
            "cookie": getCookieString(cookies),
            "pragma": "no-cache",
            "priority": "u=0, i",
            "referer": "http://leetcode.com/",
            "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Brave\";v=\"132\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "sec-gpc": "1",
            "upgrade-insecure-requests": "1",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"
        });
        res.on('response', (responseHeaders) => {
            console.log('Response headers:', responseHeaders);
            responseHeaders['set-cookie'].forEach((data)=>{
                let imp = data.split(';');
                let pr = imp[0].split('=');
                cookies.set(pr[0], [pr[1], imp[1]]);
            });
            console.log('set cookies: ', cookies);
        });

        let chunks = [];
        res.on('data', (chunk) => {
            chunks.push(chunk);
        });

        res.on('end', () => {
            // client.close();
            console.log('end reached.')
            const binaryData = Buffer.concat(chunks);
            zlib.brotliDecompress(binaryData, (err, decompressed) => {
                if (err) {
                    console.error('Error decompressing Brotli:', err);
                } else {
                    console.log('Decompressed content (UTF-8):', decompressed.toString('utf-8'));
                }
            });
        });

    } catch (error){
        console.error('Error in request 3rd:', error.message);
    }

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

    return response.status(200).send('contacted leetcode');
})

export default router;