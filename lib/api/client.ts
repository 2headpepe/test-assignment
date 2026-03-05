export class ApiError extends Error {
  constructor(public readonly status: number) {
    super();
  }
}

export class NetworkError extends Error {}

export async function apiFetch<T>(path: string, params?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(path, {
      ...params,
      headers: {
        ...params?.headers,
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token',
      },
    });
  } catch {
    throw new NetworkError();
  }

  if (!response.ok) {
    throw new ApiError(response.status);
  }

  return response.json();
}
