const DEFAULT_SPEED = 200; // milliseconds between steps
let runtimeChart = null;

function createBars(array) {
    const container = document.getElementById("barContainer");
    container.innerHTML = "";

    const containerWidth = container.clientWidth;
    const gap = 2; // match CSS
    const totalGap = gap * (array.length - 1);
    const barWidth = Math.max((containerWidth - totalGap) / array.length, 2); // min 2px width

    array.forEach(() => {
        const bar = document.createElement("div");
        bar.style.width = `${barWidth}px`; // set dynamic width
        container.appendChild(bar);
    });
}

function updateBars(array, highlight = {}) {
    const bars = document.getElementById("barContainer").children;

    array.forEach((value, index) => {
        if (!bars[index]) return;  // safety check
    
        bars[index].style.height = value * 3 + "px";
        bars[index].style.backgroundColor = "steelblue";

        // Highlight range
        if (highlight.range && index >= highlight.range[0] && index <= highlight.range[1]) {
            bars[index].style.backgroundColor = highlight.color;
        }

        // Highlight multiple indices
        if (highlight.indices && highlight.indices.includes(index)) {
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
        console.log(step);
        let arrayToRender = step.array;

        if (!arrayToRender) continue; // skip if undefined
        
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
        updateBars(finalArray, { range: [0, finalArray.length - 1], color: "steelblue" });
    }
}

async function runVisual(array) {
    const algorithm = document.getElementById("algorithmSelect1").value;
    const runButton = document.getElementById("runButton");

    runButton.disabled = true;

    // fetch sorted data
    const res = await fetch("/sort", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            array: [...array],
            algorithm,
            mode: "visual"
        })
    });

    const data = await res.json(); // must be declared BEFORE usage
    console.log("Server response for visual:", data);

    if (data.error) {
        alert(data.error);
        runButton.disabled = false;
        return;
    }

    const speed = Number(document.getElementById("speedControl").value);

    console.log("steps length:", data.steps.length);

    await animateSteps(data.steps, speed);

    runButton.disabled = false;
}

// Run two algorithms
async function runBenchmark(array) {
    const alg1 = document.getElementById("algorithmSelect1").value;
    const alg2 = document.getElementById("algorithmSelect2").value;

    if (alg1 === alg2) {
        alert("Please select two different algorithms.");
        return;
    }

    const runButton = document.getElementById("runButton");
    runButton.disabled = true;

    const results = [];

    for (const algorithm of [alg1, alg2]) {
        try {
            const res = await fetch("/sort", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    array: [...array],
                    algorithm,
                    mode: "benchmark"
                })
            });

            const data = await res.json();

            if (data.error) {
                alert(data.error);
                runButton.disabled = false;
                return;
            }

            results.push({
                algorithm,
                runtime: data.runtime,
                operations: data.operations,
                complexity: data.complexity
            });

        } catch (err) {
            alert("Server error.");
            runButton.disabled = false;
            return;
        }
    }

    renderChart(results);
    renderAnalysis(results, array.length);
    runButton.disabled = false;
}

async function runSort(array) {
    const mode = document.getElementById("modeSelect").value;

    if (mode === "visual") {
        await runVisual(array);
    } else {
        await runBenchmark(array);
    }
}

function renderChart(results) {
    const ctx = document.getElementById("runtimeChart").getContext("2d");

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
                y: { beginAtZero: true }
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

    const ratio = faster.runtime > 0
        ? (slower.runtime / faster.runtime).toFixed(2)
        : "∞";

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
async function sendArray() {
    const input = document.getElementById("arrayInput").value;
    const array = input.split(/[\s,]+/).map(num => Number(num.trim())).filter(num => !isNaN(num));
    const mode = document.getElementById("modeSelect").value;

    console.log("Run button clicked", { array, mode });

    if (array.length === 0) {
        alert("Please enter valid numbers.");
        return;
    }

    if (mode === "visual") {
        document.getElementById("visualSection").style.display = "block";
        document.getElementById("benchmarkSection").style.display = "none";
    } else {
        document.getElementById("visualSection").style.display = "none";
        document.getElementById("benchmarkSection").style.display = "block";
    }

    await runSort(array);
}

// Generate random array
function generateRandom() {
    const size = Number(document.getElementById("arraySize").value);
    const maxValue = Number(document.getElementById("maxValue").value);

    const array = Array.from({ length: size }, () =>
        Math.floor(Math.random() * maxValue)
    );

    document.getElementById("arrayInput").value = array.join(",");

    // Render bars immediately without running the sort
    createBars(array);
    updateBars(array);
}

document.addEventListener("DOMContentLoaded", function () {
    const modeSelect = document.getElementById("modeSelect");
    const visualSection = document.getElementById("visualSection");
    const benchmarkSection = document.getElementById("benchmarkSection");
    const algorithmSelect2 = document.getElementById("algorithmSelect2");
    const runButton = document.getElementById("runButton");

    function updateModeUI() {
        const mode = modeSelect.value;

        if (mode === "visual") {
            visualSection.style.display = "block";
            benchmarkSection.style.display = "none";
            algorithmSelect2.disabled = true;
        } else {
            visualSection.style.display = "none";
            benchmarkSection.style.display = "block";
            algorithmSelect2.disabled = false;
        }
    }

    modeSelect.addEventListener("change", updateModeUI);

    // Attach click handler for Run button
    runButton.addEventListener("click", sendArray);

    // Initialize on page load
    updateModeUI();
});

// Enable all Bootstrap tooltips
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
tooltipTriggerList.map(function (el) {
  return new bootstrap.Tooltip(el);
});