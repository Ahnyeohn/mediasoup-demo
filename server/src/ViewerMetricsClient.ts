import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';

// 설정되어 있을 때만 metrics 기능 사용.
const METRICS_AGENT_ADDR = process.env['METRICS_AGENT_ADDR'];

let client: any | undefined;
let initialized = false;

function initialize(): void
{
    if (initialized)
        return;

    initialized = true;

    // metrics agent 사용 안 하는 일반적인 mediasoup 실행.
    if (!METRICS_AGENT_ADDR)
    {
        return;
    }

    try
    {
        const protoPath =
            process.env['SYSINFO_PROTO_PATH'] ??
            path.resolve(process.cwd(), 'sysinfo.proto');

        const packageDefinition = protoLoader.loadSync(
            protoPath,
            {
                keepCase: true,
                longs: String,
                enums: String,
                defaults: true,
                oneofs: true
            }
        );

        const grpcObject =
            grpc.loadPackageDefinition(packageDefinition) as any;

        const SysInfoService =
            grpcObject.sysinfo.SysInfoService;

        client = new SysInfoService(
            METRICS_AGENT_ADDR,
            grpc.credentials.createInsecure()
        );

        console.log(
            `[viewer-metrics] enabled [addr:${METRICS_AGENT_ADDR}]`
        );
    }
    catch (error)
    {
        // 매우 중요:
        // metrics 초기화 실패가 mediasoup 실행 실패로 이어지면 안 됨.
        console.warn(
            '[viewer-metrics] initialization failed, metrics disabled:',
            error
        );

        client = undefined;
    }
}

export function reportViewerCount(viewerCount: number): void
{
    initialize();

    // Metrics 기능을 사용하지 않는 경우.
    if (!client)
        return;

    client.updateViewerCount(
        {
            viewer_count: viewerCount
        },
        {
            deadline: Date.now() + 500
        },
        (error: grpc.ServiceError | null) =>
        {
            if (error)
            {
                // metrics agent가 죽어 있어도 무시.
                console.debug(
                    `[viewer-metrics] report failed: ${error.message}`
                );
            }
        }
    );
}