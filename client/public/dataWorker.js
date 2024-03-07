// client/src/components/tempgraph/tempgraphmodule/dataWorker.js
// client/public/dataWorker.js
self.addEventListener('message', async (event) => {
  const { filteredData } = event.data;
  try {
    const API_BASE_URL = 'http://localhost:5000/api'; // 실제 API 주소로 변경 필요
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
    const data = await response.json();
    self.postMessage({ success: true, data });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
});
