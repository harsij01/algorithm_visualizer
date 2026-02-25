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

    def _merge_sort(left, right):
        if left >= right:
            return

        mid = (left + right) // 2
        _merge_sort(left, mid)
        _merge_sort(mid + 1, right)

        merge(left, mid, right)

    def merge(left, mid, right):
        temp = []
        i, j = left, mid + 1

        while i <= mid and j <= right:
            if track_steps:
                steps.append({
                    "type": "comparison",
                    "indices": (i, j),
                    "array": arr.copy()
                })

            if arr[i] <= arr[j]:
                temp.append(arr[i])
                i += 1
            else:
                temp.append(arr[j])
                j += 1

        while i <= mid:
            temp.append(arr[i])
            i += 1

        while j <= right:
            temp.append(arr[j])
            j += 1

        # Copy back into original array
        for k in range(len(temp)):
            arr[left + k] = temp[k]

            if track_steps:
                steps.append({
                    "type": "overwrite",
                    "index": left + k,
                    "array": arr.copy()
                })

    _merge_sort(0, len(arr) - 1)

    if track_steps:
        return arr, steps
    else:
        return arr

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