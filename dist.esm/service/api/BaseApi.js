import axios from 'axios';
import { request } from 'graphql-request';
import { Trace } from '../tool';
import { BasicException } from '../../BasicException';
import { getCurrentAddressInfo } from '../../Constant';
export class BaseApi {
    async request(path, method, data, config = {
        headers: {},
    }) {
        return await new Promise((resolve, reject) => {
            const requestUrl = path;
            const req = {
                url: requestUrl,
                method,
                params: undefined,
                data: undefined,
                headers: {},
            };
            if (['get', 'delete'].includes(method.toLowerCase()))
                req.params = data;
            else
                req.data = data;
            if (config.headers)
                req.headers = config.headers;
            axios(req)
                .then((res) => {
                Trace.debug(`request success ${method} ${requestUrl} data =`, data, `result = `, res.data);
                resolve(res.data);
            })
                .catch((err) => {
                Trace.debug(`request error ${method} ${requestUrl} data =`, data, `error = `, err);
                const msg = 'Network Error';
                reject(msg);
            });
        });
    }
    async graphBase(fullUrl, query, variables) {
        Trace.debug(`graph node request: ${fullUrl}`, query, variables);
        try {
            const t = await request(fullUrl, query, variables);
            Trace.debug(`graph node request success data =`, t);
            return t;
        }
        catch (e) {
            Trace.debug('graph node request error', e);
            throw new BasicException('Request failed', e);
        }
    }
    async blockGraph(query, variables) {
        return this.graphBase(getCurrentAddressInfo().blockGraphApi, query, variables);
    }
    async projectPartyRewardGraph(query, variables) {
        return this.graphBase(getCurrentAddressInfo().projectPartyRewardGraphApi, query, variables);
    }
    async exchangeGraph(query, variables) {
        return this.graphBase(getCurrentAddressInfo().exchangeGraphApi, query, variables);
    }
    async launchpadGraph(query, variables) {
        return this.graphBase(getCurrentAddressInfo().launchpadGraphApi, query, variables);
    }
    connectInfo() {
        return getCurrentAddressInfo().readonlyConnectInfo();
    }
    address() {
        return getCurrentAddressInfo();
    }
}
export const BASE_API = new BaseApi();
