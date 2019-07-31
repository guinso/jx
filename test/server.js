const express = require('express')
const app = express()
const port = 8080

app.use(express.static('test/public'))
app.use(express.static('dist'))

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log('server is listening ' + port)
})