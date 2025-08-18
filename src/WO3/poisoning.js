export default async function poisonHtml(inputHtml, level) {
    const level3Char = (() => {
        const letters = 'abcegnopqsuvxyz';
        return letters[Math.floor(Math.random() * letters.length)];
    })();

    const parser = new DOMParser();
    const doc = parser.parseFromString(inputHtml, 'text/html');

    // Helper to fetch words
    const fetchWords = async () => {
        try {
            const response = await fetch('/words.txt');
            const wordsText = await response.text();
            return wordsText.split('\n').filter(word => word.trim() !== '');
        } catch (error) {
            console.error('Failed to load words:', error);
            return [];
        }
    };

    // Fetch words once to reuse
    const words = await fetchWords();

    // Cache original paragraphs before any modification
    const originalParagraphs = Array.from(doc.body.querySelectorAll('p'));

    // === LEVEL 3: Insert invisible span characters between words ===
    if (level >= 3) {
        originalParagraphs.forEach(p => {
            const fragment = doc.createDocumentFragment();
            const text = p.textContent;
            const parts = text.split(' ');

            parts.forEach((part, index) => {
                if (index > 0) {
                    const span = doc.createElement('span');
                    span.style.color = '#ffffff';
                    span.textContent = level3Char;
                    span.style.fontSize = '5px';
                    fragment.appendChild(span);
                }
                if (part !== '') {
                    fragment.appendChild(doc.createTextNode(part));
                }
            });

            p.innerHTML = '';
            p.appendChild(fragment);
        });
    }

    // === LEVEL 1: Insert invisible black paragraphs ===
    if (level >= 1 && words.length > 0) {
        const rootParagraphs = Array.from(doc.body.children).filter(
            el => el.tagName === 'P'
        );

        for (let i = 0; i < rootParagraphs.length - 1; i++) {
            const currentP = rootParagraphs[i];
            const nextP = rootParagraphs[i + 1];

            if (currentP.nextElementSibling === nextP) {
                const wordCount = Math.floor(Math.random() * 11) + 20;
                const randomWords = Array.from({ length: wordCount }, () =>
                    words[Math.floor(Math.random() * words.length)]
                );

                const invisibleP = doc.createElement('p');
                invisibleP.style.color = '#000000';
                invisibleP.style.fontSize = '0px';
                invisibleP.textContent = randomWords.join(' ');

                currentP.parentNode.insertBefore(invisibleP, nextP);
            }
        }
    }

    // === LEVEL 2: Insert near-invisible white paragraphs ===
    if (level >= 2 && words.length > 0) {
        const rootParagraphs = Array.from(doc.body.children).filter(
            el => el.tagName === 'P'
        );

        for (let i = 0; i < rootParagraphs.length - 1; i++) {
            const currentP = rootParagraphs[i];
            const nextP = rootParagraphs[i + 1];

            if (currentP.nextElementSibling === nextP) {
                const wordCount = Math.floor(Math.random() * 11) + 20;
                const randomWords = Array.from({ length: wordCount }, () =>
                    words[Math.floor(Math.random() * words.length)]
                );

                const invisibleP = doc.createElement('p');
                invisibleP.style.color = '#ffffff';
                invisibleP.style.fontSize = '1px';
                invisibleP.textContent = randomWords.join(' ');

                currentP.parentNode.insertBefore(invisibleP, nextP);
            }
        }
    }

    return doc.body.innerHTML;
}
