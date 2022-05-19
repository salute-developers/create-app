import { HttpsProxyAgent } from 'hpagent';

const npmHeaders = process.env.NPM_REGISTRY_TOKEN
    ? {
          Authorization: `Bearer ${process.env.NPM_REGISTRY_TOKEN}`,
      }
    : {};

const headers = {
    ...npmHeaders,
};

function getProxyAgent() {
    return process.env.HTTPS_PROXY ? new HttpsProxyAgent({ proxy: process.env.HTTPS_PROXY }) : undefined;
}

export const fetchOptions = { headers, agent: getProxyAgent() };
