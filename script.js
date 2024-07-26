// creates array and html elements to sort
let arr = [];
let barTracker = [];
let length = 100;
const bars = document.querySelector(".bars");
let currentSortOfSorts;
let sortInProgress = false;
let addDisabledTooltipClass = false;

const shellsortGaps = [701, 301, 132, 57, 23, 10, 4, 1];

for (let i = 1; i < length; i++) {
    let number = Math.ceil(Math.random() * (length - 1));
    number = i;
    const div = document.createElement("div");
    bars.appendChild(div);
    div.style.height = (57.89 * number) / length + "dvh";
    div.classList.add("d" + i);
    arr.push(number);
    barTracker.push(i);
}
shuffleArr();

function shuffleArr() {
    if (!sortInProgress) {
        let currentIndex = arr.length;
        while (currentIndex != 0) {
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            swap(randomIndex, currentIndex);
        }
        updateVisual();
    }
}

//fills in table of sorts, sorts in other file
changeSortOfSorts("name");

function updateSelected(selectedSort) {
    let sortOptions = document.querySelectorAll(".row");
    for (const sort of sortOptions) {
        sort.classList.remove("selected-row");
    }
    selectedSort.classList.add("selected-row");
    sorts.find((o) => o.selected === true).selected = false;
    let selectedSortName = selectedSort.firstElementChild.innerHTML;
    sorts.find((o) => o.name === selectedSortName).selected = true;
}

function addButtonDown(button) {
    button.classList.add("button-down");
}

function removeButtonDown(button) {
    button.classList.remove("button-down");
    if (addDisabledTooltipClass) {
        button.classList.add("disabled-tooltip");
        addDisabledTooltipClass = false;
    }
}

function toggleButtons(enable) {
    let buttons = document.querySelectorAll(".button");
    for (const button of buttons) {
        if (enable) {
            button.classList.remove("disabled");
            button.classList.remove("disabled-tooltip");
            addDisabledTooltipClass = false;
        } else {
            button.classList.add("disabled");
            addDisabledTooltipClass = true;
        }
    }
}

function tooltipPosition(e, button) {
    if (sortInProgress) {
        button.style.setProperty("--top", e.clientY + "px");
        button.style.setProperty("--left", e.clientX + "px");
    }
}

function changeSortOfSorts(sortBy, currentTitle) {
    let order = 1;
    if (currentSortOfSorts && currentSortOfSorts[0] == sortBy[0]) {
        if (currentSortOfSorts[1] == "u") {
            currentSortOfSorts = currentSortOfSorts[0] + "d";
            order = -1;
        } else {
            currentSortOfSorts = currentSortOfSorts[0] + "u";
        }
    } else {
        currentSortOfSorts = sortBy[0] + "u";
    }
    sorts.sort((a, b) => {
        let valueA = a[sortBy];
        let valueB = b[sortBy];
        if (sortBy == "name") {
            valueA = valueA.toUpperCase();
            valueB = valueB.toUpperCase();
        }
        if (valueA < valueB) {
            return order * -1;
        }
        if (valueA > valueB) {
            return order;
        }
        return 0;
    });
    showSorts();
    if (currentTitle) {
        let sortOptions = document.querySelectorAll(".title");

        for (const sort of sortOptions) {
            sort.classList.remove("up");
            sort.classList.remove("down");
        }

        if (currentSortOfSorts[1] == "u") {
            currentTitle.classList.add("up");
        } else {
            currentTitle.classList.add("down");
        }
    }
}

//creates a search for the algorithms
let search = document.querySelector("#tSearch");
search.onkeyup = keyup;
function keyup(e) {
    showSorts(e.target.value.toLowerCase());
}

function cleared(e) {
    showSorts(e.value.toLowerCase());
}

