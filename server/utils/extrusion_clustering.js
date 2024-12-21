// server\utils\extrusion_clustering.mjs

const { kmeans } = require('ml-kmeans');

// 데이터 검증
function validateData(data, requiredFields) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('No data found or dataset is not an array.');
    }

    const invalidRows = data.filter(row =>
        requiredFields.some(field => typeof row[field] !== 'number' || isNaN(row[field]))
    );

    if (invalidRows.length > 0) {
        throw new Error(`Invalid data format. Missing fields in ${invalidRows.length} rows. Required fields: ${requiredFields.join(', ')}`);
    }

    return true;
}

// 데이터 표준화
function preprocessData(data, fields) {
    const features = fields.map(field =>
        data.map(row => row[field])
    );

    const means = features.map(values => values.reduce((a, b) => a + b, 0) / values.length);
    const stds = features.map((values, i) => {
        const mean = means[i];
        const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
        return Math.sqrt(variance) || 1; // 표준편차가 0인 경우 1로 설정
    });

    const scaledData = data.map(row =>
        fields.map((field, i) => (row[field] - means[i]) / stds[i])
    );

    return { scaledData, means, stds };
}

// 클러스터링 수행
function performClustering(data, k) {
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Data for clustering is empty or invalid.');
    }
    if (typeof k !== 'number' || k <= 0) {
        throw new Error('Invalid value for k. Must be a positive integer.');
    }

    const result = kmeans(data, k, { initialization: 'kmeans++', maxIterations: 100 });
    return result;
}

// MongoDB 데이터 쿼리 및 클러스터링
async function clusterData(model, query, k) {
    console.log('Received Query:', query);

    if (!query || typeof query !== 'object' || Object.keys(query).length === 0) {
        throw new Error('Invalid query object.');
    }

    if (typeof k !== 'number' || k <= 0) {
        throw new Error('Invalid value for k. Must be a positive integer.');
    }

    const data = await model.find(query).lean();
    console.log('MongoDB Raw Data Count:', data.length);

    const flattenedData = data.flatMap(file => file.temperatureData);
    console.log('Flattened Data Count:', flattenedData.length);

    const requiredFields = ['temperature', 'mainPressure', 'currentSpeed', 'containerTempFront', 'containerTempBack'];
    const validData = flattenedData.filter(row =>
        requiredFields.every(field => typeof row[field] === 'number' && !isNaN(row[field]))
    );

    console.log('Valid Data Count:', validData.length);

    if (validData.length === 0) {
        throw new Error('No valid rows found in the dataset.');
    }

    const { scaledData, means, stds } = preprocessData(validData, requiredFields);
    console.log('Scaled Data Sample:', scaledData.slice(0, 5));

    const result = performClustering(scaledData, k);
    console.log('Clustering Result:', {
        centroids: result.centroids,
        sampleClusters: result.clusters.slice(0, 10),
    });

    // 각 클러스터의 데이터 개수 계산
    const clusterCounts = result.clusters.reduce((acc, cluster, index) => {
        acc[cluster] = acc[cluster] || { count: 0, sample: [] };
        acc[cluster].count += 1;

        // 각 클러스터에서 최대 3개 샘플만 추가
        if (acc[cluster].sample.length < 3) {
        acc[cluster].sample.push(validData[index]);
        }
        return acc;
    }, {});

    console.log('Cluster Counts:', clusterCounts);

    return {
        centroids: result.centroids.map(centroid =>
            centroid.map((value, i) => value * stds[i] + means[i])
        ),
        clusterCounts,
    };
}

module.exports = { clusterData };
