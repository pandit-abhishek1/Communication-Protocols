# HTTP/2 + gRPC: Architecture and Sequence Flows

gRPC uses HTTP/2 with protobuf for efficient, strongly-typed, and streaming RPC. Ideal for service-to-service communication.

## When to Use
- Internal microservices needing low latency and strong typing.
- Bi-directional streaming (chat, telemetry, pipelines).
- Backpressure with HTTP/2 flow control.

Avoid when:
- You must support legacy HTTP/1.1-only clients (browsers without gRPC-web).
- You require human-friendly payloads without tooling.

## Layering
- App: gRPC (protobuf), streaming (client/server/bidi), deadlines
- Session/Transport: HTTP/2 over TCP, header compression (HPACK)
- Security: TLS 1.3 with mTLS inside cluster
- Network: IPv4/IPv6

## Sequence: gRPC Unary Call (A → B)
```mermaid
sequenceDiagram
  participant A as Service A (Client)
  participant B as Service B (Server)

  A->>B: TCP connect
  <!-- A->>B: TLS 1.3 handshake (mTLS; ALPN: h2) -->
  Note over A,B: HTTP/2 connection established (multiplexed)

  A->>B: HEADERS :method=POST :path=/orders.Orders/Get
  A->>B: DATA (protobuf request)
  B-->>A: HEADERS 200
  B-->>A: DATA (protobuf response)
  B-->>A: TRAILERS grpc-status:0
```

## Architecture Notes
- One long-lived HTTP/2 connection per peer with many multiplexed streams.
- Enforce deadlines/timeouts on all RPCs; propagate via metadata.
- Use service mesh (mTLS, retries, circuit breaking, telemetry).
- For browsers, use gRPC-Web through an Envoy/ingress proxy.

## Streaming Patterns
- Server streaming for feeds/logs.
- Client streaming for uploads/aggregation.
- Bidi for interactive sessions; implement flow control and backpressure.

## Performance Tips
- Keep messages small; prefer streaming for large datasets.
- Reuse channels; avoid per-request connections.
- Tune max concurrent streams; monitor flow control windows.
- Compress payloads (gzip) selectively; protobuf is already efficient.

## Security
- mTLS with SPIFFE/SPIRE identities.
- AuthZ via service accounts and RBAC; pass JWTs in metadata if needed.
- Validate proto schemas; enforce message size limits.

## Testing and Tools
- grpcurl, Evans, BloomRPC, Postman (gRPC).
- Observability: OpenTelemetry interceptors; trace spans per RPC.
- Bench: ghz, fortio.