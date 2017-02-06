'use strict'

const fs = require('fs')

module.exports = {
  parseFile: function() {
    return new Promise((resolve, reject) => {
      let data, columns, i
      let counter = 0
      fs.readFile('./data/athletes.txt', 'utf8', (err, data) => {
        if (err) throw new Error(err)
        data = data.toString().split('\r\n')
        for (i = 0; i < data.length  ; i++) {
          columns = data[i].split(',')
          if (columns[9]) counter += parseInt(columns[9])
        }
        resolve(counter)
      })
    })
  }
}
