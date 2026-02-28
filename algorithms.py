def bubble_sort(arr, track_steps=True):
    arr = arr.copy()
    n = len(arr)
    steps = [] if track_steps else None
    op_count = 0 # count the number of steps taken to sort

    for i in range(n - 1):
        swapped = False

        # last i elements are already in place
        for j in range(n - i - 1):
            op_count += 1

            if track_steps:
                steps.append({'type': 'comparison', 'indices': [j, j + 1], 'array': arr.copy()})

            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j] # Swap using tuple assignment
                swapped = True
                op_count += 1

                if track_steps:
                    steps.append({'type': 'swap', 'indices': [j, j + 1], 'array': arr.copy()})
        
        # If no two elements were swapped by inner loop, then break
        if not swapped:
            break

    return (arr, steps, op_count) if track_steps else (arr, op_count)

def selection_sort(arr, track_steps=True):
    arr = arr.copy()
    n = len(arr)
    steps = [] if track_steps else None
    op_count = 0 # count the number of steps taken to sort

    for i in range(n - 1):
        min_index = i

        # Find minimum in remaining unsorted array
        for j in range(i + 1, n):
            op_count += 1

            if track_steps:
                steps.append({'type': 'comparison', 'indices': [j,min_index], 'array': arr.copy()})

            if arr[j] < arr[min_index]:
                min_index = j
                if track_steps:
                    steps.append({'type': 'change_min_index', 'index': min_index, 'array': arr.copy()})

        if min_index != i:
            # Swap with first element of unsorted part
            arr[min_index], arr[i] = arr[i], arr[min_index]
            op_count += 1

            if track_steps:
                steps.append({'type': 'swap', 'indices': [min_index, i], 'array': arr.copy()})

    return (arr, steps, op_count) if track_steps else (arr, op_count)

def insertion_sort(arr, track_steps=True):
    arr = arr.copy()
    steps = [] if track_steps else None
    op_count = 0 # count the number of steps taken to sort

    # Traverse through 1 to len(arr)
    for i in range(1, len(arr)):
        # Store the current element to be inserted
        key = arr[i]

        # Move elements of arr[0..i-1], that are greater than key, to one position ahead of their current position
        j = i - 1

        if track_steps:
            steps.append({'type': 'extract', 'index': i, 'array': arr.copy()})

        while j >= 0:
            op_count += 1
            
            if key < arr[j]:
                if track_steps:
                    steps.append({'type': 'comparison', 'indices': [j, j + 1], 'array': arr.copy()})

                arr[j + 1] = arr[j]
                op_count += 1 

                if track_steps:
                    steps.append({'type': 'shift', 'indices': [j, j + 1], 'array': arr.copy()})

                j -= 1
            else:
                break

        # Insert the key at its correct position
        arr[j + 1] = key

        op_count += 1

        if track_steps:
            steps.append({'type': 'insert', 'index': j + 1, 'array': arr.copy()})

    return (arr, steps, op_count) if track_steps else (arr, op_count)

def merge_sort(arr, track_steps=True):
    arr = arr.copy()
    steps = []
    op_count = 0 # count the number of steps taken to sort

    def _merge_sort(left, right):
        nonlocal op_count
        
        if left >= right:
            return

        # Finding the midpoint of the list
        mid = (left + right) // 2

        _merge_sort(left, mid)
        _merge_sort(mid + 1, right)

        merge(left, mid, right)

    def merge(left, mid, right):
        temp = []
        i, j = left, mid + 1
        nonlocal op_count

        while i <= mid and j <= right:
            op_count += 1

            if track_steps:
                steps.append({
                    "type": "comparison",
                    "indices": [i, j],
                    "array": arr.copy()
                })

            # Copy data to temp lists left_half and right_half
            if arr[i] <= arr[j]:
                temp.append(arr[i])
                i += 1
            else:
                temp.append(arr[j])
                j += 1

        # Check if any elements were left in the left half
        while i <= mid:
            temp.append(arr[i])
            i += 1

        # Check if any elements were left in the right half
        while j <= right:
            temp.append(arr[j])
            j += 1

        # Copy back into original array
        for k in range(len(temp)):
            arr[left + k] = temp[k]
            op_count += 1  # write operation

            if track_steps:
                steps.append({
                    "type": "overwrite",
                    "index": left + k,
                    "array": arr.copy()
                })

    _merge_sort(0, len(arr) - 1)

    return (arr, steps, op_count) if track_steps else (arr, op_count)