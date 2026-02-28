from flask import Flask, jsonify, request, render_template
from algorithms import bubble_sort, selection_sort, merge_sort, insertion_sort
import time
import os

app = Flask(__name__)

SORTING_ALGORITHMS = {
    "bubble": bubble_sort,
    "selection": selection_sort,
    "insertion": insertion_sort,
    "merge": merge_sort
}

COMPLEXITIES = {
    "bubble": {
        "best": "O(n)",
        "average": "O(n²)",
        "worst": "O(n²)"
    },
    "selection": {
        "best": "O(n²)",
        "average": "O(n²)",
        "worst": "O(n²)"
    },
    "insertion": {
        "best": "O(n)",
        "average": "O(n²)",
        "worst": "O(n²)"
    },
    "merge": {
        "best": "O(n log n)",
        "average": "O(n log n)",
        "worst": "O(n log n)"
    }
}

@app.route("/")
def index():
    return render_template("sort.html")

@app.route("/sort", methods=["POST"])
def sort_handler():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No JSON data provided"}), 400

    arr = data.get("array")
    algorithm = data.get("algorithm")
    mode = data.get("mode", "visual")

    if not isinstance(arr, list):
        return jsonify({"error": "Array must be a list"}), 400

    if not all(isinstance(x, (int, float)) for x in arr):
        return jsonify({"error": "Array must contain only numbers"}), 400
    
    MAX_ARRAY_SIZE = 1000
    if len(arr) > MAX_ARRAY_SIZE:
        return jsonify({"error": "Array too large"}), 400

    if algorithm not in SORTING_ALGORITHMS:
        return jsonify({"error": "Invalid algorithm"}), 400

    if mode not in ["visual", "benchmark"]:
        return jsonify({"error": "Invalid mode"}), 400

    track_steps = (mode == "visual")
    sort_function = SORTING_ALGORITHMS[algorithm]

    start = time.perf_counter()

    try:
        result = sort_function(arr, track_steps)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    end = time.perf_counter()

    runtime = (end - start) * 1000  # convert to ms

    response = {
        "original_array": arr,
        "runtime": round(runtime, 4)
    }

    if track_steps:
        try:
            sorted_arr, steps, op_count = result
        except Exception:
            return jsonify({"error": "Sorting function must return (sorted_arr, steps, op_count) for visual mode"}), 500
        response.update({
            "sorted_array": sorted_arr,
            "steps": steps,
            "operations": op_count
        })
    else:
        try:
            sorted_arr, op_count = result
        except Exception:
            return jsonify({"error": "Sorting function must return (sorted_arr, op_count) for benchmark mode"}), 500
        response.update({
            "sorted_array": sorted_arr,
            "operations": op_count,
            "complexity": COMPLEXITIES[algorithm]
        })

    return jsonify(response)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
