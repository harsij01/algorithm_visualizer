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
                steps.append({'type': 'step', 'indices': (j, j + 1), 'array': arr.copy()})
        
        if not swapped:
            break

    return arr, steps

def selection_sort(arr):
    arr = arr.copy()
    n = len(arr)

    for i in range(n - 1):
        min_index = i

        for j in range(i + 1, n):
            if arr[j] < arr[min_index]:
                min_index = j

        arr[min_index], arr[i] = arr[i], arr[min_index]

    return arr

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
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = arr[:mid]
    right = arr[mid:]

    left = merge_sort(left)
    right = merge_sort(right)

    return merge(left, right)

print(merge_sort([1, 6, 3, 29, 7, 30, 15, 2]))