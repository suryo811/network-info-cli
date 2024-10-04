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
        console.error('Error fetching public network info', error);
    }
}

(async () => {
    // Local network details
    const localInfo = getLocalNetworkInfo();
    console.log('Local Network Info:', localInfo);

    const publicInfo = await getPublicNetworkInfo();
    if (publicInfo) {
        console.log('Public IP:', publicInfo.ip)
        console.log('ISP:', publicInfo.org)
        console.log('Location:', `${publicInfo.city}, ${publicInfo.region}, ${publicInfo.country}`)
    }
})();