function showSorts(searchValue) {
    let tableBody = document.querySelector(".table-body");
    tableBody.innerHTML = "";
    for (const sort of sorts) {
        if (!searchValue || sort.name.toLowerCase().includes(searchValue)) {
            const div = document.createElement("div");
            tableBody.appendChild(div);
            div.classList.add("row");
            if (sort.selected) {
                div.classList.add("selected-row");
            }
            div.innerHTML = sort.HTML;
            div.onclick = function () {
                updateSelected(this);
            };
        }
    }
}

function startSort() {
    if (!sortInProgress) {
        sortInProgress = true;
        toggleButtons(false);
        window[sorts.find((o) => o.selected === true).function]("start");
    }
}

function updateVisual() {
    for (let i = 1; i <= arr.length; i++) {
        const div = document.querySelector(".d" + i);
        div.style.order = barTracker.indexOf(i);
        div.classList.remove("compare");
        div.classList.remove("green");
    }
}

function algorithmFinish() {
    setTimeout(() => {
        sortInProgress = false;
        toggleButtons(true);
        for (let i = 0; i < arr.length; i++) {
            setTimeout(() => {
                playSound("sine", 320 + 10 * arr[i], 0.01);
                let bar = barTracker[i];
                const div = document.querySelector(".d" + bar);
                div.classList.add("green");
            }, 2 * i);
        }
    }, 300);
}

function visualAndAudio(red, green) {
    if (red) {
        let frequency = 0;
        for (const classNumber of red) {
            let bar = document.querySelector(".d" + classNumber);
            if (bar) {
                bar.classList.add("compare");
                frequency += classNumber;
            }
        }
        frequency *= 10 / red.length;
        playSound("triangle", 300 + frequency, 0.01);
    }
    if (green) {
        for (const classNumber of green) {
            let bar = document.querySelector(".d" + classNumber);
            bar.classList.add("green");
        }
    }
}

function swap(i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    temp = barTracker[i];
    barTracker[i] = barTracker[j];
    barTracker[j] = temp;
}

function bubbleSort(i, j) {
    if (i == "start") {
        i = 0;
        j = 0;
    }
    if (i < arr.length) {
        visualAndAudio([barTracker[j], barTracker[j + 1]]);
        setTimeout(() => {
            if (arr[j] > arr[j + 1]) {
                swap(j, j + 1);
            }
            updateVisual();
            if (j < arr.length - i - 2) {
                j++;
                bubbleSort(i, j);
            } else {
                i++;
                bubbleSort(i, 0);
            }
        }, 1);
    } else {
        algorithmFinish();
        return;
    }
}

function insertionSort(i, j) {
    if (i == "start") {
        i = 1;
        j = 1;
    }
    if (i < arr.length) {
        visualAndAudio([barTracker[j], barTracker[j - 1]], [barTracker[i]]);
        setTimeout(() => {
            if (arr[j] < arr[j - 1]) {
                swap(j, j - 1);
            }
            updateVisual();
            if (j > 1) {
                j--;
                insertionSort(i, j);
            } else {
                i++;
                insertionSort(i, i);
            }
        }, 1);
    } else {
        algorithmFinish();
    }
}

function gnomeSort(pos) {
    if (pos == "start") {
        pos = 1;
    }
    if (pos < arr.length) {
        visualAndAudio([barTracker[pos], barTracker[pos - 1]]);
        setTimeout(() => {
            if (pos < 1 || arr[pos] >= arr[pos - 1]) {
                updateVisual();
                gnomeSort(pos + 1);
            } else {
                swap(pos, pos - 1);
                updateVisual();
                gnomeSort(pos - 1);
            }
        }, 1);
    } else {
        algorithmFinish();
    }
}

