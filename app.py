from flask import Flask, jsonify, request
from algorithms import bubble_sort, selection_sort, merge_sort, insertion_sort
import time

app = Flask(__name__)

@app.route('/sort/<algorithm>', methods=["POST"])
def run_selection(algorithm):
    data = request.get_json()
    arr = data["array"]
    mode = data.get("mode", "visual")
    track_steps = True if mode == "visual" else False

    start =  time.perf_counter()

    if algorithm == "bubble":
        result = bubble_sort(arr, track_steps)
    elif algorithm == "selection":
        result = selection_sort(arr, track_steps)
    elif algorithm == "insertion":
        result = insertion_sort(arr, track_steps)
    elif algorithm == "merge":
        result = merge_sort(arr, track_steps)

    end = time.perf_counter()

    runtime = end - start

    if track_steps:
        return jsonify({"sorted_array": result[0], "steps": result[1]})
    return jsonify({"sorted_array": result[0], "runtime": runtime})

if __name__ == "__main__":
    app.run()

