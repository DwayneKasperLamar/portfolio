import { unstable_cache } from 'next/cache';
import SafeImage from '@/components/SafeImage';
import WidgetCard from '@/components/widgets/WidgetCard';

interface GitHubData {
  login: string;
  name: string | null;
  avatar: string;
  repos: number;
  followers: number;
  commits: { sha: string; repo: string; message: string; url: string; date: string }[];
}

// GitHub allows only 60 anonymous calls an hour per address (a GITHUB_TOKEN raises that to 5,000),
// so the result is kept for 15 minutes and shared by every visitor. A thrown error is NOT cached.
async function github<T>(path: string): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'portfolio-site',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
  return res.json() as Promise<T>;
}

const fetchGitHub = unstable_cache(
  async (username: string): Promise<GitHubData> => {
    const user = encodeURIComponent(username);
    const [profile, repos] = await Promise.all([
      github<{ login: string; name: string | null; avatar_url: string; public_repos: number; followers: number }>(`/users/${user}`),
      github<{ name: string; fork: boolean; private: boolean }[]>(`/users/${user}/repos?sort=pushed&per_page=8&type=owner`),
    ]);

    // Only public repositories, even if the token could see more.
    const active = repos.filter((r) => !r.fork && !r.private).slice(0, 3);
    const perRepo = await Promise.all(
      active.map(async (repo) => {
        const list = await github<{ sha: string; html_url: string; commit: { message: string; author: { date: string } } }[]>(
          `/repos/${user}/${encodeURIComponent(repo.name)}/commits?per_page=5`,
        ).catch(() => []); // an empty repository answers with an error: just skip it
        return list.map((c) => ({
          sha: c.sha,
          repo: repo.name,
          message: c.commit.message.split('\n')[0],
          url: c.html_url,
          date: c.commit.author.date,
        }));
      }),
    );

    return {
      login: profile.login,
      name: profile.name?.trim() || null,
      avatar: profile.avatar_url,
      repos: profile.public_repos,
      followers: profile.followers,
      commits: perRepo
        .flat()
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 5),
    };
  },
  ['github-widget-commits'],
  { revalidate: 900 },
);

function ago(iso: string): string {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60_000));
  if (minutes < 60) return `${Math.max(1, minutes)}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  const days = Math.floor(minutes / 1440);
  if (days === 1) return 'yesterday';
  if (days < 31) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export function githubUsername(profileUrl: string): string | null {
  try {
    const parts = new URL(profileUrl).pathname.split('/').filter(Boolean);
    return parts[0] && /^[A-Za-z0-9-]{1,39}$/.test(parts[0]) ? parts[0] : null;
  } catch {
    return null;
  }
}

// Shows public repositories only. Private work never appears here. If GitHub is slow or
// down, the widget quietly disappears instead of breaking the page.
const GitHubWidget = async ({ profileUrl }: { profileUrl: string }) => {
  const username = githubUsername(profileUrl);
  if (!username) return null;

  let data: GitHubData;
  try {
    data = await fetchGitHub(username);
  } catch {
    return null;
  }

  return (
    <WidgetCard label="GitHub" href={`https://github.com/${data.login}`} wide>
      <div className="flex items-center gap-3 mb-4">
        <SafeImage src={data.avatar} alt={data.login} width={40} height={40} className="rounded-full border border-line" />
        <div className="min-w-0">
          <p className="text-[0.95rem] text-primary truncate">{data.name ?? data.login}</p>
          <p className="font-mono text-xs text-muted">
            {data.repos} public repos &middot; {data.followers} followers
          </p>
        </div>
      </div>
      <p className="font-mono text-xs text-muted mb-2">Latest pushes</p>
      <ol className="border-l border-line ml-1 space-y-3">
        {data.commits.map((c) => (
          <li key={c.sha} className="relative pl-4">
            <span className="status-dot absolute -left-[3.5px] top-2" />
            <a href={c.url} target="_blank" rel="noreferrer" className="block text-sm text-primary break-words hover:underline">
              {c.message}
            </a>
            <span className="font-mono text-xs text-muted">
              {c.repo} &middot; {c.sha.slice(0, 7)} &middot; {ago(c.date)}
            </span>
          </li>
        ))}
      </ol>
    </WidgetCard>
  );
};

export default GitHubWidget;
