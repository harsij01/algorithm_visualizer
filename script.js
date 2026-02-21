function sendArray() {
    const input = document.getElementById("arrayInput").value;

    const array = input.split(',').map(num => Number(num.trim())).filter(num => !isNaN(num))
}