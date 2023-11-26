export class BaseService {
    constructor(connectInfo) {
        this.provider = connectInfo.provider;
        this.connectInfo = connectInfo;
        this.addressInfo = connectInfo.addressInfo;
    }
}
