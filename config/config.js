// /config/config.js
require('dotenv').config();

module.exports = {
  aws: {
    region: "us-east-2",
  },
  s3: {
    bucketName: "pokefantasia",
    folderOption1: "poketypeid/",
    folderOption2: "poketypecov/",
    folderOption3: "pokeformatcov/",
  },
  rds: {
    endpoint:
      "mysql-nu-cs310-bowencheng.c9uw0eiqafp7.us-east-2.rds.amazonaws.com",
    port: 3306,
    region: "us-east-2",
    username: "pokefantasia-read-write",
    password: process.env.RDS_PASSWORD,
    database: "pokefantasia",
  },
  awsReadOnly: {
    accessKeyId: process.env.AWS_READONLY_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_READONLY_SECRET_ACCESS_KEY,
    region: "us-east-2",
  },
  awsReadWrite: {
    accessKeyId: process.env.AWS_READWRITE_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_READWRITE_SECRET_ACCESS_KEY,
    region: "us-east-2",
  },
  api: {
    baseurl: "https://wjn8x8icte.execute-api.us-east-2.amazonaws.com/prod"
  }
};
