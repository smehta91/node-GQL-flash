import rpn = require("request-promise-native");
import * as AgentKeepAlive from "agentkeepalive";
import { config } from "../config";

const keepAliveHttpAgent = new AgentKeepAlive({
  keepAlive: true,
  freeSocketTimeout: 15000,
  socketActiveTTL: 300000,
});

export const nativePostRequest = (path: string, headers: object, body: any) => {
  return rpn
    .post(`${config.baseURL}${path}`, {
      headers: headers,
      agent: keepAliveHttpAgent,
      resolveWithFullResponse: true,
      body: JSON.stringify(body),
      timeout: 6000,
    })
    .then((res) => {
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(res.body);
      } catch {
        parsedResponse = res;
      }
      return parsedResponse;
    })
    .catch((err) => {
      console.log(err);
      return { err: err };
    });
};

export const nativeGetRequest = (
  path: string,
  headers: object,
  queryParams: any
) => {
  return rpn
    .get(`${config.baseURL}${path}`, {
      headers: headers,
      agent: keepAliveHttpAgent,
      resolveWithFullResponse: true,
      qs: queryParams,
      timeout: 6000,
    })
    .then((res) => {
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(res.body);
      } catch {
        parsedResponse = res;
      }
      return parsedResponse;
    })
    .catch((err) => {
      console.log(err);
      return { err: err };
    });
};
