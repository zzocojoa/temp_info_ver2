// client/src/api.js

import { createFetchRequest } from './utils/fetchUtils';


export const API_BASE_URL = 'http://localhost:5000/api';

// 파일 업로드 API
export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/upload`, true);

    xhr.upload.onprogress = onProgress;

    xhr.onload = () => {
      try {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          // console.log("uploadFile response: ", response); // 응답 데이터 확인

          // 응답 데이터 구조 검증
          if (
            response &&
            response.success &&
            Array.isArray(response.data) &&
            response.data.length > 0 &&
            response.boxplotStats &&
            'min' in response.boxplotStats &&
            'q1' in response.boxplotStats &&
            'median' in response.boxplotStats &&
            'q3' in response.boxplotStats &&
            'max' in response.boxplotStats
          ) {
            resolve(response); // 성공 시 데이터 반환
          } else {
            reject(new Error('Unexpected data format: Missing required fields in the response.'));
          }
        } else {
          reject(new Error(`Server responded with status ${xhr.status}: ${xhr.statusText}`));
        }
      } catch (error) {
        console.error('Error parsing server response:', error);
        reject(new Error('Error parsing server response.'));
      }
    };

    xhr.onerror = () => {
      console.error('Network Error occurred during file upload');
      reject(new Error('Network Error'));
    };

    xhr.send(formData);
  });
};

// PLC 파일 업로드 API
export const uploadPLCFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/upload-plc`, true);

    xhr.upload.onprogress = onProgress;

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          console.log("uploadPLCFile response: ", response); // 응답 데이터 확인

          // 응답 데이터 구조 검증
          if (response && response.success && response.data && Array.isArray(response.data) && response.data.length > 0) {
            const firstEntry = response.data[0];
            // 필수 필드가 모두 포함되었는지 확인
            if ('date' in firstEntry && 'time' in firstEntry && 'pressure' in firstEntry && 'ctf' in firstEntry && 'ctb' in firstEntry && 'speed' in firstEntry) {
              resolve(response); // 성공 시 데이터 반환
            } else {
              reject(new Error('Unexpected data format: Missing required fields in the response.'));
            }
          } else {
            reject(new Error('Invalid or empty data format from server.'));
          }
        } catch (error) {
          console.error('Error parsing server response:', error);
          reject(new Error('Error parsing server response.'));
        }
      } else {
        reject(new Error(`Server responded with status ${xhr.status}: ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network Error occurred during file upload'));
    xhr.send(formData);
  });
};

// 온도 데이터와 PLC 데이터를 함께 업로드하는 API
export const uploadCombinedFiles = async (tempFile, plcFile, onProgress) => {
  const formData = new FormData();
  formData.append('files', tempFile); // 첫 번째 파일
  formData.append('files', plcFile); // 두 번째 파일

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/upload-combined`, true);

    xhr.upload.onprogress = onProgress;

    xhr.onload = () => {
      try {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          console.log("response: ", response); // 응답 데이터 확인

          // 응답 데이터 구조 검증
          if (
            response &&
            response.success &&
            Array.isArray(response.data) &&
            response.data.length > 0
          ) {
            resolve(response); // 성공 시 데이터 반환
          } else {
            reject(new Error('Unexpected data format: Missing required fields in the response.'));
          }
        } else {
          reject(new Error(`Server responded with status ${xhr.status}: ${xhr.statusText}`));
        }
      } catch (error) {
        console.error('Error parsing server response:', error);
        reject(new Error('Error parsing server response.'));
      }
    };

    xhr.onerror = () => {
      console.error('Network Error occurred during file upload');
      reject(new Error('Network Error'));
    };

    xhr.send(formData);
  });
};


// 정제 파일 업로드 API (CSV 파일)
export async function uploadCsvFile(files) {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  try {
    // 두 개의 fetch 요청을 병렬로 실행
    const [uploadResponse, uploadPlcResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/upload-csv`, {
        method: 'POST',
        body: formData,
      }),
      fetch(`${API_BASE_URL}/upload-plc-csv`, {
        method: 'POST',
        body: formData,
      })
    ]);

    if (!uploadResponse.ok || !uploadPlcResponse.ok) {
      console.error('Upload response error:', uploadResponse.statusText);
      console.error('Upload PLC response error:', uploadPlcResponse.statusText);
      throw new Error('Network response was not ok');
    }

    const uploadData = await uploadResponse.json();
    const uploadPlcData = await uploadPlcResponse.json();

    // 두 응답 데이터를 합쳐서 반환
    return { uploadData, uploadPlcData };
  } catch (error) {
    console.error('Error uploading CSV file:', error);
    throw error; // 컴포넌트에서 처리할 수 있게 에러를 다시 던짐
  }
}


// 이상치 필터링 및 중앙값 계산을 위한 API 함수
export async function Threshold(files) {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/threshold-upload`, {
      method: 'POST',
      body: formData,
      cache: 'no-cache',
    });
    if (!response.ok) {
      throw new Error('Server responded with an error');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in Threshold:', error);
    throw error;
  }
}

// 이상치 필터링 다운로드를 위한 API 함수
export async function downloadFilteredData(uploadId) {
  if (!uploadId) {
    throw new Error('다운로드를 위한 업로드 ID가 제공되지 않았습니다.');
  }

  // 파일 다운로드를 위한 엔드포인트 URL 생성
  const url = `${API_BASE_URL}/download-filtered-data?uploadId=${encodeURIComponent(uploadId)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`서버에서 오류 응답: ${response.status}`);
    }

    // 서버로부터 받은 ZIP 파일을 Blob으로 변환
    const blob = await response.blob();
    // Blob 객체를 이용해 다운로드 URL 생성
    const downloadUrl = window.URL.createObjectURL(blob);
    // 생성된 URL로 다운로드 링크 생성
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'filtered_data.zip'; // ZIP 파일명 설정
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Error downloading filtered data:', error);
    throw error;
  }
}

// filteredData를 서버로 전송하는 함수(bolplot dynamic data)
export async function sendFilteredData(filteredData) {
  const requestInit = createFetchRequest('POST', { filteredData });

  console.debug('Request initialization:', requestInit); // 요청 초기화 로그

  try {
    const response = await fetch(`${API_BASE_URL}/process-filtered-data`, requestInit);
    console.debug('Response received:', response); // 응답 수신 시 로그
    if (!response.ok) {
      console.error('Failed response:', response); // 실패한 응답 로그
      throw new Error('Failed to send filtered data');
    }

    const jsonResponse = await response.json();
    console.debug('JSON response:', jsonResponse); // JSON 응답 로그
    return jsonResponse; // 서버 응답 반환
  } catch (error) {
    console.error('Error sending filtered data:', error); // 에러 로그
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
