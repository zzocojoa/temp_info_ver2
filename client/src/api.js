// client\src\api.js

const API_BASE_URL = 'http://localhost:3000/api';

// 파일 업로드
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    return response.json(); // 업로드 결과 반환
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}

// 데이터 저장
export async function saveGraphData(graphData) {
  try {
    const response = await fetch(`${API_BASE_URL}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphData),
    });
    return response.json(); // 저장 결과 반환
  } catch (error) {
    console.error('Error saving graph data:', error);
  }
}

// 데이터 리스트 조회
export async function fetchDataList() {
  try {
    const response = await fetch(`${API_BASE_URL}/data/list`);
    return response.json(); // 조회된 데이터 리스트 반환
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
