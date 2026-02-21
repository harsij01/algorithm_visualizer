function sendArray() {
    const input = document.getElementById("arrayInput").value;

    const array = input.split(',').map(num => Number(num.trim())).filter(num => !isNaN(num))
}

function generateRandom() {
    const arr = Array.from({length: 20}, () => Math.floor(Math.random() * 100));

    document.getElementById("arrayInput").value = arr.join(",");
}