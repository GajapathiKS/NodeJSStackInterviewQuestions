const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isGithubActions && repoName ? `/${repoName}` : '',
  assetPrefix: isGithubActions && repoName ? `/${repoName}/` : '',
};

export default nextConfig;
