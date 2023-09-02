let date = new Date('2023-09-02T00:00:00Z'); // GMT time
let shanghaiTime = date.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' });
console.log('Shanghai time: ' + shanghaiTime);
let kolkataTime = date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
console.log('Kolkata time: ' + kolkataTime);