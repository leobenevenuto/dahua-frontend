export interface ProductsHeaderData {
  data: {
    partNumber: string;
    sourceFileName: string;
    createdAt: string;
    response: {
      wmsSenior: {
        status: string;
        message: string;
      };
      wmsIntercomm: {
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
