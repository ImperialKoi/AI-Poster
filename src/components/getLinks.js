export async function getLinks(query) {
    const apiKey = 'dea29610-688b-11ef-ba97-dff00c58ed62';
    const MisUrl = `https://app.zenserp.com/api/v2/search?q=${encodeURIComponent(query)}&apikey=${apiKey}`;

    const wikiUrl = `https://app.zenserp.com/api/v2/search?q=${encodeURIComponent(query)}&apikey=${apiKey}`;
    try {
        //extract URL wikipedia
        const response1 = await fetch(wikiUrl);
        const data1 = await response1.json();
        const results1 = data1.organic || [];
        const wikiUrls = results1.slice(0, 1).map(result1 => result1.url);

        //extract URLs of other two search results
        const response = await fetch(MisUrl);
        const data = await response.json();
        const results = data.organic || [];
        const topTwoUrls = results.slice(0, 2).map(result => result.url);

        //concat results
        const finalList = [topTwoUrls[0], topTwoUrls[1], wikiUrls[0]]
        if (topTwoUrls[0] == undefined){
            return ['link1.org', 'link2.com', 'link3.llink3.gov.ca']
        } else{
            return finalList
        }
    } catch (error) {
        console.error('Error fetching search results:', error);
        return ['link1.org', 'link2.com', 'link3.llink3.gov.ca']
    }
}