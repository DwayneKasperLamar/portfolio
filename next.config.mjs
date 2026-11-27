/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // A booking link is a secret: never pass its address to another site, never list it.
        source: '/book/:token*',
        headers: [
          { key: 'Referrer-Policy', value: 'no-referrer' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
    ];
  },
};

export default nextConfig;
