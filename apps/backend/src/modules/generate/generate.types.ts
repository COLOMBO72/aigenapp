export interface GenerateRequest {
  prompt: string;
  width?: number;
  height?: number;
}

export interface GenerateJobData {
  generationId: string;
  userId: string;
  prompt: string;
  width: number;
  height: number;
}

export interface SDApiResponse {
  images: string[]; // base64 картинки
  info: string;
}
