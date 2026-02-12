import { CONFIG } from "./config";

async function fetchWithTimeout(url, options = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), CONFIG.TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...options, signal: ctrl.signal });
    return res;
  } finally {
    clearTimeout(t);
  }
}

export async function analyzeImage({ uri, patientId, modality }) {


  const blobRes = await fetch(uri);
  const blob = await blobRes.blob();

  const form = new FormData();
  form.append("patient_id", patientId);
  form.append("modality", modality);

  // Expo: FormData attend { uri, name, type }
//   form.append("image", {
//     uri,
//     name: "capture.jpg",
//     type: "image/jpg",
//   });
  form.append("image",blob,"capture.jpg");

  const res = await fetchWithTimeout(`${CONFIG.API_BASE}/v1/analyze`, {
    method: "POST",
    // headers: {
    //     'Accept' : 'application/json',
    //   // IMPORTANT: ne mets pas Content-Type toi-même avec FormData sur RN
    // },
    body: form,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `HTTP ${res.status}`);
  }
  return data;
}

export async function getHistory(patientId) {
  const res = await fetchWithTimeout(`${CONFIG.API_BASE}/v1/analyses/${encodeURIComponent(patientId)}`, {
    method: "GET",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `HTTP ${res.status}`);
  }
  return data; // { patient_id, items }
}