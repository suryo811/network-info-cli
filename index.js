#!/usr/bin/env node
import os from 'os';
import got from 'got';
import dotenv from 'dotenv';
dotenv.config();

const getLocalNetworkInfo = () => {
    const networkInterfaces = os.networkInterfaces();
    const results = {};

    for (const name of Object.keys(networkInterfaces)) {
        for (const net of networkInterfaces[name]) {
            // Skip over internal (i.e., 127.0.0.1) and non-IPv4 addresses
            if (net.family === 'IPv4' && !net.internal) {
                results[name] = net.address;
            }
        }
    }
    return results;
}

const getPublicNetworkInfo = async () => {
    try {
        const response = await got(`https://ipinfo.io/?token=${process.env.IPINFO_TOKEN}`, { responseType: 'json' })
        return response.body
    } catch (error) {
        console.error('Error fetching public network info:');
    }
}

(async () => {
    console.log(getLocalNetworkInfo())
    const result = await getPublicNetworkInfo();
    console.log(result);

})();