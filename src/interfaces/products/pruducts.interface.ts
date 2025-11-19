export interface ProductsHeaderData {
  data: {
    partNumber: string;
    sourceFileName: string;
    createdAt: string;
    status: 'waiting_integration' | 'completed' | 'error';
    response: {
      wmsSenior?: {
        status: string;
        message: string;
      };
      wmsIntercomm?: {
        status: string;
        message: string;
      };
    };
  }[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
