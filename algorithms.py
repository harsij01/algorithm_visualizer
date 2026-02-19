def bubble_sort(arr):
    arr = arr.copy()
    n = len(arr)
    steps = []

    for i in range(n - 1):
        swapped = False

        for j in range(n - i - 1):
            steps.append({'type': 'comparison', 'indices': (j, j + 1), 'array': arr.copy()})

            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
                steps.append({'type': 'swap', 'indices': (j, j + 1), 'array': arr.copy()})
        
        if not swapped:
            break

    return arr, steps

def selection_sort(arr):
    arr = arr.copy()
    n = len(arr)
    steps = []

    for i in range(n - 1):
        min_index = i

        for j in range(i + 1, n):
            steps.append({'type': 'comparison', 'indices': (j,min_index), 'array': arr.copy()})

            if arr[j] < arr[min_index]:
                min_index = j
                steps.append({'type': 'change_min_index', 'index': min_index, 'array': arr.copy()})

        if min_index != i:
            arr[min_index], arr[i] = arr[i], arr[min_index]
            steps.append({'type': 'swap', 'indices': (min_index, i), 'array': arr.copy()})

    return arr, steps

def merge(left, right):
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])

    return result

def merge_sort(arr):
    arr = arr.copy()

    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = arr[:mid]
    right = arr[mid:]

    left = merge_sort(left)
    right = merge_sort(right)

    return merge(left, right)

def insertion_sort(arr):
    arr = arr.copy()
    steps = []

    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1

        steps.append({'type': 'extract', 'index': i, 'array': arr.copy()})

        while j >= 0 and key < arr[j]:
            steps.attend({'type': 'comparison', 'indices': (j, j + 1), 'array': arr.copy()})

            arr[j + 1] = arr[j]
            steps.append({'type': 'shift', 'indices': (j, j + 1), 'array': arr.copy()})

            j -= 1

        arr[j + 1] = key
        steps.append({'type': 'insert', 'index': j + 1, 'array': arr.copy()})

    return arr, steps