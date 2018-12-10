'use strict'

const sharp = require('sharp')

const resizer = {
  resize: (buffer, width, extension) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (extension === 'webp') {
          resolve(
            sharp(buffer)
            .resize({ width })
            .webp() // options here http://sharp.pixelplumbing.com/en/stable/api-output/#webp
            .toBuffer()
          )
        } else {
          resolve(
            sharp(buffer)
            .resize({ width })
            .toBuffer()
          )
        }
      } catch (err) {
        reject(err)
      }
    })
  }
}

module.exports = resizer
