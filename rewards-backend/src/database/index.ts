///////////////////////////////////////////////////////////////////////////////
//  MODELS
///////////////////////////////////////////////////////////////////////////////
export interface UserModel {
  id: string
  email: string
  name: string
  rewards: {
    [id: string]: boolean
  }
}

export interface RewardModel {
  id: string
  name: string
  description: string
  expires: number
}

type UserFields = "id" | "name" | "email" | "dob" | "rewards"

export const USER_FIELDS: UserFields[] = [
  "id",
  "name",
  "email",
  "dob",
  "rewards",
]

type RewardFields = "id" | "name" | "description" | "expires"

export const REWARD_FIELDS: RewardFields[] = [
  "id",
  "name",
  "description",
  "expires",
]

///////////////////////////////////////////////////////////////////////////////
//  PAYLOADS
///////////////////////////////////////////////////////////////////////////////

export interface UserCreatePayload {
  name: string
  email: string
  rewards: {
    [id: string]: boolean
  }
}

export interface UserReadPayload {
  id: string
}

export interface UserReadFromEmailPayload {
  email: string
  fields?: UserFields[]
  resolveRewards?: boolean
}

export interface UserUpdatePayload {
  id: string
  name: string
  email: string
  rewards: string
}

export interface UserDeletePayload {
  id: string
}

///////////////////////////////////////////////////////////////////////////////

export interface RewardCreatePayload {
  name: string
  description: string
  expires: number
}

export interface RewardReadPayload {
  id: string
}

export interface RewardUpdatePayload {
  id: string
  name: string
  description: string
  expires: number
}

export interface RewardDeletePayload {
  id: string
}

export interface RewardModifyPayload {
  id: string
  email: string
}

///////////////////////////////////////////////////////////////////////////////

export interface SearchUsersPayload {
  search: string
  column: "name" | "email"
  fields?: UserFields[]
  resolveRewards?: boolean
}

export interface SearchRewardsPayload {
  search: string
  column: "name" | "description"
  fields?: RewardFields[]
}

///////////////////////////////////////////////////////////////////////////////
//  MAIN
///////////////////////////////////////////////////////////////////////////////
export interface DatabaseOperations {
  // User
  userCreate: (payload: UserCreatePayload) => Promise<void>
  userRead: (payload: UserReadPayload) => Promise<UserModel>
  userReadFromEmail: (payload: UserReadFromEmailPayload) => Promise<any>
  userUpdate: (payload: UserUpdatePayload) => Promise<void>
  userDelete: (payload: UserDeletePayload) => Promise<void>
  // Reward
  rewardCreate: (payload: RewardCreatePayload) => Promise<void>
  rewardRead: (payload: RewardReadPayload) => Promise<RewardModel>
  rewardUpdate: (payload: RewardUpdatePayload) => Promise<void>
  rewardDelete: (payload: RewardDeletePayload) => Promise<void>
  rewardApply: (payload: RewardModifyPayload) => Promise<void>
  rewardRevoke: (payload: RewardModifyPayload) => Promise<void>
  rewardClaim: (payload: RewardModifyPayload) => Promise<void>
  // All
  allUsers: () => Promise<UserModel[]>
  allRewards: () => Promise<RewardModel[]>
  // Search
  searchUsers: (payload: SearchUsersPayload) => Promise<UserModel[]>
  searchRewards: (payload: SearchRewardsPayload) => Promise<RewardModel[]>
}
