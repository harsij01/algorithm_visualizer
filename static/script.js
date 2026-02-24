const DEFAULT_SPEED = 200; // milliseconds between steps

function renderBars(array, highlight = {}) {
    const container = document.getElementById("barContainer");
    container.innerHTML = "";

    array.forEach((value, index) => {
        const bar = document.createElement("div");
        bar.style.height = value * 3 + "px";
        bar.style.flex = "1";
        bar.style.margin = "2px";
        bar.style.backgroundColor = "steelblue";

        // Highlight based on step
        if (highlight.indices && highlight.indices.includes(index)) {
            bar.style.backgroundColor = highlight.color;
        } else if (highlight.index === index) {
            bar.style.backgroundColor = highlight.color;
        }

        container.appendChild(bar);
    });
}

async function animateSteps(steps, speed = DEFAULT_SPEED) {
    for (const step of steps) {
        let arrayToRender = [];

        // Determine which array to render for this step
        if (step.array) arrayToRender = step.array;
        else if (step.merged) arrayToRender = step.merged;
        else if (step.result) arrayToRender = step.result;

        // Set highlight based on step type
        let highlight = {};
        switch (step.type) {
            case "comparison":
                if (step.indices) highlight = { indices: step.indices, color: "red" };
                break;
            case "swap":
                if (step.indices) highlight = { indices: step.indices, color: "orange" };
                break;
            case "insert":
            case "extract":
                highlight = { index: step.index, color: "green" };
                break;
            case "shift":
                if (step.indices) highlight = { indices: step.indices, color: "purple" };
                break;
            case "append":
                highlight = { index: arrayToRender.length - 1, color: "blue" };
                break;
            case "merge_complete":
                highlight = {}; // optional: color all bars differently if you want
                break;
        }

        renderBars(arrayToRender, highlight);
        await new Promise(resolve => setTimeout(resolve, speed));
    }
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
        if (data.error) {
            alert(data.error);
            return;
        }

        if (mode === "visual" && data.steps) {
            await animateSteps(data.steps);
        } else {
            renderBars(data.sorted_array);
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
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
    runSort(array);
}