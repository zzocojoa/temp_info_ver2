// utils/fetchUtils.js

export function createFetchRequest(method, body = null) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  
  const requestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
    cache: 'no-store', // 캐시 비활성화
  };

  return requestInit;
}
