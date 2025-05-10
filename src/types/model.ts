export interface Job {
  id: string;
  job_title: string;
  company_name: string;
  company_location: string;
  short_description: string;
  relevant_tags: string[];
  is_featured: boolean;
  apply_url: string;
  created_at: number;
  updated_at: number;
}

export interface User {
  id: string;
  email: string;
  fullname: string;
  nickname: string;
  whatsapp_number: string;
  current_job: string;
  profile_picture: string;
  preferences_tags: string[];
  created_at: number;
  updated_at: number;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string; // bearer
  user: User;
}

export interface Tag {
  id: string;
  name: string;
}
