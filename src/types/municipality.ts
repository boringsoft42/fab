export interface Municipality {
  id: string;
  name: string;
  department: string;
  region?: string;
  address?: string;
  website?: string;
  username: string;
  email: string;
  phone?: string;
  institutionType: "MUNICIPALITY" | "NGO" | "FOUNDATION" | "OTHER";
  customType?: string;
  primaryColor?: string;
  secondaryColor?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  creator?: {
    id: string;
    username: string;
    role: string;
  };
  companies?: Array<{
    id: string;
    name: string;
    businessSector: string;
  }>;
}

export interface CreateMunicipalityRequest {
  name: string;
  department: string;
  region?: string;
  address?: string;
  website?: string;
  username: string;
  password: string;
  email: string;
  phone?: string;
  institutionType: "MUNICIPALITY" | "NGO" | "FOUNDATION" | "OTHER";
  customType?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface UpdateMunicipalityRequest {
  name?: string;
  department?: string;
  region?: string;
  address?: string;
  website?: string;
  phone?: string;
  institutionType?: "MUNICIPALITY" | "NGO" | "FOUNDATION" | "OTHER";
  customType?: string;
  primaryColor?: string;
  secondaryColor?: string;
  isActive?: boolean;
}

export interface MunicipalityAuthRequest {
  username: string;
  password: string;
}

export interface MunicipalityAuthResponse {
  token: string;
  municipality: Municipality;
}

export interface MunicipalityChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
} 