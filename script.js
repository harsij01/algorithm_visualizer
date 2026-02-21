function sendArray() {
    const input = document.getElementById("arrayInput").value;
    const algorithm = document.getElementById("algorithmSelect").value;
    const mode = document.getElementById("modeSelect").value;

    const array = input.split('/[\s,]+/').map(num => Number(num.trim())).filter(num => !isNaN(num));

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
        console.log(data);
    });
}