function selectionSort(i, j, min) {
    if (i == "start") {
        i = 0;
        j = 1;
        min = 0;
    }
    if (i < arr.length - 1) {
        visualAndAudio([barTracker[min], barTracker[j]], [barTracker[i]]);
        setTimeout(() => {
            if (j < arr.length) {
                if (arr[j] < arr[min]) {
                    updateVisual();
                    selectionSort(i, j + 1, j);
                } else {
                    updateVisual();
                    selectionSort(i, j + 1, min);
                }
            } else {
                if (min != i) {
                    swap(i, min);
                    updateVisual();
                }
                i++;
                selectionSort(i, i + 1, i);
            }
        }, 1);
    } else {
        algorithmFinish();
    }
}

//could optimize with min and max rather than i limits
function cocktailShakerSort(i, direction, min, max, newMin, newMax) {
    if (i == "start") {
        i = 0;
        direction = 1;
        min = 1;
        max = arr.length - 2;
        newMin = max;
        newMax = min;
    }
    if (min < max) {
        visualAndAudio(
            [barTracker[i], barTracker[i + direction]],
            [barTracker[min], barTracker[max]]
        );
        if (direction > 0) {
            setTimeout(() => {
                if (arr[i] > arr[i + 1]) {
                    swap(i, i + 1);
                    newMax = i;
                }
                updateVisual();
                if (i < max) {
                    i++;
                    cocktailShakerSort(i, direction, min, max, newMin, newMax);
                } else {
                    cocktailShakerSort(newMax, -1, min, newMax, newMax, newMax);
                }
            }, 1);
        } else {
            setTimeout(() => {
                if (arr[i] < arr[i - 1]) {
                    swap(i, i - 1);
                    newMin = i;
                }
                updateVisual();
                if (i > min) {
                    i--;
                    cocktailShakerSort(i, direction, min, max, newMin, newMax);
                } else {
                    cocktailShakerSort(newMin, 1, newMin, max, newMin, newMin);
                }
            }, 1);
        }
    } else {
        algorithmFinish();
    }
}

function shellsort(i, j, gapIndex, gap) {
    if (i == "start") {
        gapIndex = 0;
        gap = 701;
        i = gap;
        j = i;
    }
    if (gapIndex < shellsortGaps.length) {
        if (i < arr.length && gap < arr.length / 2) {
            visualAndAudio([barTracker[j], barTracker[j - gap]]);
            setTimeout(() => {
                if (arr[j] < arr[j - gap]) {
                    swap(j, j - gap);
                    updateVisual();
                    if (j >= 2 * gap) {
                        j -= gap;
                        shellsort(i, j, gapIndex, gap);
                        return;
                    }
                }
                updateVisual();
                i++;
                shellsort(i, i, gapIndex, gap);
            }, 1);
        } else {
            gapIndex++;
            shellsort(
                shellsortGaps[gapIndex],
                shellsortGaps[gapIndex],
                gapIndex,
                shellsortGaps[gapIndex]
            );
        }
    } else {
        algorithmFinish();
    }
}

function countingSort(i, stage, count, arrReference, barReference) {
    if (i == "start") {
        i = 0;
        stage = 1;
        count = new Array(arr.length + 1).fill(0);
        arrReference = JSON.parse(JSON.stringify(arr));
        barReference = JSON.parse(JSON.stringify(barTracker));
    }
    setTimeout(() => {
        updateVisual();
        if (stage == 1) {
            visualAndAudio([barTracker[i]]);
            if (i < arr.length) {
                j = arr[i];
                count[j] = count[j] + 1;
                countingSort(i + 1, stage, count, arrReference, barReference);
            } else {
                countingSort(1, 2, count, arrReference, barReference);
            }
        } else if (stage == 2) {
            if (i <= arr.length) {
                count[i] = count[i] + count[i - 1];
                countingSort(i + 1, stage, count, arrReference, barReference);
            } else {
                countingSort(
                    arr.length - 1,
                    3,
                    count,
                    arrReference,
                    barReference
                );
            }
        } else {
            if (i >= 0) {
                j = arrReference[i];
                count[j] = count[j] - 1;
                visualAndAudio([barTracker[count[j]], barTracker[i]]);
                arr[count[j]] = arrReference[i];
                barTracker[count[j]] = barReference[i];
                countingSort(i - 1, stage, count, arrReference, barReference);
            } else {
                algorithmFinish();
            }
        }
    }, 1);
}

