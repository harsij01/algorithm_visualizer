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

    if track_steps:
        return arr, steps
    else:
        return arr

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

    if track_steps:
        return arr, steps
    else:
        return arr

def merge_sort(arr, track_steps=True):
    arr = arr.copy()
    steps = []

    def _merge_sort(sub_arr):
        if len(sub_arr) <= 1:
            return sub_arr

        mid = len(sub_arr) // 2
        left = _merge_sort(sub_arr[:mid])
        right = _merge_sort(sub_arr[mid:])

        merged = []
        i = j = 0

        while i < len(left) and j < len(right):
            if track_steps:
                steps.append({'type': 'comparison', 'left': left[i], 'right': right[j], 'merged': merged.copy()})
            if left[i] < right[j]:
                merged.append(left[i])
                if track_steps:
                    steps.append({'type': 'append', 'value': left[i], 'merged': merged.copy()})
                i += 1
            else:
                merged.append(right[j])
                if track_steps:
                    steps.append({'type': 'append', 'value': right[j], 'merged': merged.copy()})
                j += 1

        while i < len(left):
            merged.append(left[i])
            if track_steps:
                steps.append({'type': 'append', 'value': left[i], 'merged': merged.copy()})
            i += 1

        while j < len(right):
            merged.append(right[j])
            if track_steps:
                steps.append({'type': 'append', 'value': right[j], 'merged': merged.copy()})
            j += 1

        if track_steps:
            steps.append({'type': 'merge_complete', 'merged': merged.copy()})

        return merged

    sorted_arr = _merge_sort(arr)
    
    if track_steps:
        return sorted_arr, steps
    else:
        return sorted_arr

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
                steps.append({'type': 'comparison', 'indices': (j, j + 1), 'array': arr.copy()})

            arr[j + 1] = arr[j]
            if track_steps:
                steps.append({'type': 'shift', 'indices': (j, j + 1), 'array': arr.copy()})

            j -= 1

        arr[j + 1] = key
        if track_steps:
            steps.append({'type': 'insert', 'index': j + 1, 'array': arr.copy()})

    if track_steps:
        return arr, steps
    else:
        return arr