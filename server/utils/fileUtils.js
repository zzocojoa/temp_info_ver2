// utils/fileUtils.js

const fs = require('fs').promises;
const Papa = require('papaparse');

// 재시도 로직을 포함한 비동기 파일 읽기 함수
const retryAsync = async (fn, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
    }
  }
};

// CSV 파일 파싱 함수
const parseCsvFile = async (filePath) => {
  const fileContent = await retryAsync(() => fs.readFile(filePath, 'utf8'));
  const allData = [];

  return new Promise((resolve, reject) => {
    Papa.parse(fileContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      step: (row) => {
        const { '[Date]': date, '[Time]': time, '[Temperature]': temperature } = row.data;
        allData.push({ date, time, temperature });
      },
      complete: () => resolve(allData),
      error: (error) => reject(error.message),
    });
  });
};

// 비동기 파일 삭제 함수
const asyncDeleteFile = (filePath) => retryAsync(() => fs.unlink(filePath));

module.exports = {
  retryAsync,
  parseCsvFile,
  asyncDeleteFile,
};
