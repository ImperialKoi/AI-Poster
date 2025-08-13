import OpenAI from 'openai';

// Initialize OpenAI API
const openai = new OpenAI({
    apiKey: 'sk-proj-PmRZheqLQuB191updPkNT3BlbkFJumzmIZDUSwa3pCanUONv', 
    dangerouslyAllowBrowser: true
});

const removeHtmlTags = (text) => {
    return text.replace(/<\/?[^>]+(>|$)/g, "");
};

const getFirstFourParagraphs = (text) => {
    const paragraphs = text.split('\n\n').slice(0, 4);
    return paragraphs.join('\n\n');
};

const summarizeText = async (text) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // Use the appropriate model
            messages: [
                { role: 'system', content: 'You are a helpful assistant who provides concise summaries.' },
                { role: 'user', content: `Being concise and possible, summarize the following text into a 3 main points: \n\n${text}` }
            ],
            max_tokens: 300,
        });
        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error summarizing text:', error);
        return 'An error occurred while summarizing the text.';
    }
};

export async function generate(topic) {
    try {
        // Search for pages related to the keyword
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(topic)}&origin=*`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (searchData.query && searchData.query.search && searchData.query.search.length > 0) {
            // Get the first search result
            const firstResult = searchData.query.search[0];
            const pageId = firstResult.pageid;

            // Fetch detailed content from the first result
            const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&pageids=${pageId}&origin=*`;
            const contentResponse = await fetch(contentUrl);
            const contentData = await contentResponse.json();

            if (contentData.query && contentData.query.pages) {
                const pages = contentData.query.pages;
                const extract = pages[pageId].extract;

                if (!extract || extract.trim() === "") {
                    return "No summary available for this topic.";
                } else {
                    // Remove HTML tags and extract the first four paragraphs
                    const cleanedText = removeHtmlTags(extract);
                    const firstFourParagraphs = getFirstFourParagraphs(cleanedText);

                    // Summarize the first four paragraphs using OpenAI API
                    const summary = await summarizeText(firstFourParagraphs);
                    return summary;
                }
            } else {
                return "No summary available for this topic.";
            }
        } else {
            return "No search results found.";
        }
    } catch (error) {
        console.error('Error:', error);
        return "An error occurred while fetching or summarizing the content.";
    }
}