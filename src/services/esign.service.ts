import axios, { AxiosInstance } from 'axios';

// model esign request data
export interface ESignAddSignatureRequestData {
  identifier: string;
  name: string;
  firstName: string;
  lastName: string;
  rfc: string;
  email: string;
  document: string;
  showSignature: number;
  imageSignature: string;
}

export interface ESignGetDocumentResponseData {
  image: string;
}

export class ESignService {
  private axiosInstance: AxiosInstance;
  private token: string;

  constructor() {
    this.token = '';
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_SERVICE_URL, // This is a placeholder for the backend service URL
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }
  /**
   * This method is used to send the signature data to the proxy API
   * @param signatureData ESignRequestData
   * @returns Promise<any>
   */
  async addSignature (signatureData: ESignAddSignatureRequestData) {
    const response = await this.axiosInstance.post('/esign/addSignatory', signatureData, { 
      headers : { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+  this.token} 
    });
    return response.data;
  };

  /**
   * This method is used to get the document from the proxy API
   * @param identifier string
   * @returns Promise<ESignGetDocumentResponseData>
   */
  async getDocument (identifier: string): Promise<ESignGetDocumentResponseData> {
    const response = await this.axiosInstance.post(`/esign/getDocument/`, { 'identifier': identifier}, 
      { headers: { 'Authorization': 'Bearer '+  this.token } 
    });
    return response.data;
  }

  /**
   * This method is used to get the token from the proxy API
   * @returns Promise<string>
   */
  async getToken () : Promise<string> {
    const apikey = import.meta.env.VITE_APIKEY; // This is a placeholder for the API key
    const response = await this.axiosInstance.post('/token', {}, { headers: {'apikey' : apikey} });
    this.token = response.data.token;
    return response.data;
  };

}

export const eSignService = new ESignService();
