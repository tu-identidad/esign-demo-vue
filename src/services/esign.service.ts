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

  /**
   * Constructor for the ESignService class
   */
  constructor() {
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
    const response = await this.axiosInstance.post('/esign/addSingleSignatory', signatureData, { 
      headers : { 'Content-Type': 'application/json'}
    });
    return response.data;
  };

  /**
   * This method is used to get the document from the proxy API
   * @param identifier string
   * @returns Promise<ESignGetDocumentResponseData>
   */
  async getDocument (identifier: string): Promise<ESignGetDocumentResponseData> {
    const response = await this.axiosInstance.post(`/esign/getDocument`, { 'identifier': identifier}, {
      headers : { 'Content-Type': 'application/json'}
    });
    return response.data;
  }

}

export const eSignService = new ESignService();
