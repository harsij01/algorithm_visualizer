const DEFAULT_SPEED = 200; // milliseconds between steps
let runtimeChart = null;

function createBars(array) {
    const container = document.getElementById("barContainer");
    container.innerHTML = "";

    array.forEach(() => {
        const bar = document.createElement("div");
        container.appendChild(bar);
    });
}

function updateBars(array, highlight = {}) {
    const bars = document.getElementById("barContainer").children;

    array.forEach((value, index) => {
        bars[index].style.height = value * 3 + "px";
        bars[index].style.backgroundColor = "steelblue";

        // Highlight range
        if (highlight.range &&
            index >= highlight.range[0] &&
            index <= highlight.range[1]) {
            bars[index].style.backgroundColor = highlight.color;
        }

        // Highlight multiple indices
        if (highlight.indices &&
            highlight.indices.includes(index)) {
            bars[index].style.backgroundColor = highlight.color;
        }

        // Highlight single index
        if (highlight.index === index) {
            bars[index].style.backgroundColor = highlight.color;
        }
    });
}

// Animate sorting steps
async function animateSteps(steps, speed = DEFAULT_SPEED) {
    let finalArray = null;

    if (steps.length > 0) {
        createBars(steps[0].array);
    }

    const COLORS = {
            comparison: "red",
            swap: "orange",
            insert: "green",
            shift: "purple",
            overwrite: "green",
            change_min_index: "yellow",
            append: "blue"
        };

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
                    highlight = { indices: step.indices, color: COLORS.comparison };
                break;

            case "swap":
                if (step.indices)
                    highlight = { indices: step.indices, color: COLORS.swap };
                break;

            case "insert":
            case "extract":
                highlight = { index: step.index, color: COLORS.insert };
                break;

            case "shift":
                if (step.indices)
                    highlight = { indices: step.indices, color: COLORS.shift };
                break;

            case "append":
                highlight = { index: arrayToRender.length - 1, color: COLORS.append };
                break;

            case "overwrite":
                highlight = { index: step.index, color: COLORS.overwrite };
                break;

            case "change_min_index":
                highlight = { index: step.index, color: COLORS.change_min_index };
                break;
        }

        updateBars(arrayToRender, highlight);
        await new Promise(resolve => {
            setTimeout(() => requestAnimationFrame(resolve), speed);
        });
    }

    if (finalArray) {
        updateBars(finalArray, { range: [0, finalArray.length - 1], color: "green" });
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

        results.push({
            algorithm,
            runtime: data.runtime,
            operations: data.operations,
            complexity: data.complexity   // if you added backend complexity_map
        });
    }
    renderChart(results);
    renderAnalysis(results, array.length);
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
                label: "Runtime (ms)",
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

function renderAnalysis(results, arraySize) {
    const analysisDiv = document.getElementById("analysis");
    analysisDiv.innerHTML = "";

    results.forEach(r => {
        analysisDiv.innerHTML += `
            <div class="analysis-card">
                <h3>${r.algorithm.toUpperCase()}</h3>
                <p><strong>Runtime:</strong> ${r.runtime.toFixed(4)} ms</p>
                <p><strong>Operations:</strong> ${r.operations}</p>
                ${r.complexity ? `
                    <p><strong>Best:</strong> ${r.complexity.best}</p>
                    <p><strong>Average:</strong> ${r.complexity.average}</p>
                    <p><strong>Worst:</strong> ${r.complexity.worst}</p>
                ` : ""}
            </div>
        `;
    });

    // Highlight faster algorithm
    const faster = results[0].runtime < results[1].runtime ? results[0] : results[1];
    const slower = results[0].runtime < results[1].runtime ? results[1] : results[0];

    const ratio = (slower.runtime / faster.runtime).toFixed(2);

    analysisDiv.innerHTML += `
        <div class="comparison-highlight">
            🚀 <strong>${faster.algorithm.toUpperCase()}</strong> is 
            <strong>${ratio}x faster</strong> than 
            ${slower.algorithm.toUpperCase()} 
            (n = ${arraySize})
        </div>
    `;
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