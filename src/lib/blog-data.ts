export interface BlogPost {
  id: number
  title: string
  excerpt: string
  image: string
  category: string
  tags: string[]
  date: string
  readTime: number
  featured?: boolean
  slug: string
  content?: string
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Building Scalable Microservices with Node.js",
    excerpt:
      "A comprehensive guide to designing and implementing microservices architecture that can handle millions of requests.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    category: "architecture",
    tags: ["Node.js", "Microservices", "AWS"],
    date: "Dec 15, 2024",
    readTime: 12,
    featured: true,
    slug: "building-scalable-microservices-with-nodejs",
    content: `
      <h2 id="introduction">Introduction</h2>
      <p>
          Building scalable applications is one of the most challenging aspects of modern software development. As your user base grows from hundreds to millions, the architecture decisions you make early on become increasingly important. In this comprehensive guide, we'll explore how to design and implement a microservices architecture using Node.js that can handle massive scale while remaining maintainable.
      </p>
      <p>
          Over the past decade, I've helped build systems that process <strong>over 50 million requests per day</strong>. The patterns and practices I'm sharing here are battle-tested in production environments and have saved countless hours of debugging and refactoring.
      </p>
      <div class="callout callout-info flex gap-4">
          <svg class="w-6 h-6 text-home-accent flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
          </svg>
          <div>
              <p class="font-heading font-semibold text-white mb-1">Prerequisites</p>
              <p class="text-sm text-home-muted mb-0">This guide assumes familiarity with Node.js, TypeScript, and basic distributed systems concepts. If you're new to these topics, I recommend checking out my <a href="#">Node.js fundamentals course</a> first.</p>
          </div>
      </div>
      <h2 id="why-microservices">Why Microservices?</h2>
      <p>
          Before diving into implementation details, let's understand when microservices make sense. Not every application needs this architecture – in fact, starting with a monolith is often the right choice for new projects.
      </p>
      <p>
          Consider microservices when you have:
      </p>
      <ul>
          <li><strong>Independent scaling needs</strong> – Different parts of your system have vastly different resource requirements</li>
          <li><strong>Multiple teams</strong> – You need to enable parallel development without stepping on each other's toes</li>
          <li><strong>Technology diversity</strong> – Some problems are better solved with different languages or frameworks</li>
          <li><strong>Fault isolation</strong> – You need to prevent cascading failures across your system</li>
      </ul>
      <blockquote>
          "A distributed system is one in which the failure of a computer you didn't even know existed can render your own computer unusable." — Leslie Lamport
      </blockquote>
      <h2 id="architecture-overview">Architecture Overview</h2>
      <p>
          Let's look at a high-level architecture for a typical e-commerce platform built with microservices:
      </p>
      <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80" alt="Microservices Architecture Diagram" class="rounded-xl border border-white/10">
      <p>
          Our architecture consists of several key components:
      </p>
      <ol>
          <li><strong>API Gateway</strong> – Entry point for all client requests, handles routing and authentication</li>
          <li><strong>Service Registry</strong> – Keeps track of all service instances and their locations</li>
          <li><strong>Individual Services</strong> – Each handles a specific business domain</li>
          <li><strong>Message Broker</strong> – Enables asynchronous communication between services</li>
          <li><strong>Distributed Cache</strong> – Reduces database load and improves response times</li>
      </ol>
      <h2 id="implementation">Implementation</h2>
      <p>
          Let's start building our microservices framework. We'll create a base service class that all our services will extend:
      </p>
      <pre><code class="language-typescript">// src/core/BaseService.ts
import express, { Application, Request, Response } from 'express';
import { ServiceRegistry } from './ServiceRegistry';
import { HealthCheck } from './HealthCheck';

export abstract class BaseService {
protected app: Application;
protected serviceName: string;
protected port: number;

constructor(name: string, port: number) {
  this.app = express();
  this.serviceName = name;
  this.port = port;
  this.setupMiddleware();
  this.setupHealthCheck();
}

private setupMiddleware(): void {
  this.app.use(express.json());
  this.app.use(this.requestLogger.bind(this));
  this.app.use(this.errorHandler.bind(this));
}

private setupHealthCheck(): void {
  this.app.get('/health', (req: Request, res: Response) => {
    const health = HealthCheck.getStatus(this.serviceName);
    res.status(health.healthy ? 200 : 503).json(health);
  });
}

async start(): Promise<void> {
  await ServiceRegistry.register(this.serviceName, this.port);
  this.app.listen(this.port, () => {
    console.log(\`\${this.serviceName} running on port \${this.port}\`);
  });
}

abstract setupRoutes(): void;
}</code></pre>
      <div class="callout callout-tip flex gap-4">
          <svg class="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <div>
              <p class="font-heading font-semibold text-white mb-1">Pro Tip</p>
              <p class="text-sm text-home-muted mb-0">Always implement health checks in your services. This enables load balancers and orchestration tools to route traffic away from unhealthy instances automatically.</p>
          </div>
      </div>
      <h2 id="communication">Service Communication</h2>
      <p>
          Services need to communicate with each other. We have two primary patterns:
      </p>
      <h3>Synchronous (HTTP/gRPC)</h3>
      <p>
          Use this when you need an immediate response. Implement circuit breakers to handle failures gracefully:
      </p>
      <pre><code class="language-typescript">// src/utils/CircuitBreaker.ts
export class CircuitBreaker {
private failures: number = 0;
private lastFailure: Date | null = null;
private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

constructor(
  private threshold: number = 5,
  private timeout: number = 30000
) {}

async execute<T>(fn: () => Promise<T>): Promise<T> {
  if (this.state === 'OPEN') {
    if (Date.now() - this.lastFailure!.getTime() > this.timeout) {
      this.state = 'HALF_OPEN';
    } else {
      throw new Error('Circuit breaker is OPEN');
    }
  }

  try {
    const result = await fn();
    this.onSuccess();
    return result;
  } catch (error) {
    this.onFailure();
    throw error;
  }
}

private onSuccess(): void {
  this.failures = 0;
  this.state = 'CLOSED';
}

private onFailure(): void {
  this.failures++;
  this.lastFailure = new Date();
  if (this.failures >= this.threshold) {
    this.state = 'OPEN';
  }
}
}</code></pre>
      <h3>Asynchronous (Message Queue)</h3>
      <p>
          For operations that don't need immediate responses, use a message broker like RabbitMQ or Apache Kafka:
      </p>
      <pre><code class="language-typescript">// src/messaging/EventBus.ts
import amqp from 'amqplib';

export class EventBus {
private connection: amqp.Connection;
private channel: amqp.Channel;

async connect(url: string): Promise<void> {
  this.connection = await amqp.connect(url);
  this.channel = await this.connection.createChannel();
}

async publish(exchange: string, event: string, data: any): Promise<void> {
  await this.channel.assertExchange(exchange, 'topic', { durable: true });
  this.channel.publish(
    exchange,
    event,
    Buffer.from(JSON.stringify(data)),
    { persistent: true }
  );
}

async subscribe(
  exchange: string,
  pattern: string,
  handler: (data: any) => Promise<void>
): Promise<void> {
  await this.channel.assertExchange(exchange, 'topic', { durable: true });
  const { queue } = await this.channel.assertQueue('', { exclusive: true });
  await this.channel.bindQueue(queue, exchange, pattern);
  
  this.channel.consume(queue, async (msg) => {
    if (msg) {
      const data = JSON.parse(msg.content.toString());
      await handler(data);
      this.channel.ack(msg);
    }
  });
}
}</code></pre>
      <h2 id="deployment">Deployment Strategy</h2>
      <p>
          For production deployments, I recommend using Kubernetes with the following configuration:
      </p>
      <pre><code class="language-bash"># Deploy with zero downtime
kubectl apply -f deployment.yaml
kubectl rollout status deployment/user-service

# Scale based on load
kubectl autoscale deployment user-service \
--min=3 --max=10 \
--cpu-percent=70</code></pre>
      <div class="callout callout-warning flex gap-4">
          <svg class="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <div>
              <p class="font-heading font-semibold text-white mb-1">Important</p>
              <p class="text-sm text-home-muted mb-0">Always test your deployment strategy in a staging environment first. Blue-green deployments can help minimize risk when pushing changes to production.</p>
          </div>
      </div>
      <h2 id="monitoring">Monitoring & Logging</h2>
      <p>
          In a distributed system, observability is crucial. Implement the three pillars:
      </p>
      <ul>
          <li><strong>Logs</strong> – Structured logging with correlation IDs to trace requests across services</li>
          <li><strong>Metrics</strong> – Prometheus + Grafana for real-time dashboards</li>
          <li><strong>Traces</strong> – Jaeger or Zipkin for distributed tracing</li>
      </ul>
      <h2 id="conclusion">Conclusion</h2>
      <p>
          Building scalable microservices is a journey, not a destination. Start simple, measure everything, and iterate based on real-world feedback. The patterns we've discussed here provide a solid foundation, but remember that every system is unique.
      </p>
      <p>
          Key takeaways:
      </p>
      <ul>
          <li>Start with a monolith if you're unsure – you can always extract services later</li>
          <li>Design for failure from day one with circuit breakers and retries</li>
          <li>Invest heavily in observability – you can't fix what you can't see</li>
          <li>Automate everything, especially deployments and scaling</li>
      </ul>
      <hr>
      <p>
          Have questions or want to share your own experiences? Drop a comment below or reach out on <a href="#">Twitter</a>. Happy building! 🚀
      </p>
    `,
  },
  {
    id: 2,
    title: "Advanced React Patterns You Should Know",
    excerpt:
      "Explore compound components, render props, and custom hooks to write cleaner, more maintainable React code.",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    category: "react",
    tags: ["React", "JavaScript", "Patterns"],
    date: "Dec 10, 2024",
    readTime: 8,
    slug: "advanced-react-patterns-you-should-know",
  },
  {
    id: 3,
    title: "Zero-Downtime Deployments with Docker & K8s",
    excerpt:
      "Learn how to implement rolling updates and blue-green deployments for seamless production releases.",
    image:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80",
    category: "devops",
    tags: ["Docker", "Kubernetes", "CI/CD"],
    date: "Dec 5, 2024",
    readTime: 15,
    slug: "zero-downtime-deployments-with-docker-and-k8s",
  },
  {
    id: 4,
    title: "TypeScript 5.0: What's New and Why It Matters",
    excerpt:
      "Dive into the latest features including decorators, const type parameters, and improved inference.",
    image:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
    category: "typescript",
    tags: ["TypeScript", "JavaScript"],
    date: "Nov 28, 2024",
    readTime: 6,
    slug: "typescript-5-0-whats-new-and-why-it-matters",
  },
  {
    id: 5,
    title: "Building a Real-Time Dashboard with WebSockets",
    excerpt:
      "Step-by-step tutorial on creating live updating dashboards using Socket.io and React.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    category: "tutorials",
    tags: ["React", "WebSockets", "Real-time"],
    date: "Nov 20, 2024",
    readTime: 18,
    slug: "building-a-real-time-dashboard-with-websockets",
  },
  {
    id: 6,
    title: "Database Optimization Strategies for High Traffic",
    excerpt:
      "Practical techniques for indexing, query optimization, and caching to handle scale.",
    image:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80",
    category: "architecture",
    tags: ["PostgreSQL", "Performance", "Database"],
    date: "Nov 15, 2024",
    readTime: 10,
    slug: "database-optimization-strategies-for-high-traffic",
  },
  {
    id: 7,
    title: "React Server Components Deep Dive",
    excerpt:
      "Understanding the paradigm shift and how to leverage RSC for better performance.",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    category: "react",
    tags: ["React", "Next.js", "RSC"],
    date: "Nov 10, 2024",
    readTime: 14,
    slug: "react-server-components-deep-dive",
  },
  {
    id: 8,
    title: "Terraform Best Practices for AWS Infrastructure",
    excerpt:
      "Organize your IaC with modules, workspaces, and state management strategies.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    category: "devops",
    tags: ["Terraform", "AWS", "IaC"],
    date: "Nov 5, 2024",
    readTime: 11,
    slug: "terraform-best-practices-for-aws-infrastructure",
  },
  {
    id: 9,
    title: "Type-Safe API Contracts with tRPC",
    excerpt:
      "End-to-end type safety without code generation for full-stack TypeScript apps.",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    category: "typescript",
    tags: ["TypeScript", "tRPC", "API"],
    date: "Oct 28, 2024",
    readTime: 9,
    slug: "type-safe-api-contracts-with-trpc",
  },
  {
    id: 10,
    title: "Building a CLI Tool with Node.js",
    excerpt:
      "Create beautiful command-line interfaces with proper argument parsing and interactive prompts.",
    image:
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80",
    category: "tutorials",
    tags: ["Node.js", "CLI", "Tools"],
    date: "Oct 20, 2024",
    readTime: 13,
    slug: "building-a-cli-tool-with-nodejs",
  },
  {
    id: 11,
    title: "Event-Driven Architecture Patterns",
    excerpt:
      "From pub/sub to event sourcing, learn when and how to use each pattern effectively.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    category: "architecture",
    tags: ["Architecture", "Events", "Kafka"],
    date: "Oct 15, 2024",
    readTime: 16,
    slug: "event-driven-architecture-patterns",
  },
  {
    id: 12,
    title: "State Management in 2024: Zustand vs Jotai",
    excerpt:
      "A practical comparison of modern React state management libraries for different use cases.",
    image:
      "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&q=80",
    category: "react",
    tags: ["React", "State Management"],
    date: "Oct 10, 2024",
    readTime: 7,
    slug: "state-management-in-2024-zustand-vs-jotai",
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug)
}