function combSort(i, gap, checksSinceLastSwap, reduceGap) {
    if (i == "start") {
        i = 0;
        gap = arr.length;
        checksSinceLastSwap = 0;
        reduceGap = true;
        j = arr.length + 1;
    }
    if (checksSinceLastSwap < arr.length) {
        if (reduceGap) {
            gap = Math.floor(gap / 1.3);
            if (gap <= 1) {
                gap = 1;
            } else if (gap == 9 || gap == 10) {
                gap = 11;
            }
        }
        visualAndAudio([barTracker[i], barTracker[i + gap]]);
        setTimeout(() => {
            if (arr[i] > arr[i + gap]) {
                swap(i, i + gap);
                checksSinceLastSwap = 0;
            }
            updateVisual();
            if (i + gap < arr.length) {
                i++;
                combSort(i, gap, checksSinceLastSwap + 1, false);
            } else {
                combSort(0, gap, 2, true);
            }
        }, 1);
    } else {
        algorithmFinish();
        return;
    }
}

async function quicksort(a, b, i, j, p) {
    if (a === "start") {
        await quicksort(0, arr.length - 1, "partition");
        algorithmFinish();
        return;
    }
    updateVisual();
    if (a >= b) {
        return true;
    }
    if (i === "partition") {
        p = a;
        i = a + 1;
        j = b;
    }
    visualAndAudio([barTracker[i], barTracker[j]], [barTracker[p]]);
    await new Promise((resolve) => setTimeout(resolve, 1));

    if (i <= j) {
        if (arr[i] >= arr[p] && arr[j] <= arr[p]) {
            swap(i, j);
            updateVisual();
            //for more efficiency should make the p something else in the middle
            await quicksort(a, b, i + 1, j - 1, p);
        } else {
            if (arr[i] < arr[p]) {
                i++;
            }
            if (arr[j] > arr[p]) {
                j--;
            }
            await quicksort(a, b, i, j, p);
        }
    } else {
        if (p !== j) {
            swap(p, j);
            updateVisual();
            visualAndAudio([barTracker[i], barTracker[p]], [barTracker[j]]);
        }
        await quicksort(a, j - 1, "partition");
        await quicksort(j + 1, b, "partition");
    }
}

async function mergeSort(a, b, mid, left, right, j, ins) {
    if (a == "start") {
        await mergeSort(0, arr.length - 1, "split");
        algorithmFinish();
        return;
    }
    if (a >= b) {
        return arr.slice(a, a + 1);
    }
    if (mid == "split") {
        mid = Math.floor((a + b) / 2);
        left = await mergeSort(a, mid, "split");
        right = await mergeSort(mid + 1, b, "split");
        j = mid + 1;
        ins = a;
    }
    visualAndAudio(
        [barTracker[ins + 1], barTracker[j]],
        [barTracker[a], barTracker[b]]
    );
    await new Promise((resolve) => setTimeout(resolve, 1));
    if (right.length > 0) {
        if (left[0] <= right[0]) {
            left.shift();
            return mergeSort(a, b, mid, left, right, j, ins + 1);
        } else {
            right.shift();
            let temp = arr.splice(j, 1)[0];
            let barTemp = barTracker.splice(j, 1)[0];
            arr.splice(ins, 0, temp);
            barTracker.splice(ins, 0, barTemp);
            updateVisual();
            return mergeSort(a, b, mid, left, right, j + 1, ins + 1);
        }
    } else {
        updateVisual();
        return arr.slice(a, b + 1);
    }
}

