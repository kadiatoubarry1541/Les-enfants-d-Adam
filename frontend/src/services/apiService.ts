import { config, apiCall } from "../config/api";
import type {
  User,
  Badge,
  UserBadge,
  ActivityGroup,
  ResidenceGroup,
  EducationFormation,
  RegionGroup,
  OrganizationGroup,
  FaithCommunity,
  FaithPost,
  HolyBook,
  FriendRequest,
  ApiResponse,
  PaginatedResponse,
} from "../types/common";

// Service d'authentification
export const authService = {
  async register(userData: User): Promise<ApiResponse<User>> {
    return apiCall(config.ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  async login(
    numeroH: string,
    password: string,
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    return apiCall(config.ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify({ numeroH, password }),
    });
  },

  async getProfile(): Promise<ApiResponse<User>> {
    return apiCall(config.ENDPOINTS.AUTH.PROFILE, {
      method: "GET",
    });
  },
};

// Service d'administration
export const adminService = {
  async getUsers(
    params?: Record<string, string>,
  ): Promise<PaginatedResponse<User>> {
    const query = params ? new URLSearchParams(params).toString() : "";
    return apiCall(`${config.ENDPOINTS.ADMIN.USERS}?${query}`, {
      method: "GET",
    });
  },

  async getBadges(): Promise<ApiResponse<Badge[]>> {
    return apiCall(config.ENDPOINTS.ADMIN.BADGES, {
      method: "GET",
    });
  },

  async createBadge(badgeData: Partial<Badge>): Promise<ApiResponse<Badge>> {
    return apiCall(config.ENDPOINTS.ADMIN.BADGES, {
      method: "POST",
      body: JSON.stringify(badgeData),
    });
  },

  async assignBadge(
    userId: number,
    badgeId: number,
  ): Promise<ApiResponse<UserBadge>> {
    return apiCall(`${config.ENDPOINTS.ADMIN.BADGES}/${badgeId}/assign`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
  },
};

// Service des activités
export const activityService = {
  async getGroups(): Promise<ApiResponse<ActivityGroup[]>> {
    return apiCall(config.ENDPOINTS.ACTIVITIES.GROUPS, {
      method: "GET",
    });
  },

  async createGroup(
    groupData: Partial<ActivityGroup>,
  ): Promise<ApiResponse<ActivityGroup>> {
    return apiCall(config.ENDPOINTS.ACTIVITIES.CREATE_GROUP, {
      method: "POST",
      body: JSON.stringify(groupData),
    });
  },

  async joinGroup(groupId: number): Promise<ApiResponse> {
    return apiCall(config.ENDPOINTS.ACTIVITIES.JOIN_GROUP, {
      method: "POST",
      body: JSON.stringify({ groupId }),
    });
  },
};

// Service des résidences
export const residenceService = {
  async getGroups(type?: string): Promise<ApiResponse<ResidenceGroup[]>> {
    const query = type ? `?type=${type}` : "";
    return apiCall(`${config.ENDPOINTS.RESIDENCES.GROUPS}${query}`, {
      method: "GET",
    });
  },

  async joinGroup(groupId: number): Promise<ApiResponse> {
    return apiCall(
      config.ENDPOINTS.RESIDENCES.JOIN.replace(":id", groupId.toString()),
      {
        method: "POST",
      },
    );
  },
};

// Service d'éducation
export const educationService = {
  async getFormations(): Promise<ApiResponse<EducationFormation[]>> {
    return apiCall(config.ENDPOINTS.EDUCATION.FORMATIONS, {
      method: "GET",
    });
  },

  async getProfessors(): Promise<ApiResponse<User[]>> {
    return apiCall(config.ENDPOINTS.EDUCATION.PROFESSORS, {
      method: "GET",
    });
  },

  async registerFormation(formationId: number): Promise<ApiResponse> {
    return apiCall(config.ENDPOINTS.EDUCATION.REGISTRATIONS, {
      method: "POST",
      body: JSON.stringify({ formationId }),
    });
  },
};

// Service des régions
export const regionService = {
  async getGroups(): Promise<ApiResponse<RegionGroup[]>> {
    return apiCall(config.ENDPOINTS.REGIONS.GROUPS, {
      method: "GET",
    });
  },

  async createGroup(
    groupData: Partial<RegionGroup>,
  ): Promise<ApiResponse<RegionGroup>> {
    return apiCall(config.ENDPOINTS.REGIONS.CREATE_GROUP, {
      method: "POST",
      body: JSON.stringify(groupData),
    });
  },

  async joinGroup(groupId: number): Promise<ApiResponse> {
    return apiCall(config.ENDPOINTS.REGIONS.JOIN_GROUP, {
      method: "POST",
      body: JSON.stringify({ groupId }),
    });
  },
};

// Service des organisations
export const organizationService = {
  async getGroups(
    organization?: string,
  ): Promise<ApiResponse<OrganizationGroup[]>> {
    const query = organization ? `?organization=${organization}` : "";
    return apiCall(`${config.ENDPOINTS.ORGANIZATIONS.GROUPS}${query}`, {
      method: "GET",
    });
  },

  async createGroup(
    groupData: Partial<OrganizationGroup>,
  ): Promise<ApiResponse<OrganizationGroup>> {
    return apiCall(config.ENDPOINTS.ORGANIZATIONS.CREATE_GROUP, {
      method: "POST",
      body: JSON.stringify(groupData),
    });
  },

  async joinGroup(groupId: number): Promise<ApiResponse> {
    return apiCall(config.ENDPOINTS.ORGANIZATIONS.JOIN_GROUP, {
      method: "POST",
      body: JSON.stringify({ groupId }),
    });
  },
};

// Service de la foi
export const faithService = {
  async getPosts(): Promise<ApiResponse<FaithPost[]>> {
    return apiCall(config.ENDPOINTS.FAITH.POSTS, {
      method: "GET",
    });
  },

  async getCommunities(): Promise<ApiResponse<FaithCommunity[]>> {
    return apiCall(config.ENDPOINTS.FAITH.COMMUNITIES, {
      method: "GET",
    });
  },

  async getBooks(): Promise<ApiResponse<HolyBook[]>> {
    return apiCall(config.ENDPOINTS.FAITH.BOOKS, {
      method: "GET",
    });
  },

  async createPost(
    postData: Partial<FaithPost>,
  ): Promise<ApiResponse<FaithPost>> {
    return apiCall(config.ENDPOINTS.FAITH.CREATE_POST, {
      method: "POST",
      body: JSON.stringify(postData),
    });
  },
};

// Service des amis
export const friendsService = {
  async getFriends(): Promise<ApiResponse<User[]>> {
    return apiCall(config.ENDPOINTS.FRIENDS.LIST, {
      method: "GET",
    });
  },

  async getRequests(): Promise<ApiResponse<FriendRequest[]>> {
    return apiCall(config.ENDPOINTS.FRIENDS.REQUESTS, {
      method: "GET",
    });
  },

  async sendRequest(receiverId: number): Promise<ApiResponse<FriendRequest>> {
    return apiCall(config.ENDPOINTS.FRIENDS.SEND_REQUEST, {
      method: "POST",
      body: JSON.stringify({ receiverId }),
    });
  },

  async respondRequest(
    requestId: number,
    status: "accepted" | "rejected",
  ): Promise<ApiResponse> {
    return apiCall(config.ENDPOINTS.FRIENDS.RESPOND_REQUEST, {
      method: "POST",
      body: JSON.stringify({ requestId, status }),
    });
  },
};

// Service principal qui combine tous les services
export const apiService = {
  auth: authService,
  admin: adminService,
  activities: activityService,
  residences: residenceService,
  education: educationService,
  regions: regionService,
  organizations: organizationService,
  faith: faithService,
  friends: friendsService,
};










