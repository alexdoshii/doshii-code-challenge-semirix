import {
  DatabaseOperations,
  REWARD_FIELDS,
  RewardCreatePayload,
  RewardDeletePayload,
  RewardModel,
  RewardModifyPayload,
  RewardReadPayload,
  RewardUpdatePayload,
  SearchRewardsPayload,
  SearchUsersPayload,
  USER_FIELDS,
  UserCreatePayload,
  UserDeletePayload,
  UserModel,
  UserReadFromEmailPayload,
  UserReadPayload,
  UserUpdatePayload,
} from "."
import sqlite3 from "sqlite3"
import { Database, open } from "sqlite"

export const connect = async () => {
  const database = await open({
    filename: ":memory:",
    driver: sqlite3.Database,
  })

  await database.migrate({ migrationsPath: "./migrations" })

  return database
}

export class SQLiteDatabase implements DatabaseOperations {
  database: Database<sqlite3.Database, sqlite3.Statement>

  constructor(database: Database<sqlite3.Database, sqlite3.Statement>) {
    this.database = database
  }

  ///////////////////////////////////////////////////////////////////////////////
  //  USER
  ///////////////////////////////////////////////////////////////////////////////
  async userCreate(payload: UserCreatePayload) {
    await this.database.run(
      "INSERT INTO users (email, name, rewards) VALUES (:email, :name, :rewards)",
      {
        ":email": payload.email,
        ":name": payload.name,
        ":rewards": "{}",
      }
    )
  }

  async userRead(payload: UserReadPayload): Promise<UserModel> {
    const result = await this.database.get<UserModel>(
      "SELECT * FROM users WHERE id = ?",
      payload.id
    )

    if (result) {
      return result
    } else {
      throw Error(`Could not find user with id: "${payload.id}"`)
    }
  }

  async userReadFromEmail({
    email,
    fields,
    resolveRewards,
  }: UserReadFromEmailPayload): Promise<any> {
    // Deduplicate
    fields = fields ? Array.from(new Set(fields)) : []

    // Validate user input
    for (const field of fields) {
      if (!USER_FIELDS.find((item) => item === field)) {
        throw Error(`Invalid field: "${field}"`)
      }
    }

    // Join the fields or if none, grab all
    const join = fields.length !== 0 ? fields.join(", ") : "*"

    // I wish to never do this again :(
    const sql = !resolveRewards
      ? `SELECT ${join} FROM users WHERE email = ?`
      : `SELECT ${join},
             (
               SELECT json_group_object(
                 json_each.key,
                 json_object(
                    'name', r.name,
                    'description', r.description,
                    'claimed', CASE json_each.value WHEN 1 THEN json('true') ELSE json('false') END
                  )
               )
               FROM json_each(u.rewards)
               JOIN rewards AS r ON r.id = CAST(json_each.key AS INTEGER)
             ) AS rewards_resolved
          FROM users AS u
          WHERE u.email = ?`

    const result = await this.database.get(sql, email)

    if (result) {
      return result
    } else {
      throw Error(`Could not find user with email: "${email}"`)
    }
  }

  async userUpdate(payload: UserUpdatePayload) {
    await this.database.run(
      "UPDATE users SET name = :name, email = :email, rewards = :rewards WHERE id = :id",
      {
        ":id": payload.id,
        ":name": payload.name,
        ":email": payload.email,
        ":rewards": payload.rewards,
      }
    )
  }

  async userDelete(payload: UserDeletePayload) {
    await this.database.run("DELETE FROM users WHERE id = ?", payload.id)
  }

  ///////////////////////////////////////////////////////////////////////////////
  //  REWARDS
  ///////////////////////////////////////////////////////////////////////////////
  async rewardCreate(payload: RewardCreatePayload) {
    await this.database.run(
      "INSERT INTO rewards (name, description, expires) VALUES (:name, :description, :expires)",
      {
        ":name": payload.name,
        ":description": payload.description,
        ":expires": payload.expires,
      }
    )
  }

  async rewardRead({ id }: RewardReadPayload): Promise<RewardModel> {
    const result = await this.database.get(
      "SELECT * FROM rewards WHERE id = ?",
      id
    )

    if (result) {
      return result
    } else {
      throw Error(`Could not retrieve reward with id "${id}"`)
    }
  }

  async rewardUpdate(payload: RewardUpdatePayload) {
    await this.database.run(
      "UPDATE rewards SET name = :name, description = :description, expires = :expires WHERE id = :id",
      {
        ":id": payload.id,
        ":name": payload.name,
        ":description": payload.description,
        ":expires": payload.expires,
      }
    )
  }

  async rewardDelete(payload: RewardDeletePayload) {
    await this.database.run(
      "DELETE FROM rewards WHERE id = :id; UPDATE users SET rewards = json_remove(rewards, '$.:id');",
      { ":id": payload.id }
    )
  }

