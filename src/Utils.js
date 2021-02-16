export const sumBy = (arr, func) => arr.reduce((acc, item) => acc + func(item), 0)

export const range = (start, stop, step = 1) =>
    Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)