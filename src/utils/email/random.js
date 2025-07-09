const lower = 'abcdefghijklmnopqrstuvwxyz';
const number = '1234567890';
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const randomOTPGenerator = (patternLength=6, types=['n']) => {
    const main = () => {
        let pattern = [];
        if (types.length === 1) return (types[0].repeat(patternLength));
        const maxPerChar = Math.ceil(patternLength / types.length);
        const maxRepeats = 2;
        let attempts = 0;
        const maxAttempts = 1000;
        while (pattern.length < patternLength && attempts < maxAttempts) {
            attempts++;
            const r = Math.floor(Math.random() * types.length);
            const choice = types[r];
            const count = pattern.filter(x => x === choice).length;
            if (count >= maxPerChar) continue;
            const repeatCount = pattern.slice(-maxRepeats).filter(x => x === choice).length;
            if (repeatCount === maxRepeats) continue;
            pattern.push(choice);
        }
        return pattern;
    }
    let pattern = main();
    while (pattern.length < patternLength) {
        pattern = main()
    }
    const pass = []
    for (const pa of pattern) {
        if (pa === 'n') {
            pass.push(number[randomInt(0, 9)])
        }
        if (pa === 'l') {
            pass.push(lower[randomInt(0, 25)])
        }
    };

    return pass.join('')
}