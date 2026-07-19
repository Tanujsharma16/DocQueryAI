const chunkText = (text, chunkSize = 1000, overlap = 200) => {
    const chunks = [];

    let start = 0;

    while (start < text.length) {
        let end = start + chunkSize;

        let chunk = text.substring(start, end);

        chunks.push({
            content: chunk,
            start,
            end
        });

        start = end - overlap;
    }

    return chunks;
};

module.exports = chunkText;