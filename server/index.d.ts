declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
    interface Response {
      success: (message: string, data?: any, statusCode?: number) => void;
      error: (message: string, error?: any, statusCode?: number) => void;
      addJwtCookies: (userId: mongoose.Types.ObjectId) => void;
    }
  }
}
