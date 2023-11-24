export class BaseService {
  provider;
  connectInfo;
  addressInfo;
  constructor(connectInfo) {
    this.provider = connectInfo.provider;
    this.connectInfo = connectInfo;
    this.addressInfo = connectInfo.addressInfo;
  }
}
