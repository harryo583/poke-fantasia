// /config/config.js

module.exports = {
    aws: {
      region: process.env.AWS_REGION || 'us-east-2',
    },
    s3: {
      bucketName: process.env.S3_BUCKET_NAME || 'pokefantasia',
      folderOption1: 'poketypeid/',
      folderOption2: 'poketypecov/',
      folderOption3: 'pokeformatcov/',
    },
    rds: {
      endpoint: process.env.RDS_ENDPOINT || 'mysql-nu-cs310-bowencheng.c9uw0eiqafp7.us-east-2.rds.amazonaws.com',
      port: process.env.RDS_PORT || 3306,
      region: process.env.RDS_REGION || 'us-east-2',
      username: process.env.RDS_USERNAME || 'pokefantasia-read-write',
      password: process.env.RDS_PASSWORD,
      database: process.env.RDS_DB_NAME || 'pokefantasia',
    },
    awsReadOnly: {
      accessKeyId: process.env.AWS_READONLY_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_READONLY_SECRET_ACCESS_KEY,
      region: process.env.AWS_READONLY_REGION || 'us-east-2',
    },
    awsReadWrite: {
      accessKeyId: process.env.AWS_READWRITE_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_READWRITE_SECRET_ACCESS_KEY,
      region: process.env.AWS_READWRITE_REGION || 'us-east-2',
    },
  };
  