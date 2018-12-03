'use strict'

const handleS3Error = require('./helpers/errors').handleS3Error
const resizer = require('./helpers/resizer')
const AWS = require('aws-sdk')

module.exports.onUpload = async (event, context) => {
  try {
    const srcS3 = event.Records[0].s3

    console.log("srcS3", srcS3)

    const srcBucket = srcS3.bucket.name
    const srcKey = srcS3.object.key

    const srcParams = {
      Bucket: srcBucket,
      Key: unescape(srcKey)
    }

    const s3 = new AWS.S3({
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    })

    const srcObject = await s3.getObject(srcParams).promise()

    const dstBucket = process.env.DST_BUCKET_NAME

    const acceptedContentTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!acceptedContentTypes.includes(srcObject.ContentType)) {
      throw(`Invalid image type. Accepted Content Types are ${acceptedContentTypes.join(', ')}`)
    }

    // copy original
    const dstParams = {
      Bucket: dstBucket,
      Key: srcKey,
      ACL: "public-read",
      Body: srcObject.Body,
      CacheControl: "public, max-age=604800"
    }

    await s3.putObject(dstParams).promise()

    console.log("Uploaded original copy")

      // resize and upload the rest
    const widths = [400, 768, 1200]
    const size = await resizer.size(srcObject.Body)

    for (const width of widths) {

      const buffer = await resizer.resize(srcObject.Body, width, size)

      // add dimension to name of file
      let dstKey = srcKey.replace(/\.(jpg|png|jpeg)$/, `_${width}.$1`)

      const dstParams = {
        Bucket: dstBucket,
        Key: dstKey,
        Body: buffer,
        ACL: "public-read",
        ContentType: srcObject.ContentType,
        CacheControl: "public, max-age=604800"
      }

      await s3.upload(dstParams).promise()

      console.log(`Uploaded ${width} copy`)
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Successfully resized",
      }),
    }
  } catch (err) {
    return handleS3Error(err)
  }
}
