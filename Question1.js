function findLongestSubsequentArray(array) {
    if (array.length === 0) return { length: 0, sequence: [] };

    const n = array.length;
    const dp = new Array(n).fill(1);
    const prev = new Array(n).fill(-1);

    let maxLength = 1; 
    let maxIndex = 0; 

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (array[j] < array[i] && dp[i] < dp[j] + 1) {
                dp[i] = dp[j] + 1;
                prev[i] = j; 
            }
        }

        if (dp[i] > maxLength) {
            maxLength = dp[i];
            maxIndex = i;
        }
    }

    const sequence = [];
    for (let i = maxIndex; i !== -1; i = prev[i]) {
        sequence.push(nums[i]);
    }

    sequence.reverse(); 

    return { length: maxLength, sequence };
}

const array = [10, 9, 2, 5, 3, 7, 101, 18];
const result = findLongestSubsequentArray(array);

console.log("Length of Longest Sub sequent Array:", result.length);
console.log("f Longest Sub sequent Array:", result.sequence);