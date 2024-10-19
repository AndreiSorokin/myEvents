export type CustomError = {
  status?: number;
  data?: {
    message?: string; // Error message returned from the server
    [key: string]: unknown;
  };
  message?: string;
  error?: string;
};
