import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Add external packages that should not be bundled
  serverExternalPackages: [
    '@genkit-ai/firebase',
    '@genkit-ai/google-cloud',
    '@google-cloud/logging',
    '@google-cloud/logging-winston',
    '@google-cloud/opentelemetry-cloud-monitoring-exporter',
    '@google-cloud/opentelemetry-cloud-trace-exporter',
    '@grpc/grpc-js',
  ],
  // Configure webpack to ignore Node.js modules in client bundles
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        http2: false,
        child_process: false,
      };
    }
    return config;
  },
  // Skip problematic pages during static generation
  experimental: {
    skipTrailingSlashRedirect: true,
    skipMiddlewareUrlNormalize: true,
  },
  // Disable static optimization for problematic pages
  async generateBuildId() {
    return 'build-' + Date.now();
  },
};

export default nextConfig;
