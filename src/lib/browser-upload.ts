// Sends a file from the browser to a one-time storage address, reporting progress
// (fetch cannot report upload progress).
export function sendFile(url: string, file: File, onProgress: (percent: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('PUT', url);
    request.setRequestHeader('Content-Type', file.type);
    request.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    request.onload = () => (request.status < 300 ? resolve() : reject(new Error(`Upload refused (${request.status}).`)));
    request.onerror = () => reject(new Error('The connection dropped. Try again.'));
    request.send(file);
  });
}
