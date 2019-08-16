import { Controller, Get, OnModuleInit } from '@nestjs/common';

import { Client, ClientGrpc, GrpcMethod, Transport } from '@nestjs/microservices';
import { join } from 'path';
import * as crypto from 'crypto';
import { readFileSync } from "fs";


@Controller()
export class AppController {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50051',
      package: 'build.bazel.remote.execution.v2',
      protoPath: join(__dirname, '../../../protos/remote_execution.proto'),
      loader: {
        includeDirs: [
          join(__dirname, '../../../../remote-apis'),
          join(__dirname, '../../../../googleapis')
        ]
      }
    }
  })
  client: ClientGrpc;

  onModuleInit(data, metadata: any) {
    // const capabilities = this.client.getService<any>('Capabilities');
    // capabilities.getCapabilities({}).subscribe(capabilities => {
    //   console.log(capabilities.cacheCapabilities)
    // })
    const service = this.client.getService<any>('ContentAddressableStorage');
    const hash = crypto.createHash('sha256');
    const buffer = readFileSync(join(__dirname, '../../../package.json'));
    hash.update(buffer);
    service.batchUpdateBlobs({
      requests: [
        {
          digest: {
            hash: hash.digest('hex'),
            size_bytes: buffer.length
          },
          data: buffer
        }]

    }).subscribe(res => {
      console.log(res.responses);
    });
      // console.log(res.responses[0].digest.hash.length)});
  }
}
