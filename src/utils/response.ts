export interface ApiResponse<T> {
    status: "success" | "error";
    message: string;
    data?: T;
    errors?: any;
  }
  
  export const successResponse = <T>(message: string, data?: T): ApiResponse<T> => {
    return {
      status: "success",
      message,
      data,
    };
  };
  
  export const errorResponse = (message: string, errors?: any): ApiResponse<null> => {
    return {
      status: "error",
      message,
      errors,
    };
  };