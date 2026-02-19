def bubble_sort(arr):
    arr = arr.copy()

    n = len(arr)
    comparisons = 0
    swaps = 0

    for i in range(n - 1):
        swapped = False

        for j in range(n - i - 1):
            comparisons += 1

            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
                swaps += 1
        
        if not swapped:
            break

    return arr, comparisons, swaps