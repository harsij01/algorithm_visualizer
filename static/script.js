const DEFAULT_SPEED = 200; // milliseconds between steps
let runtimeChart = null;

// Render array bars
function renderStep(array, highlight = {}) {
    const container = document.getElementById("barContainer");
    container.innerHTML = "";

    array.forEach((value, index) => {
        const bar = document.createElement("div");
        bar.style.height = value * 3 + "px";
        bar.style.flex = "1";
        bar.style.margin = "0";
        bar.style.backgroundColor = "steelblue";

        // Highlight range
        if (highlight.range) {
            if (index >= highlight.range[0] && index <= highlight.range[1]) {
                bar.style.backgroundColor = highlight.color;
            }
        }

        // highlight multiple indices
        if (highlight.indices && highlight.indices.includes(index)) {
            bar.style.backgroundColor = highlight.color;
        }

        // highlight single index
        if (highlight.index === index) {
            bar.style.backgroundColor = highlight.color;
        }

        container.appendChild(bar);
    });
}

// Animate sorting steps
async function animateSteps(steps, speed = DEFAULT_SPEED) {
    let finalArray = null;

    for (const step of steps) {
        let arrayToRender = step.array;
        
        if (arrayToRender) {
            finalArray = arrayToRender; // keep updating final state
        }

        // Set highlight based on step type
        let highlight = {};

        switch (step.type) {
            case "comparison":
                if (step.indices)
                    highlight = { indices: step.indices, color: "red" };
                break;

            case "swap":
                if (step.indices)
                    highlight = { indices: step.indices, color: "orange" };
                break;

            case "insert":
            case "extract":
                highlight = { index: step.index, color: "green" };
                break;

            case "shift":
                if (step.indices)
                    highlight = { indices: step.indices, color: "purple" };
                break;

            case "append":
                highlight = { index: arrayToRender.length - 1, color: "blue" };
                break;

            case "overwrite":
                highlight = { index: step.index, color: "green" };
                break;

            case "change_min_index":
                highlight = { index: step.index, color: "yellow" };
                break;
        }

        renderStep(arrayToRender, highlight);
        await new Promise(resolve => setTimeout(resolve, speed));
    }

    if (finalArray) {
        renderStep(finalArray, { range: [0, finalArray.length - 1], color: "green" });
    }
}

// Run two algorithms
async function runSort(array) {
    const alg1 = document.getElementById("algorithmSelect1").value;
    const alg2 = document.getElementById("algorithmSelect2").value;
    const mode = document.getElementById("modeSelect").value;

    if (alg1 === alg2) {
        alert("Please select two different algorithms.");
        return;
    }

    if (mode !== "benchmark") {
        alert("Comparison graph works in Benchmark mode only.");
        return;
    }
    
    const results = [];

    for (const algorithm of [alg1, alg2]) {
        const res = await fetch("/sort", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                array: [...array],  // clone array to ensure fairness
                algorithm,
                mode: "benchmark"
            })
        });

        const data = await res.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        results.push({ algorithm, runtime: data.runtime });
    }
    renderChart(results);
}

// Render runtime chart
function renderChart(results) {
    const ctx = document.getElementById("runtimeChart").getContext("2d");

    // Destroy previous chart if exists
    if (runtimeChart) {
        runtimeChart.destroy();
    }

    runtimeChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: results.map(r => r.algorithm.toUpperCase()),
            datasets: [{
                label: "Runtime (seconds)",
                data: results.map(r => r.runtime),
                backgroundColor: ["steelblue", "orange"]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Handle input array
function sendArray() {
    const input = document.getElementById("arrayInput").value;
    const array = input.split(/[\s,]+/).map(num => Number(num.trim())).filter(num => !isNaN(num));

    if (array.length === 0) {
        alert("Please enter valid numbers.");
        return;
    }

    runSort(array);
}

// Generate random array
function generateRandom() {
    const size = Number(document.getElementById("arraySize").value);
    const maxValue = Number(document.getElementById("maxValue").value);

    const array = Array.from({ length: size }, () =>
        Math.floor(Math.random() * maxValue)
    );

    document.getElementById("arrayInput").value = array.join(",");
    runSort(array)
}