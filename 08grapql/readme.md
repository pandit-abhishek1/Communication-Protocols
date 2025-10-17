# GraphQL: Architecture and Sequence Flows

GraphQL is a query language and runtime that lets clients request exactly the data they need across multiple backends via a single endpoint. It is transport-agnostic but commonly uses HTTP(S) for queries/mutations and WebSocket or SSE for subscriptions.

## When to Use
- Aggregate data from multiple services into one schema (BFF/API Gateway).
- Product teams need flexible queries without backend changes.
- Strong typing, introspection, and schema-driven tooling/codegen.

Avoid when:
- Simple CRUD APIs with stable shapes (REST may be simpler).
- Heavy unbounded queries without governance (risk of DoS/N+1).

## Layering
- Application: GraphQL schema (SDL), resolvers, directives, persisted queries, federation
- Transport: HTTP/1.1 or HTTP/2 for queries/mutations; WebSocket (graphql-transport-ws) or SSE for subscriptions
- Security: TLS 1.2+ (prefer 1.3); auth via headers/cookies; field-level auth
- Network: IPv4/IPv6, CDN/edge caches for persisted GETs

## Reference Architecture

```mermaid
flowchart LR
  subgraph Clients
    W[Web/Mobile Clients]
    Svc[Internal Services]
  end

  subgraph Edge
    CDN["CDN/Edge Cache"]
    WAF["WAF/Firewall"]
    LB["Load Balancer/Ingress"]
  end

  subgraph GraphQL
    GW["GraphQL Gateway<br/>(Apollo/Helix/Yoga)"]
    DLoader["Dataloader/Batching"]
    Cache["(Response Cache/Query Cache)"]
  end

  subgraph Backends
    REST[REST APIs]
    GRPC[gRPC Services]
    DB[(Databases)]
    SvcA[Service A]
    SvcB[Service B]
  end

  W -->|HTTP| CDN --> WAF --> LB --> GW
  Svc -->|HTTP/gRPC| GW
  GW --> DLoader --> REST
  GW --> GRPC
  GW --> DB
  GW --> SvcA
  GW --> SvcB
  GW --> Cache
```

Notes:
- Gateway composes subgraphs (federation) or delegates to stitched schemas.
- Dataloader batches per-request to prevent N+1 queries.
- Persisted queries enable CDN caching and smaller payloads.

## Sequence: HTTP POST Query (with Persisted Query Fallback)

```mermaid
sequenceDiagram
  participant Client
  participant Edge as CDN/Edge
  participant GQL as GraphQL Gateway
  participant Svc as Backend Service

  Note over Client,Edge: Attempt persisted GET with sha256 hash
  Client->>Edge: GET /graphql?extensions={"persistedQuery":{"sha256Hash":"abc..."}}
  alt Cache hit at Edge
    Edge-->>Client: 200 OK (response)
  else No cache hit
    Edge->>GQL: GET /graphql?... (hash only)
    alt Known persisted query
      GQL->>Svc: Resolver calls (HTTP/gRPC/DB)
      Svc-->>GQL: Data
      GQL-->>Edge: 200 OK (JSON)
      Edge-->>Client: 200 OK (JSON)
    else Unknown hash
      GQL-->>Client: 400 PersistedQueryNotFound
      Client->>GQL: POST /graphql {query, variables, extensions: {hash}}
      GQL->>Svc: Resolver calls
      Svc-->>GQL: Data
      GQL-->>Client: 200 OK (JSON)
    end
  end
```

## Sequence: Subscriptions over WebSocket (graphql-transport-ws)

```mermaid
sequenceDiagram
  participant Client
  participant GW as GraphQL WS Server

  Client->>GW: WS Connect (Sec-WebSocket-Protocol: graphql-transport-ws)
  GW-->>Client: 101 Switching Protocols
  Client->>GW: ConnectionInit {auth token}
  GW-->>Client: ConnectionAck
  Client->>GW: Subscribe {id:"1", query:"subscription {...}", vars}
  GW-->>Client: Next {id:"1", data:{...}}
  GW-->>Client: Next {id:"1", data:{...}}  (more events)
  Client->>GW: Complete {id:"1"} (optional)
  Client-->>GW: Ping / GW-->>Client: Pong (heartbeats)
```

Alternatives:
- Server-Sent Events (SSE) for simpler, uni-directional subscriptions.
- Legacy `subscriptions-transport-ws` is deprecated.

## Federation Sequence (Gateway → Subgraphs)

```mermaid
sequenceDiagram
  participant Client
  participant GW as Apollo Gateway
  participant U as Users Subgraph
  participant O as Orders Subgraph

  Client->>GW: POST /graphql { query GetOrderAndUser }
  GW->>O: entity fetch for Order(id)
  O-->>GW: Order{ id, userId, total }
  GW->>U: entity fetch for User(id = userId)
  U-->>GW: User{ id, name, tier }
  GW-->>Client: data { order{ id, total, user{ name, tier } } }
```

## Reliability and Governance
- Enforce query depth/complexity limits; cost analysis; timeouts and max results.
- Persisted queries and allowlists for public clients.
- Idempotent caching of GET persisted queries at CDN.
- Use retries with idempotent backend fetches; deduplicate via Dataloader.

## Security
- TLS 1.3; HSTS; CSRF protection for cookie-based auth (POST with SameSite).
- Field/type-level authorization; schema directives for RBAC/ABAC.
- Disable public introspection in production or protect via auth.
- Rate limiting and throttling per operation/client.

## Performance Tips
- Batch and cache per-request with Dataloader.
- Avoid over-fetching by using fragments and precise fields.
- Use APQ (Automatic Persisted Queries) with GET for cacheability.
- Defer/stream directives for incremental delivery where supported.

## Testing and Tools
- GraphiQL/Playground; Apollo Studio; graphql-inspector (schema diff).
- Codegen: GraphQL Code Generator; client SDKs.
- Tracing: Apollo traces, OpenTelemetry resolvers.

## References
- GraphQL Spec (graphql.org)
- Apollo Federation and Gateway
- graphql-ws (graphql-transport-ws)
- Automatic Persisted Queries (APQ)