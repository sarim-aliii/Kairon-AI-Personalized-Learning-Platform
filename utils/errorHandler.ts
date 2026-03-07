import { AxiosError } from 'axios';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.errors) {
      return Object.values(error.response.data.errors).join(', ');
    }
    if (error.response?.statusText) {
      return `${error.response.status} - ${error.response.statusText}`;
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
};