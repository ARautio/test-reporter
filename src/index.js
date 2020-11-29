const express = require('express')
const bodyParser = require('body-parser')
var fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const { series } = require('async')

const app = express()

const DIRECTORY = process.env.DIRECTORY || path.join(__dirname, '../data/')

const getDate = () => {
  let date_ob = new Date()
  let date = ('0' + date_ob.getDate()).slice(-2)
  let month = ('0' + (date_ob.getMonth() + 1)).slice(-2)
  let year = date_ob.getFullYear()
  let hours = date_ob.getHours()
  let minutes = date_ob.getMinutes()
  let seconds = date_ob.getSeconds()
  return (
    year +
    '-' +
    month +
    '-' +
    date +
    ' ' +
    hours +
    ':' +
    minutes +
    ':' +
    seconds
  )
}

app.use(express.static('reports'))

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {})

app.post('/report', function (req, res) {
  console.log(req.body)
  // @TODO: Better check for the inputs
  if (req.body !== undefined) {
    fs.writeFile(
      DIRECTORY + 'report-' + getDate() + '.json',
      JSON.stringify(req.body),
      function (err) {
        if (err) {
          return console.log(err)
        }
        console.log('The file was saved!')
        res.send('File saved')
      }
    )
    series([exec('npm run merge'), exec('npm run report')])
  } else {
    res.send('No file to save')
  }
})

app.listen(3000, () => {
  console.log('Started on PORT 3000')
})
