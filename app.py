from flask import Flask, jsonify, request, render_template
from algorithms import bubble_sort, selection_sort, merge_sort, insertion_sort
import time

app = Flask(__name__)

algorithms = {
    "bubble": bubble_sort,
    "selection": selection_sort,
    "insertion": insertion_sort,
    "merge": merge_sort
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
    
    if len(arr) > 1000:
        return jsonify({"error": "Array too large"}), 400

    if algorithm not in algorithms:
        return jsonify({"error": "Invalid algorithm"}), 400

    if mode not in ["visual", "benchmark"]:
        return jsonify({"error": "Invalid mode"}), 400

    track_steps = (mode == "visual")

    sort_function = algorithms[algorithm]

    start = time.perf_counter()
    
    arr_copy = arr.copy()
    result = sort_function(arr_copy, track_steps)

    end = time.perf_counter()

    runtime = end - start

    if track_steps:
        sorted_arr, steps = result
        return jsonify({
            "original_array": arr,
            "sorted_array": sorted_arr,
            "steps": steps,
            "runtime": runtime
        })

    else:
        sorted_arr = result
        return jsonify({
            "original_array": arr,
            "sorted_array": sorted_arr,
            "runtime": runtime
        })

if __name__ == "__main__":
    app.run(debug=True)