function heapsort(start, end, root) {
    if (start == "start") {
        start = Math.floor(arr.length / 2);
        end = arr.length;
        root = "next";
    }
    setTimeout(() => {
        updateVisual();
        if (end > 1) {
            if (root == "next") {
                visualAndAudio(false, [barTracker[start], barTracker[end - 1]]);
                if (start > 0) {
                    start--;
                } else {
                    end--;
                    swap(end, 0);
                    updateVisual();
                }
                heapsort(start, end, start);
            } else {
                if (2 * root + 1 < end) {
                    let child = 2 * root + 1;
                    visualAndAudio(
                        [barTracker[root], barTracker[child]],
                        [barTracker[start], barTracker[end - 1]]
                    );
                    if (child + 1 < end && arr[child] < arr[child + 1]) {
                        child++;
                    }
                    if (arr[root] < arr[child]) {
                        swap(root, child);
                        heapsort(start, end, child);
                    } else {
                        heapsort(start, end, "next");
                    }
                } else {
                    heapsort(start, end, "next");
                }
            }
        } else {
            algorithmFinish();
        }
    }, 1);
}

function bucketSort(stage, buckets, a, i, j) {
    let k = 20;
    let M = arr.length + 1;
    if (stage == "start") {
        buckets = new Array(k);
        for (let i = 0; i < k; i++) {
            buckets[i] = [];
        }
        stage = "buckets";
        i = 0;
    }
    setTimeout(() => {
        updateVisual();
        if (stage == "buckets") {
            if (i < arr.length) {
                buckets[Math.floor((k * arr[i]) / M)].push([arr[i], barTracker[i]]);
                visualAndAudio([barTracker[i]]);
                bucketVisualization(buckets);
                bucketSort(stage, buckets, 0, i + 1, 0);
            } else {
                bucketSort("sortBuckets", buckets, 0, 1, 1);
            }
        } else {
            if (a < k) {
                let tempArr = buckets[a];
                if (tempArr.length > 1) {
                    if (tempArr[j - 1][0] > tempArr[j][0]) {
                        visualAndAudio([tempArr[j][1], tempArr[j - 1][1]]);
                        let temp = tempArr[j - 1];
                        tempArr[j - 1] = tempArr[j];
                        tempArr[j] = temp;
                    }
                    bucketVisualization(buckets);
                    if (j - 1 > 0) {
                        bucketSort("sortBuckets", buckets, a, i, j - 1);
                    } else {
                        if (i + 1 < tempArr.length) {
                            bucketSort("sortBuckets", buckets, a, i + 1, i + 1);
                        } else {
                            bucketSort("sortBuckets", buckets, a + 1, 1, 1);
                        }
                    }
                } else {
                    bucketSort("sortBuckets", buckets, a + 1, 1, 1);
                }
            } else {
                algorithmFinish();
            }
        }
    }, 1);
}

function bucketVisualization(buckets) {
    let total = 0;
    for (let tempArr of buckets) {
        for (let i = 0; i < tempArr.length; i++) {
            arr[total] = tempArr[i][0];
            barTracker[total] = tempArr[i][1];
            total++;
        }
    }
}

function radixSort(buckets, i, j) {
    let k = 10;
    if (buckets == "start") {
        buckets = new Array(k);
        for (let i = 0; i < k; i++) {
            buckets[i] = [];
        }
        i = 0;
        j = 0;
    }
    setTimeout(() => {
        updateVisual();
        if (j < 3) {
            if (i < arr.length) {
                let height = arr[i].toString();
                let digit = height.length - 1 - j
                let f = height[digit]
                if(!f){
                    f = 0;
                }
                buckets[f].push([arr[i], barTracker[i]]);
                visualAndAudio([barTracker[i]]);
                bucketVisualization(buckets);
                radixSort(buckets, i + 1, j);
            } else {
                for (let i = 0; i < k; i++) {
                    buckets[i] = [];
                }
                radixSort(buckets, 0, j + 1);
            }
        } else {
            algorithmFinish();
        }
    }, 1);
}