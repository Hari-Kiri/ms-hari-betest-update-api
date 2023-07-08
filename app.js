import express from 'express'
import connectToDatabase from './module/ConnectToDatabase.js'
import UserDataModel from './model/UserData.js'
import { model } from 'mongoose'
import DeleteModel from './module/DeleteModel.js'
import DisconnectFromDatabase from './module/DisconnectFromDatabase.js'

const app = express()

app.use(express.json())

app.put('/update', (request, response) => {

	connectToDatabase(process.env.DATABASE_CONNECTION_URL)

	model("userdata", UserDataModel()).updateMany({id: request.body.id}, {
		username: request.body.username,
		emailAddress: request.body.emailAddress,
	}).then((result) => {
		response.writeHead(200, {'Content-Type': 'application/json'}).end(JSON.stringify({
			code: 200,
			response: true,
			message: result
		}))
		console.log("update user data success")
	}).catch((error) => {
		response.writeHead(500, {'Content-Type': 'application/json'}).end(JSON.stringify({
			code: 500,
			response: false,
			message: "failed update user data"
		}))
		console.error(`update user data failed: ${error}`)
	}).finally(() => {
		DeleteModel("userdata")
		DisconnectFromDatabase()
		console.log("database disconnected and connection model deleted")
	})

})

app.listen(process.env.HTTP_PORT, () => {
	console.log(`Example app listening on port ${process.env.HTTP_PORT}`)
})
