from flask import Flask, jsonify, request
from algorithms import bubble_sort, selection_sort, merge_sort, insertion_sort
import time

app = Flask(__name__)

algorithms = {
    "bubble": bubble_sort,
    "selection": selection_sort,
    "insertion": insertion_sort,
    "merge": merge_sort
}

@app.route("/sort", methods=["POST"])
def sort_handler():
    data = request.get_json()

    arr = data.get("array")
    algorithm = data.get("algorithm")
    mode = data.get("mode", "visual")

    if not isinstance(arr, list):
        return jsonify({"error": "Array must be a list"}), 400

    if not all(isinstance(x, (int, float)) for x in arr):
        return jsonify({"error": "Array must contain only numbers"}), 400

    if algorithm not in algorithms:
        return jsonify({"error": "Invalid algorithm"}), 400

    track_steps = True if mode == "visual" else False

    sort_function = algorithms[algorithm]

    start = time.perf_counter()
    result = sort_function(arr, track_steps)
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
    app.run()
