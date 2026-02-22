function runSort(array) {
    const algorithm = document.getElementById("algorithmSelect").value;
    const mode = document.getElementById("modeSelect").value;

    fetch("/sort", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            array: array,
            algorithm: algorithm,
            mode: mode
        })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("resultText").innerText =
            "Sorted Array: " + data.sorted_array.join(", ");
    });    
}

function sendArray() {
    const input = document.getElementById("arrayInput").value;

    const array = input.split(/[\s,]+/).map(num => Number(num.trim())).filter(num => !isNaN(num));
    runSort(array);
}

function generateRandom() {
    const size = Number(document.getElementById("arraySize").value);
    const maxValue = Number(document.getElementById("maxValue").value);

    const array = Array.from({ length: size }, () =>
        Math.floor(Math.random() * maxValue)
    );

    document.getElementById("arrayInput").value = array.join(",");
    runSort(array)
}