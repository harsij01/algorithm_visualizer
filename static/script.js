function renderBars(array) {
    const container = document.getElementById("barContainer");
    container.innerHTML = "";

    array.forEach(value => {
        const bar = document.createElement("div");

        bar.style.height = value * 3 + "px";
        bar.style.flex = "1";
        bar.style.margin = "2px";
        bar.style.backgroundColor = "steelblue";

        container.appendChild(bar);
    });
}

function runSort(array) {
    const algorithm = document.getElementById("algorithmSelect").value;
    const mode = document.getElementById("modeSelect").value;

    fetch("/sort", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ array, algorithm, mode })
    })
    .then(res => res.json())
    .then(async data => {
        if (data.error) { alert(data.error); return; }

        if (mode === "visual" && data.steps) {
            await animateSteps(data.steps);
        } else {
            renderBars(data.sorted_array);
        }
    })
    .catch(error => { console.error("Error:", error); });
}

function sendArray() {
    const input = document.getElementById("arrayInput").value;

    const array = input.split(/[\s,]+/).map(num => Number(num.trim())).filter(num => !isNaN(num));

    if (array.length === 0) {
        alert("Please enter valid numbers.");
        return;
    }

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