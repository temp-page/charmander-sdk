import { Trace } from './Tool';
let data = {};
export const STORAGE_KEY_TOKEN_LIST = 'STORAGE_KEY_TOKEN_LIST';
export const STORAGE_KEY_TOKENS = 'STORAGE_KEY_TOKENS';
export class StorageProvider {
    constructor(type) {
        this.type = type;
    }
    get(key) {
        switch (this.type) {
            case 'web':
                return localStorage.getItem(key) || '';
            case 'node':
                return data[key] || '';
        }
        return '';
    }
    getArray(key) {
        const str = this.get(key);
        let dataList;
        if (str) {
            try {
                const data = JSON.parse(str);
                if (Array.isArray(data))
                    dataList = data;
            }
            catch (e) {
                Trace.debug('StorageProvider.getArray', e);
            }
        }
        return dataList;
    }
    getObj(key) {
        const str = this.get(key);
        let result = null;
        if (str) {
            try {
                const data = JSON.parse(str);
                if (!Array.isArray(data))
                    result = data;
            }
            catch (e) {
                Trace.debug('StorageProvider.getObj', e);
            }
        }
        return result;
    }
    set(key, value) {
        switch (this.type) {
            case 'web':
                localStorage.setItem(key, value);
                break;
            case 'node':
                data[key] = value;
                break;
        }
    }
    setJson(key, value) {
        this.set(key, JSON.stringify(value));
    }
    clearKey(key) {
        switch (this.type) {
            case 'web':
                localStorage.removeItem(key);
                break;
            case 'node':
                delete data[key];
                break;
        }
    }
    clear() {
        switch (this.type) {
            case 'web':
                localStorage.clear();
                break;
            case 'node':
                data = {};
                break;
        }
    }
}
