/**
 * Разбить массив на чанки и выполнить асинхронную функцию для каждого чанка
 * @param {T[]} items
 * @param {number} chunkSize
 * @param {(chunk: T[], chunkIndex: number) => Promise<void>} callback
 */
export async function chunkArrayAsync<T>(
  items: T[],
  chunkSize: number,
  callback: (chunk: T[], chunkIndex: number) => Promise<void>,
): Promise<void> {
  const iterations = Math.ceil(items.length / chunkSize);

  for (let i = 0; i < iterations; i++) {
    const start = i * chunkSize;
    const end = start + chunkSize;
    const chunk = items.slice(start, end);
    await callback(chunk, i);
  }
}
