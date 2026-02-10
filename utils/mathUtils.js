const getFibonacci = (n) => {
    if (n <= 0) return [];
    if (n === 1) return [0];
    let arr = [0, 1];
    for (let i = 2; i < n; i++) {
        arr.push(arr[i - 1] + arr[i - 2]);
    }
    return arr.slice(0, n);
};

const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const lcmTwo = (a, b) => (a === 0 || b === 0 ? 0 : Math.abs(a * b) / gcd(a, b));

module.exports = {
    getFibonacci,
    isPrime,
    gcd,
    lcmTwo
};
