// client\src\api.js

const API_BASE_URL = 'http://localhost:5000/api';

// 파일 업로드 API
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    const { data: averagedData, boxplotStats, temperatureValues } = await response.json();
    console.log("boxplotStats: ", boxplotStats)
    return { averagedData, boxplotStats, temperatureValues }; // 업로드 결과 반환
  } catch (error) {
    console.error('Error uploading file:', error);
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
  try {
    const response = await fetch(`${API_BASE_URL}/process-filtered-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filteredData }),
    });
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
  try {
    const response = await fetch(`${API_BASE_URL}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to save data');
    }
    return await response.json(); // 저장 성공 결과 반환
  } catch (error) {
    console.error('Error saving data:', error);
    throw error; // 에러를 다시 던져 컴포넌트에서 처리할 수 있게 함
  }
}

export async function updateData(id, updatedData) {
  try {
    const response = await fetch(`${API_BASE_URL}/data/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
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
  try {
    const response = await fetch(`${API_BASE_URL}/data-list`);
    if (response.ok) {
      const dataList = await response.json();
      // console.log("dataList: ", dataList)

      return dataList;
    } else {
      console.error('Failed to fetch data list');
    }
  } catch (error) {
    console.error('Error fetching data list:', error);
  }
}

// 특정 데이터 조회
export async function fetchDataDetails(dataId) {
  try {
    const response = await fetch(`${API_BASE_URL}/data/${dataId}`);
    return response.json(); // 조회된 데이터의 상세 정보 반환
  } catch (error) {
    console.error('Error fetching data details:', error);
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
  try {
    const response = await fetch(`${API_BASE_URL}/calculate-median`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }), // 전송할 데이터
    });
    if (!response.ok) {
      throw new Error('Failed to calculate median');
    }
    const result = await response.json(); // 서버 응답으로부터 결과 받기
    return result.median; // 중앙값 반환
  } catch (error) {
    console.error('Error calculating median:', error);
    throw error; // 에러 발생 시, 이를 다시 던져서 호출한 곳에서 처리할 수 있도록 함
  }
}

// 필터링된 데이터 처리 및 중앙값 계산 API 함수
export const sendFilteredLinegraphData = async (data, startTime, endTime) => {
  try {
    const response = await fetch(`${API_BASE_URL}/filtered-linegraph-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data, startTime, endTime }),
    });
    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      throw new Error('Failed to process filtered data');
    }
  } catch (error) {
    console.error('Error sending filtered data:', error);
    throw error;
  }
};

// 클러스터링된 데이터를 가져오는 API 함수
export async function fetchClusteredData(dwNumber, k) {
  try {
    // 클라이언트에서 dwNumber와 k 값이 제공되었는지 확인, 해당 값이 있는 경우에만 body에 포함하여 요청을 전송
    const requestBody = dwNumber !== undefined && k !== undefined ? JSON.stringify({ dwNumber, k }) : null;

    const response = await fetch(`${API_BASE_URL}/clustered-data`, {
      // 데이터를 서버로 전송하기 위해 메소드를 POST로 변경
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // 사용자로부터 받은 dwNumber와 k 값을 요청 본문에 포함
      body: requestBody,
    });

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
    const response = await fetch(`${API_BASE_URL}/search-dw?q=${encodeURIComponent(query || '')}`); // 빈 쿼리에 대해 모든 DW 번호 검색을 허용
    if (!response.ok) {
      throw new Error('Failed to fetch DW number suggestions');
    }
    const dwNumbers = await response.json();
    return dwNumbers;
  } catch (error) {
    console.error('Error searching DW numbers:', error);
    throw error;
  }
}