# Algorithm Visualizer

A web-based algorithm visualizer built with **Flask**, **Python**, and **JavaScript**.  

---

## Features

- Visualize sorting algorithms in real-time with colored bars.
- Highlight comparisons, swaps, insertions, and overwrites.
- Benchmark mode to measure algorithm runtime without visualization.
- Generate random arrays or input custom arrays.
- Responsive and easy-to-use interface.

---

## Project Description

This project was built to:
- Understand how sorting algorithms work internally
- Visualize algorithm behavior in real-time
- Compare theoretical complexity vs actual runtime
- Strengthen full-stack development skills

The application supports both:
- **Visual Mode** – animated step-by-step sorting
- **Benchmark Mode** – runtime and operation comparison

---

## Supported Algorithms

- Bubble Sort
- Selection Sort
- Insertion Sort
- Merge Sort

Each algorithm includes:
- Operation counting
- Time complexity analysis
- Step tracking for animation

---

## Features
### Visualization

* Dynamic bar width (responsive to array size)
* Color-coded highlights:
    * 🔴 Comparison
    * 🟠 Swap
    * 🟢 Insert / Overwrite
    * 🟡 Minimum index change
    * 🟣 Shift
* Adjustable animation speed
* Supports custom and randomly generated arrays

### Benchmark Mode

* Compare two algorithms side-by-side
* Runtime measurement (milliseconds)
* Operation count comparison
* Displays theoretical time complexities:
    * Best case
    * Average case
    * Worst case

### Backend Validation

- Input validation for numeric arrays
- Maximum array size protection
- Mode and algorithm validation
- Graceful error handling

---

## Tech Stack

* Backend
    * Python
    * Flask
* Frontend
    * HTML5
    * CSS3
    * Bootstrap 5
    * JavaScript (Vanilla)
    * Chart.js

---

## Project Structure

algorithm_visualizer/
│
├── app.py
├── algorithms.py
├── templates/
│   └── sort.html
├── static/
│   ├── script.js
│   └── style.css
└── README.md

## Installation

1. Clone this repository:

```bash
git clone https://github.com/harsij01/algorithm_visualizer
cd algorithm_visualizer