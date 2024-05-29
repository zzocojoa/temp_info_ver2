/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

// client/src/workers/averageDataWorker.js
self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js');

self.onmessage = function(event) {
    const { data, chunkSize } = event.data;

    let groupedData = new Map();

    const processChunk = (chunk) => {
        chunk.forEach(item => {
            const roundedTime = moment(item.time, 'HH:mm:ss').startOf('minute').seconds(
                moment(item.time, 'HH:mm:ss').seconds()
            ).format('HH:mm:ss');

            // const roundedSeconds = Math.floor(moment(item.time, 'HH:mm:ss').seconds() / 15) * 15;
            // const roundedTime = moment(item.time, 'HH:mm:ss').startOf('minute').seconds(roundedSeconds).format('HH:mm:ss');

            const dateTimeKey = `${item.date} ${roundedTime}`;
            if (!groupedData.has(dateTimeKey)) {
                groupedData.set(dateTimeKey, { sum: 0, count: 0, date: item.date, time: roundedTime });
            }
            let entry = groupedData.get(dateTimeKey);
            entry.sum += item.temperature;
            entry.count += 1;
        });
    };

    for (let i = 0; i < data.length; i += chunkSize) {
        processChunk(data.slice(i, i + chunkSize));
    }

    const averagedData = Array.from(groupedData.values()).map(entry => ({
        date: entry.date,
        time: entry.time,
        temperature: entry.sum / entry.count
    }));

    self.postMessage(averagedData);
};
