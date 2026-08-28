/* Provider contract. Replace MockProvider only after a real supplier API and credentials are configured. */
export class MockProvider {
  constructor(env){this.env=env}
  async getProducts(){return []}
  async getProductByCode(){return null}
  async validateAccount(){return {valid:true,mode:"mock"}}
  async createTransaction(order){return {reference:`MOCK-${order.id}`,status:"success"}}
  async getTransactionStatus(){return {status:"success"}}
  async cancelTransaction(){return {supported:false}}
  async refundTransaction(){return {supported:false}}
}
export function getProvider(env){return new MockProvider(env)}
