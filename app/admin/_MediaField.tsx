'use client';

/* eslint-disable @next/next/no-img-element -- admin preview of an arbitrary or private file */
import { useState } from 'react';
import { createUpload } from './media-actions';
import { sendFile } from '@/lib/browser-upload';
import { UPLOAD_TYPES, uploadProblem } from '@/lib/upload-rules';

const fieldClass =
  'w-full bg-surface-alt border border-line rounded px-3 py-2 text-primary placeholder:text-muted focus:outline-none';

interface MediaFieldProps {
  name: string;
  label: string;
  defaultValue?: string | null;
  imagesOnly?: boolean;
}

// A link box with an upload button. Uploading fills the box; pressing Save keeps it.
export default function MediaField({ name, label, defaultValue, imagesOnly }: MediaFieldProps) {
  const [value, setValue] = useState(defaultValue ?? '');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const accept = Object.keys(UPLOAD_TYPES)
    .filter((t) => !imagesOnly || t.startsWith('image/'))
    .join(',');
  const isVideo = /\.(mp4|webm|mov)$/i.test(value);
  const isImage = /\.(jpe?g|png|webp|gif|svg)(\?|#|$)/i.test(value);

  async function upload(file: File) {
    const problem = uploadProblem(file.type, file.size) ?? (imagesOnly && !file.type.startsWith('image/') ? 'This spot takes a photo.' : null);
    if (problem) return setStatus(problem);
    setBusy(true);
    setStatus('Preparing…');
    try {
      const ticket = await createUpload(file.type, file.size);
      if ('error' in ticket) return setStatus(ticket.error);
      await sendFile(ticket.uploadUrl, file, (percent) => setStatus(`Uploading ${percent}%`));
      setValue(ticket.path);
      setStatus('Uploaded. Now press Save.');
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="text-xs uppercase tracking-wide text-muted mb-1 block">{label}</span>
      <input name={name} aria-label={label} value={value} onChange={(e) => setValue(e.target.value)} placeholder="Paste a link, or upload" className={fieldClass} />
      <div className="flex flex-wrap items-center gap-3 mt-2">
        <label className={`text-xs border border-line rounded px-3 py-1.5 text-primary ${busy ? 'opacity-50' : 'cursor-pointer hover:border-muted'}`}>
          {busy ? 'Uploading…' : imagesOnly ? 'Upload photo' : 'Upload photo or video'}
          <input
            type="file"
            accept={accept}
            disabled={busy}
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (file) upload(file);
            }}
          />
        </label>
        {status && (
          <span role="status" className="text-xs text-muted">
            {status}
          </span>
        )}
      </div>
      {value && isImage && <img src={value} alt="" className="mt-2 max-h-28 rounded border border-line" />}
      {value && isVideo && <video src={value} controls preload="metadata" className="mt-2 max-h-40 rounded border border-line" />}
    </div>
  );
}
