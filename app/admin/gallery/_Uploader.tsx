'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUpload } from '../media-actions';
import { addGalleryUpload } from './actions';
import { sendFile } from '@/lib/browser-upload';
import { UPLOAD_TYPES, uploadProblem } from '@/lib/upload-rules';

// Pick several photos or videos at once; each is uploaded and added to the gallery.
export default function Uploader() {
  const router = useRouter();
  const [visibility, setVisibility] = useState('private');
  const [status, setStatus] = useState('');
  const [problems, setProblems] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  async function upload(files: File[]) {
    setBusy(true);
    setProblems([]);
    const failed: string[] = [];
    let added = 0;
    for (const [i, file] of files.entries()) {
      try {
        const problem = uploadProblem(file.type, file.size);
        if (problem) throw new Error(problem);
        setStatus(`File ${i + 1} of ${files.length}: preparing`);
        const ticket = await createUpload(file.type, file.size);
        if ('error' in ticket) throw new Error(ticket.error);
        await sendFile(ticket.uploadUrl, file, (p) => setStatus(`File ${i + 1} of ${files.length}: ${p}%`));
        await addGalleryUpload(ticket.path, visibility);
        added++;
      } catch (e) {
        failed.push(`${file.name}: ${e instanceof Error ? e.message : 'upload failed'}`);
      }
    }
    setProblems(failed);
    setStatus(added ? `Added ${added} to the gallery.` : 'Nothing was added.');
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-dashed border-line bg-surface p-5">
      <label className="flex flex-wrap items-center gap-3 text-sm">
        <span className="label">New uploads are</span>
        <select value={visibility} onChange={(e) => setVisibility(e.target.value)} disabled={busy}
          className="rounded-lg border border-line bg-surface-alt px-3 py-2 text-primary">
          <option value="private">Private — only me</option>
          <option value="public">Public — shown on the site</option>
        </select>
      </label>
      <label className={`btn btn-fill self-start ${busy ? 'pointer-events-none opacity-60' : 'cursor-pointer'}`}>
        {busy ? 'Uploading…' : 'Upload photos or videos'}
        <input type="file" multiple accept={Object.keys(UPLOAD_TYPES).join(',')} disabled={busy} className="sr-only"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = '';
            if (files.length) upload(files);
          }} />
      </label>
      <p className="text-sm text-muted">JPG, PNG, WebP, GIF, MP4, WebM or MOV, up to 50 MB each.</p>
      {status && <p role="status" className="text-sm font-medium">{status}</p>}
      {problems.map((p) => (
        <p key={p} className="text-sm text-muted">{p}</p>
      ))}
    </div>
  );
}
