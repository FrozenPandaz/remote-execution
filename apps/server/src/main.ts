import { join } from 'path';

const PROTO_PATH = join(__dirname, '../../../../');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
// const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
