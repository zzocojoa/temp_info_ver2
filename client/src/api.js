// client/src/api.js

const API_BASE_URL = 'http://localhost:5000/api';

function createFetchRequest(method, body = null) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Cache-Control', 'no-cache'); // 캐시를 사용하지 않도록 설정합니다.

  const requestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
    cache: 'no-cache', // 브라우저가 캐시를 사용하지 않도록 설정합니다.
  };

  return requestInit;
}

// 파일 업로드 API
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
      // 'Content-Type': 'multipart/form-data'는 자동으로 설정되므로 명시하지 않아도 됩니다.
      cache: 'no-cache', // 브라우저가 캐시를 사용하지 않도록 설정합니다.
    });
    if (!response.ok) {
      throw new Error('Server responded with an error');
    }
    const { data: averagedData, boxplotStats, temperatureValues } = await response.json();
    console.log("boxplotStats: ", boxplotStats);
    return { averagedData, boxplotStats, temperatureValues }; // 업로드 결과 반환
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error; // 에러를 throw하여 호출한 곳에서 처리할 수 있도록 합니다.
  }
}

// 정제 파일 업로드 API (CSV 파일)
export async function uploadCsvFile(files) {
  const formData = new FormData();
  // formData.append('file', file);
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/upload-csv`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data; // 성공적으로 업로드된 경우 서버 응답 반환
  } catch (error) {
    console.error('Error uploading CSV file:', error);
    throw error; // 컴포넌트에서 처리할 수 있게 에러를 다시 던짐
  }
}

// filteredData를 서버로 전송하는 함수(bolplot dynamic data)
export async function sendFilteredData(filteredData) {
  const requestInit = createFetchRequest('POST', { filteredData });

  try {
    const response = await fetch(`${API_BASE_URL}/process-filtered-data`, requestInit);
    if (!response.ok) {
      throw new Error('Failed to send filtered data');
    }
    return await response.json(); // 서버 응답 반환
  } catch (error) {
    console.error('Error sending filtered data:', error);
    throw error; // 컴포넌트에서 처리할 수 있게 에러를 다시 던짐
  }
}

// 데이터 저장 API
export async function saveData(data) {
  const requestInit = createFetchRequest('POST', data);
  try {
    const response = await fetch(`${API_BASE_URL}/save`, requestInit);
    if (!response.ok) {
      throw new Error('Failed to save data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
}

export async function updateData(id, updatedData) {
  const requestInit = createFetchRequest('PATCH', updatedData);
  try {
    const response = await fetch(`${API_BASE_URL}/data/${id}`, requestInit);
    if (!response.ok) {
      throw new Error('Data update failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
}

// 데이터 리스트 조회
export async function fetchDataList() {
  const requestInit = createFetchRequest('GET');
  try {
    const response = await fetch(`${API_BASE_URL}/data-list`, requestInit);
    if (!response.ok) {
      throw new Error('Failed to fetch data list');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data list:', error);
    throw error;
  }
}

// 특정 데이터 조회
export async function fetchDataDetails(dataId) {
  const requestInit = createFetchRequest('GET');
  try {
    const response = await fetch(`${API_BASE_URL}/data/${dataId}`, requestInit);
    if (!response.ok) {
      throw new Error('Failed to fetch data details');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data details:', error);
    throw error;
  }
}

// 데이터 삭제
export async function deleteData(dataId) {
  const response = await fetch(`${API_BASE_URL}/data/${dataId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
}

// 중앙값 계산 API 함수
export async function calculateMedian(data) {
  const requestInit = createFetchRequest('POST', { data });
  try {
    const response = await fetch(`${API_BASE_URL}/calculate-median`, requestInit);
    if (!response.ok) {
      throw new Error('Failed to calculate median');
    }
    return await response.json();
  } catch (error) {
    console.error('Error calculating median:', error);
    throw error;
  }
}

// 필터링된 데이터 처리 및 중앙값 계산 API 함수
export async function sendFilteredLinegraphData(data, startTime, endTime) {
  const requestInit = createFetchRequest('POST', { data, startTime, endTime });
  try {
    const response = await fetch(`${API_BASE_URL}/filtered-linegraph-data`, requestInit);
    if (!response.ok) {
      throw new Error('Failed to process filtered data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error sending filtered data:', error);
    throw error;
  }
}

// 클러스터링된 데이터를 가져오는 API 함수
export async function fetchClusteredData(dwNumber, k) {
  const requestInit = createFetchRequest('POST', { dwNumber, k });
  try {
    const response = await fetch(`${API_BASE_URL}/clustered-data`, requestInit);
    if (!response.ok) {
      throw new Error('Failed to fetch clustered data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching clustered data:', error);
    throw error;
  }
}

// DW 번호 검색 API 함수
export async function searchDwNumber(query) {
  try {
    const response = await fetch(`${API_BASE_URL}/search-dw?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch DW number suggestions');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching DW numbers:', error);
    throw error;
  }
}

// 다이별 온도 프로필 데이터 제공
export async function fetchDieTemperatureProfile() {
  try {
    const response = await fetch(`${API_BASE_URL}/die-temperature-profile`);
    if (!response.ok) {
      throw new Error('Failed to fetch die temperature profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching die temperature profile:', error);
    throw error;
  }
}
