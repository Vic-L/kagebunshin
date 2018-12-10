'use strict'

const gm = require('gm').subClass({imageMagick: true})

const resizer = {
  size: (buffer) => {
    return new Promise((resolve, reject) => {
      gm(buffer).size((err, size) => {
        if (err) {
          reject(err)
        } else {
          resolve(size)
        }
      })
    })
  },

  resize: (buffer, width, size) => {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(
          gm(buffer)
          .resize(Math.min(width, size.width), size.height / size.width * Math.min(width, size.width))
          .stream()
        )
      } catch (err) {
        reject(err)
      }
    })
  }
}

module.exports = resizer
