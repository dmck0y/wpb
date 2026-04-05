export interface Asset {
  uuid: string;
  url: string;
  date: Date;
}

export interface Env {
  CLOUD_NAME: string;
  API_KEY: string;
  API_SECRET: string;
}

export interface CloudinaryResource {
  asset_id: string;
  secure_url: string;
  created_at: string;
}

export interface CloudinaryResponse {
  resources: CloudinaryResource[];
}
