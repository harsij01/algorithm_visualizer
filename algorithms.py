import time

def bubble_sort(arr, track_steps=True):
    arr = arr.copy()
    n = len(arr)
    steps = []

    for i in range(n - 1):
        swapped = False

        for j in range(n - i - 1):
            if track_steps:
                steps.append({'type': 'comparison', 'indices': (j, j + 1), 'array': arr.copy()})

            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
                if track_steps:
                    steps.append({'type': 'swap', 'indices': (j, j + 1), 'array': arr.copy()})
        
        if not swapped:
            break

    return arr, steps

def selection_sort(arr, track_steps=True):
    arr = arr.copy()
    n = len(arr)
    steps = []

    for i in range(n - 1):
        min_index = i

        for j in range(i + 1, n):
            if track_steps:
                steps.append({'type': 'comparison', 'indices': (j,min_index), 'array': arr.copy()})

            if arr[j] < arr[min_index]:
                min_index = j
                if track_steps:
                    steps.append({'type': 'change_min_index', 'index': min_index, 'array': arr.copy()})

        if min_index != i:
            arr[min_index], arr[i] = arr[i], arr[min_index]
            if track_steps:
                steps.append({'type': 'swap', 'indices': (min_index, i), 'array': arr.copy()})

    return arr, steps

def merge(left, right, steps, track_steps=True):
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if track_steps:
            steps.append({'type': 'comparison', 'left_value': left[i], 'right_value': right[j], 'result': result.copy()})

        if left[i] < right[j]:
            result.append(left[i])
            if track_steps:
                steps.append({'type': 'append', 'value': left[i], 'result': result.copy()})
            i += 1
        else:
            result.append(right[j])
            if track_steps:
                steps.append({'type': 'append', 'value': right[j], 'result': result.copy()})
            j += 1

    while i < len(left):
        result.append(left[i])
        if track_steps:
            steps.append({'type': 'append', 'value': left[i], 'result': result.copy()})
        i += 1
    
    while j < len(right):
        result.append(right[j])
        if track_steps:
            steps.append({'type': 'append', 'value': left[i], 'result': result.copy()})
        j += 1

    return result

def merge_sort(arr, track_steps=True):
    arr = arr.copy()
    steps = []

    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = arr[:mid]
    right = arr[mid:]

    if track_steps:
        steps.append({'type': 'split', 'left': left.copy(), 'right': right.copy()})

    left = merge_sort(left)
    right = merge_sort(right)

    merged = merge(left, right, track_steps=track_steps)
    if track_steps:
        steps.append({'type': 'merge_complete', 'merged': merged.copy()})

    return merged

def insertion_sort(arr, track_steps=True):
    arr = arr.copy()
    steps = []

    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1

        if track_steps:
            steps.append({'type': 'extract', 'index': i, 'array': arr.copy()})

        while j >= 0 and key < arr[j]:
            if track_steps:
                steps.attend({'type': 'comparison', 'indices': (j, j + 1), 'array': arr.copy()})

            arr[j + 1] = arr[j]
            if track_steps:
                steps.append({'type': 'shift', 'indices': (j, j + 1), 'array': arr.copy()})

            j -= 1

        arr[j + 1] = key
        if track_steps:
            steps.append({'type': 'insert', 'index': j + 1, 'array': arr.copy()})

    return arr, steps