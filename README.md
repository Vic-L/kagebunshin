# ARCHITECTURE EXPLANATION

# USAGE

Prepare an S3 bucket (srcBucket) where you will upload the images, and another different S3 bucket (dstBucket) to where new images will be resized and copied over.

Create/update an `env.yml` file in the root directory, copy and paste the content of `env.sample.yml` in it, and fill up the respective values.

Install docker.

Time to deploy!

## DEPLOYMENT

To deploy to AWS using named profile:

`npm run deploy`

## DEVELOPMENT

This project is meant to be plug and play. In the event you need something more than what is set up, you can develop and debug.

Before you start development, create a pair of `src` and `dst` buckets for development purpose. Upload an image in your `src` bucket. This is because during development, the copying of files from `src` bucket to `dst` will be executed on the AWS.

In the `event.json` file, replace `<BUCKET_NAME>` with your `src` bucket name and `<PATH_TO_IMAGE>` with the path to the image in the `src` bucket. The `json` inside `event.json` follows the [exact JSON structure of a S3 put event](https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-s3-put).

Then run this command to debug:

```
npm run installsharp # ensures installs binary
sls invoke local -f onUpload -p event.json
```

The first command will download the sharp folder that fits your local machine. It can be skipped if you have run it at least once after your lattest deploy to production.

The second command will call the `onUpload` function using the content in `event.json` as the `event` param.

# FEATURES
In the `env.yml` file, append widths that you want to crop the image according to to the `widths` variable, separated by comma. Follow the syntax as shown in `env.sample.yml` file.

Uses `sharp` to resize and produce produce extra image of the `webp` format. This will require lambda to have the correct binary. That is [easily installed with the `sharp` package with `npm`](http://sharp.pixelplumbing.com/en/stable/install/#aws-lambda) and [easily uploaded to lambda using docker](https://github.com/lovell/sharp/issues/1306#issuecomment-412498001).


## TODOs
* code in a way that can use other cloud providers
