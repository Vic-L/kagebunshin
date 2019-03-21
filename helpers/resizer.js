'use strict'

const sharp = require('sharp')

const resizer = {
  resize: (buffer, width, extension) => {
    return new Promise(async (resolve, reject) => {
      // check for extension to decide whether to convert to webp format
      // check for width to decide whether to initialize sharp object or just return buffer as converting to sharp object may result in bigger size than original
      try {
        if (extension === 'webp') {
          if (width) {
            resolve(
              sharp(buffer)
              .resize({ width })
              .webp() // options here http://sharp.pixelplumbing.com/en/stable/api-output/#webp
              .toBuffer()
            )
          } else if (width === 0) {
            // low quality image for blur up
            resolve(
              sharp(buffer)
              .webp({ quality: 20, force: true })
              .resize({ width: 20 })
              .toBuffer()
            )
          } else {
            // if width is isNaN, it is the original dimension, just erturn as buffer
            resolve(buffer)
          }
        } else {
          if (width) {
            resolve(
              sharp(buffer)
              .resize({ width })
              .toBuffer()
            )
          } else if (width === 0) {
            // low quality image for blur up
            resolve(
              sharp(buffer)
              .jpeg({ quality: 20, force: false })
              .png({ quality: 20, force: false })
              .resize({ width: 20 })
              .toBuffer()
            )
          } else {
            // if width is isNaN, it is the original dimension, just erturn as buffer
            resolve(buffer)
          }
        }
      } catch (err) {
        reject(err)
      }
    })
  }
}

module.exports = resizer