  async rewardApply({ id, email }: RewardModifyPayload) {
    const rewards = JSON.parse(
      (await this.userReadFromEmail({ email, fields: ["rewards"] })).rewards
    )

    if (rewards[id] !== undefined) throw Error("Cannot re-apply a reward")

    // TODO: This is a SQL injection vector and should be fixed
    await this.database.run(
      `UPDATE users SET rewards = json_insert(rewards, '$.${id}', false) WHERE email = :email`,
      email
    )
  }

  async rewardRevoke({ id, email }: RewardModifyPayload) {
    const rewards = JSON.parse(
      (await this.userReadFromEmail({ email, fields: ["rewards"] })).rewards
    )

    if (rewards[id] === undefined) throw Error("Nothing to revoke!")
    if (rewards[id] === true)
      throw Error("Cannot revoke a reward that's been claimed!")

    // TODO: This is a SQL injection vector and should be fixed
    await this.database.run(
      `UPDATE users SET rewards = json_remove(rewards, '$.${id}') WHERE email = ?`,
      email
    )
  }

  async rewardClaim({ id, email }: RewardModifyPayload) {
    const rewards = JSON.parse(
      (await this.userReadFromEmail({ email, fields: ["rewards"] })).rewards
    )
    const reward = await this.rewardRead({ id })
    const timestamp = Date.now()

    console.log(reward)

    if (rewards[id] === undefined)
      throw Error("Cannot claim an unapplied reward!")
    if (rewards[id] === true) throw Error("Cannot re-claim a reward!")
    if (reward.expires < timestamp)
      throw Error("Cannot claim a reward that has expired!")

    // TODO: This is a SQL injection vector and should be fixed
    await this.database.run(
      `UPDATE users SET rewards = json_replace(rewards, '$.${id}', true) WHERE email = ?`,
      email
    )
  }

  ///////////////////////////////////////////////////////////////////////////////
  //  ALL
  ///////////////////////////////////////////////////////////////////////////////
  async allUsers(): Promise<UserModel[]> {
    const result = await this.database.all("SELECT * FROM users")

    if (result) {
      return result
    } else {
      throw Error("Could not retrieve all users!")
    }
  }

  async allRewards(): Promise<RewardModel[]> {
    const result = await this.database.all("SELECT * FROM rewards")

    if (result) {
      return result
    } else {
      throw Error("Could not retrieve all users!")
    }
  }

  ///////////////////////////////////////////////////////////////////////////////
  //  SEARCH
  ///////////////////////////////////////////////////////////////////////////////
  async searchUsers({
    search,
    column,
    fields,
    resolveRewards,
  }: SearchUsersPayload): Promise<UserModel[]> {
    // `toString()` is to make TS shut up
    if (column.toString() !== "name" && column.toString() !== "email")
      throw Error("Invalid column!")

    // Deduplicate
    fields = fields ? Array.from(new Set(fields)) : []

    // Validate user input
    for (const field of fields) {
      if (!USER_FIELDS.find((item) => item === field)) {
        throw Error(`Invalid field: "${field}"`)
      }
    }

    // Join the fields or if none, grab all
    const join = fields.length !== 0 ? fields.join(", ") : "*"

    // I wish to never do this again :(
    const sql = !resolveRewards
      ? `SELECT ${join} FROM users WHERE ${column} LIKE '%' || ? || '%'`
      : `SELECT ${join},
             (
               SELECT json_group_object(
                 json_each.key,
                 json_object(
                    'name', r.name,
                    'description', r.description,
                    'claimed', CASE json_each.value WHEN 1 THEN json('true') ELSE json('false') END
                  )
               )
               FROM json_each(u.rewards)
               JOIN rewards AS r ON r.id = CAST(json_each.key AS INTEGER)
             ) AS rewards_resolved
          FROM users AS u
          WHERE u.${column} LIKE '%' || ? || '%'`

    const result = await this.database.all(sql, search)

    if (result) {
      return result
    } else {
      throw Error("Could not search users!")
    }
  }

  async searchRewards({
    search,
    column,
    fields,
  }: SearchRewardsPayload): Promise<RewardModel[]> {
    // `toString()` is to make TS shut up
    if (column.toString() !== "name" && column.toString() !== "description")
      throw Error("Invalid column!")

    // Deduplicate
    fields = fields ? Array.from(new Set(fields)) : []

    // Validate user input
    for (const field of fields) {
      if (!REWARD_FIELDS.find((item) => item === field)) {
        throw Error(`Invalid field: "${field}"`)
      }
    }

    // Join the fields or if none, grab all
    const join = fields.length !== 0 ? fields.join(", ") : "*"

    const result = await this.database.all(
      `SELECT ${join} FROM rewards WHERE ${column} LIKE '%' || ? || '%'`,
      search
    )

    if (result) {
      return result
    } else {
      throw Error("Could not search users!")
    }
  }
}
