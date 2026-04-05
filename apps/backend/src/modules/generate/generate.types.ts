export interface GenerateRequest {
  prompt: string;
  width?: number;
  height?: number;
  isPremium?: boolean;
}

export interface GenerateJobData {
  generationId: string;
  userId: string;
  prompt: string;
  width: number;
  height: number;
  isPremium: boolean;
}

export interface SDApiResponse {
  images: string[];
  info: string;
}