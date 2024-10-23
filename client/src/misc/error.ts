export type CustomError = {
  status?: number;
  data?: {
    message?: string;
    [key: string]: unknown;
  };
  message?: string;
  error?: string;
};
