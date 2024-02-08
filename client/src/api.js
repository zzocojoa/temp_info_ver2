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
    const { data: averagedData, boxplotStats } = await response.json();
    return { averagedData, boxplotStats }; // 업로드 결과 반환
  } catch (error) {
    console.error('Error uploading file:', error);
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
  try {
    const response = await fetch(`${API_BASE_URL}/data/${dataId}/delete`, {
      method: 'DELETE',
    });
    return response.json(); // 삭제 결과 반환
  } catch (error) {
    console.error('Error deleting data:', error);
  }
}
