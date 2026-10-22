import type { Device, Environment, Reading, Summary } from '@ecogrid/contracts';
export class ApiError extends Error {
  constructor(public readonly status: number, message: string) { super(message); this.name = 'ApiError'; }
}
export async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try { response = await fetch(path, { signal }); }
  catch (error) {
    if (signal?.aborted) throw error;
    throw new ApiError(0, 'Não foi possível conectar à API local. Inicie o servidor com npm run dev.');
  }
  if (!response.ok) {
    const messages: Record<number, string> = {
      400: 'Os filtros informados são inválidos.',
      404: 'O ambiente solicitado não existe.',
      429: 'Muitas consultas. Aguarde alguns segundos.',
      501: 'Este módulo ainda está sendo desenvolvido pelo grupo.',
    };
    throw new ApiError(response.status, messages[response.status] ?? 'Não foi possível consultar a API.');
  }
  return response.json() as Promise<T>;
}
export const api = {
  environments: (signal?: AbortSignal) => getJson<Environment[]>('/api/v1/environments', signal),
  devices: (environmentId?: string, signal?: AbortSignal) => getJson<Device[]>('/api/v1/devices' + (environmentId ? '?environmentId=' + encodeURIComponent(environmentId) : ''), signal),
  readings: (query: URLSearchParams, signal?: AbortSignal) => getJson<Reading[]>('/api/v1/readings?' + query.toString(), signal),
  summary: (query: URLSearchParams, signal?: AbortSignal) => getJson<Summary>('/api/v1/summary?' + query.toString(), signal),
};
