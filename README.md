# ARCHITECTURE EXPLANATION

# USAGE

Prepare an S3 bucket (srcBucket) where you will upload the images, and another different S3 bucket (dstBucket) to where new images will be resized and copied over.

Create/update an `env.yml` file in the root directory, copy and paste the content of `env.sample.yml` in it, and fill up the respective values.

Time to deploy!

## DEPLOYMENT

To deploy to AWS using named profile:

`sls deploy --stage prod`

## DEVELOPMENT

This project is meant to be plug and play. In the event you need something more than what is set up, you can develop and debug.

Before you start development, you might want to create a separate pair of `src` and `dst` buckets for development purpose. Whichever the case, upload an image in your `src` bucket.

Uncomment the section below `## UNCOMMENT FOR DEVELOPMENT` in serverless.yml file to allow triggering the function via a http call.

The purpose of the http call is to simulate an S3 put event. Use [postman](https://www.getpostman.com/) or a similar service to mock the api request.

It should be a `POST` request to the url `http://localhost:8000/onUpload`, with an `application/json` type body like below:

```
{
  "s3SchemaVersion": "1.0",
  "configurationId": "onUpload",
  "bucket":  {
    "name": "<BUCKET_NAME>",
    "ownerIdentity": { "principalId": "something" },
    "arn": "something"
  },
  "object": {
    "key": "<path/to/image.jpg>",
    "size": 10000,
    "eTag": "something",
    "sequencer": "something"
  }
}
```

This is the exact [JSON structure of a S3 put event](https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-s3-put).

Replace the `<BUCKET_NAME>` and `path/to/image.jpg` accordingly to your object in an S3 bucket.

Then run this command to start development:

`sls offline start`

Press send in postman to start the process. Note the the image is resized and copied in the cloud, although you are doing development work.