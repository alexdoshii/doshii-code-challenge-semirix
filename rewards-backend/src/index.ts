import express from "express"
import { SQLiteDatabase, connect } from "./database/sqlite"

const app = express()
const port = 3030
const database = new SQLiteDatabase(await connect())

///////////////////////////////////////////////////////////////////////////////
//  SETUP
///////////////////////////////////////////////////////////////////////////////
app.use((_, response, next) => {
  response.header("Access-Control-Allow-Origin", "*")
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  )
  response.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  )
  next()
})

app.use(express.json())

app.get("/", (_, res) => {
  res.send("Nothing to see here!")
})

///////////////////////////////////////////////////////////////////////////////
//  USERS
///////////////////////////////////////////////////////////////////////////////
app.put("/users/create", async (request, response) => {
  const { name, email } = request.body
  await database.userCreate({ name, email, rewards: {} })

  response.send({ success: true })
})

app.get("/users/get/:id", async (request, response) => {
  const { id } = request.params
  const result = await database.userRead({ id })

  response.send({ success: true, data: result })
})

app.post("/users/get-by-email/:email", async (request, response) => {
  const { email } = request.params
  const data = request.body

  const result = await database.userReadFromEmail({ email, ...data })

  response.send({ success: true, data: result })
})

app.post("/users/update/:id", async (request, response) => {
  const { id } = request.params
  const data = request.body

  try {
    await database.userUpdate({ id, ...data })

    response.send({ success: true })
  } catch (error: any) {
    response.status(500).send({ success: false, error: error.toString() })
  }
})

app.delete("/users/delete/:id", async (request, response) => {
  const { id } = request.params

  try {
    await database.userDelete({ id })

    response.send({ success: true })
  } catch (error: any) {
    response.status(500).send({ success: false, error: error.toString() })
  }
})

///////////////////////////////////////////////////////////////////////////////
//  REWARDS
///////////////////////////////////////////////////////////////////////////////
app.get("/rewards/create", async (request, response) => {
  const { name, description, expires } = request.body
  await database.rewardCreate({ name, description, expires })

  response.send({ success: true })
})

app.get("/rewards/get/:id", async (request, response) => {
  const { id } = request.params
  const result = await database.rewardRead({ id })

  response.send({ success: true, data: result })
})

app.post("/rewards/update/:id", async (request, response) => {
  const { id } = request.params
  const data = request.body

  try {
    await database.rewardUpdate({ id, ...data })

    response.send({ success: true })
  } catch (error: any) {
    response.status(500).send({ success: false, error: error.toString() })
  }
})

app.delete("/rewards/delete/:id", async (request, response) => {
  const { id } = request.params

  try {
    await database.rewardDelete({ id })

    response.send({ success: true })
  } catch (error: any) {
    response.status(500).send({ success: false, error: error.toString() })
  }
})

app.post("/rewards/apply/:id/:email", async (request, response) => {
  const { id, email } = request.params

  try {
    await database.rewardApply({ id, email })
    response.send({ success: true })
  } catch (error: any) {
    response.status(500).send({ success: false, error: error.toString() })
  }
})

app.post("/rewards/revoke/:id/:email", async (request, response) => {
  const { id, email } = request.params

  try {
    await database.rewardRevoke({ id, email })
    response.send({ success: true })
  } catch (error: any) {
    response.status(500).send({ success: false, error: error.toString() })
  }
})

app.post("/rewards/claim/:id/:email", async (request, response) => {
  const { id, email } = request.params

  try {
    await database.rewardClaim({ id, email })
    response.send({ success: true })
  } catch (error: any) {
    response.status(500).send({ success: false, error: error.toString() })
  }
})

///////////////////////////////////////////////////////////////////////////////
//  ALL
///////////////////////////////////////////////////////////////////////////////
app.get("/users/all", async (_, response) => {
  const result = await database.allUsers()

  response.send({ success: true, data: result })
})

app.get("/rewards/all", async (_, response) => {
  const result = await database.allRewards()

  response.send({ success: true, data: result })
})

///////////////////////////////////////////////////////////////////////////////
//  SEARCH
///////////////////////////////////////////////////////////////////////////////
app.post("/search/users/:column/:search", async (request, response) => {
  const { column, search } = request.params

  const result = await database.searchUsers({
    column: column as any,
    search,
    ...request.body,
  })

  response.send({ success: true, data: result })
})

app.post("/search/rewards/:column/:search", async (request, response) => {
  const { column, search } = request.params

  try {
    const result = await database.searchRewards({
      column: column as any,
      search,
      ...request.body,
    })

    response.send({ success: true, data: result })
  } catch (error: any) {
    response.status(500).send({ success: false, error: error.toString() })
  }
})

///////////////////////////////////////////////////////////////////////////////
//  LISTEN
///////////////////////////////////////////////////////////////////////////////
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
