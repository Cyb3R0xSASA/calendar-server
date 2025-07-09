export const formatFullDuration = (totalSeconds) => {
    let remaining = Math.max(0, Math.floor(totalSeconds));
    const parts = [];

    const units = [
        { label: 'day', secs: 24 * 3600 },
        { label: 'hour', secs: 3600 },
        { label: 'minute', secs: 60 },
        { label: 'second', secs: 1 },
    ];

    for (const { label, secs } of units) {
        const value = Math.floor(remaining / secs);
        if (value > 0) {
            parts.push(`${value} ${label}${value !== 1 ? 's' : ''}`);
            remaining -= value * secs;
        }
    }

    return parts.length ? parts.join(' ') : '0 seconds';
}
