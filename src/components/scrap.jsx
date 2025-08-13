const [imageUrls, setImageUrls] = useState([]);
setImageUrls(textBoxes.map(() => []));
setImageUrls([...imageUrls, []]); // Add default empty image URLs
const addImageToCanvas = (idx, url) => {
    const newTextBoxes = [...textBoxes];
    newTextBoxes[idx] = [
      newTextBoxes[idx][0],
      newTextBoxes[idx][1],
      <img src={url} alt="Canvas Image" className="w-auto h-32" />
    ];
    setTextBoxes(newTextBoxes);
  };
const generateText = async (idx) => {
    const generatedText = await generate(GPTPrompts[idx]);
    const newTextBoxesList = [...textBoxes];
    newTextBoxesList[idx] = [false, textBoxes[idx][1], generatedText];
    setTextBoxes(newTextBoxesList);

    const images = await fetchUnsplashImages(GPTPrompts[idx]);
    setImageUrls((prevImageUrls) => {
      const newImageUrls = [...prevImageUrls];
      newImageUrls[idx] = images;
      return newImageUrls;
    });
  };
const fetchUnsplashImages = async (query) => {
    const apiKey = 'VDuzvJ5vyuXWP3mBIR_HznhxpdQPESpdwZjuAJHtf4I'; // Replace with your Unsplash API key
    const numImages = 3; // Number of images to fetch

    try {
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query: query,
          per_page: numImages,
          client_id: apiKey
        }
      });

      return response.data.results.map(item => item.urls.regular);
    } catch (error) {
      console.error('Error fetching images from Unsplash:', error);
      return [];
    }
  };
<div className="w-full mt-2 flex flex-wrap overflow-hidden mr-8 justify-center pb-4">
                        {imageUrls[index] && imageUrls[index].map((url, imgIdx) => (
                          <img
                            key={imgIdx}
                            src={url}
                            alt={Generated Image ${imgIdx + 1}}
                            className="w-auto h-32 mt-2 ml-4 hover:brightness-50"
                            onClick={() => addImageToCanvas(index, url)}
                          />
                        ))}
                      </div>
<button
                          className="font-mono font-semibold bg-red-100 px-9 py-2 ml-4 mt-2 rounded-md shadow-lg hover:bg-red-200"
                          onClick={() => deleteTextBox(index)}
                        >
                          <p>Delete Box</p>
                          <p>{attributes[1]}</p>
                        </button>
                      </div>
                      <div className="w-full mt-2 flex flex-wrap overflow-hidden mr-8 justify-center pb-4">
                        {imageUrls[index] && imageUrls[index].map((url, imgIdx) => (
                          <img
                            key={imgIdx}
                            src={url}
                            alt={Generated Image ${imgIdx + 1}}
                            className="w-auto h-32 mt-2 ml-4 hover:brightness-50"
                            onClick={() => addImageToCanvas(index, url)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>