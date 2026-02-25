const DEFAULT_SPEED = 200; // milliseconds between steps

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
            renderStep(data.sorted_array);
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
    runSort(array)
}