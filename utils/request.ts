import rpn = require("request-promise-native");
import * as undici from "undici";
import * as AgentKeepAlive from "agentkeepalive";
import { config } from "../config";
import * as LRU from "lru-cache";

const keepAliveHttpAgent = new AgentKeepAlive({
  keepAlive: true,
  freeSocketTimeout: 15000,
  socketActiveTTL: 300000
});
export const defaultHeaders = {
  "Content-Type": "application/json",
  Cookie:
    "G_ENABLED_IDPS=google; ajs_user_id=%2212091906-01011992%22; ajs_anonymous_id=%2214e5ca11-ac80-44a6-b4c3-af677d9fa4d4%22; X-Experiment=amp-CW95Kif8JlrEQ5rZ7tZJLA; __csrf=562ce1fa-f485-b7ef-7942-a2cbc284645d; WZRK_G=5a326cd9a7884acdb2e9bb2ddf15ff74; tId=1551; mId=22394; _ga_6NJVXEJHSD=GS1.1.1605099018.3.0.1605099018.0; _ga=GA1.1.1386338343.1602142190; dh_user_id=3c7c2ec0-5700-11eb-b5f8-b930fc089175; G_AUTHUSER_H=1; connect.sid=s%3A_rS1ZMC1xoRVJUW2CWyv-wRlAYbDSDFZ.lsW1u5qf%2BY3fGXd1bOTp2lQfv%2BMKi%2FYeUJbpsRfRIj0; IPL_Offer=variant3; WZRK_S_W4R-49K-494Z=%7B%22p%22%3A1%2C%22s%22%3A1612963862%2C%22t%22%3A1612963862%7D",
  "x-csrf": "562ce1fa-f485-b7ef-7942-a2cbc284645d"
};
const parseCache = new LRU({
  max: 300,
  maxAge: 300000 // 5 mins
});
const client = new undici.Client(config.baseURL);

export const nativePostRequest = (path: string, headers: object, body: any) => {
  return client
    .request({
      path,
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    })
    .then((res: any) => {
      return new Promise((resolve, reject) => {
        if (parseCache.has(res.headers.etag)) {
          resolve(parseCache.get(res.headers.etag));
          return;
        }
        res.body.setEncoding("utf8");
        let stringResponse = "";
        res.body.on("data", (chunk: any) => {
          stringResponse += chunk;
        });
        res.body.on("end", () => {
          let parsedResponse;
          try {
            parsedResponse = JSON.parse(stringResponse);
            parseCache.set(res.headers.etag, parsedResponse);
          } catch {
            parsedResponse = stringResponse;
          }
          resolve(parsedResponse);
        });
      });
    })
    .catch((err: any) => {
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
      timeout: 6000
    })
    .then((res) => {
      let parsedResponse;
      try {
        if (parseCache.has(res.headers.etag)) {
          parsedResponse = parseCache.get(res.headers.etag);
        } else {
          parsedResponse = JSON.parse(res.body);
        }
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
