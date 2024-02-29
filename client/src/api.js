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
    return { averagedData, boxplotStats, temperatureValues }; // 업로드 결과 반환
  } catch (error) {
    console.error('Error uploading file:', error);
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
  // console.log("dataId :", dataId)
  const response = await fetch(`${API_BASE_URL}/data/${dataId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
}
