import PropTypes from 'prop-types';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import OpenAI from 'openai';

const AddImageBox = ({ images, setImages }) => {
  const [showFunctions, setShowFunctions] = useState(false);
  const [imgPrompts, setImgPrompts] = useState([]);
  const [loading, setLoading] = useState(false);

  const expandImageBox = () => {
    setShowFunctions(!showFunctions);
  };

  const addImageBox = () => {
    const isDeleted = false;
    const isSelected = true; // change to false later
    const onCanvas = false;
    setImages([
      ...images,
      [isDeleted, isSelected, [[null, onCanvas], [null, onCanvas], [null, onCanvas], [null, onCanvas], [null, onCanvas], [null, onCanvas]]],
    ]);
    setShowFunctions(true);
    setImgPrompts([...imgPrompts, '']);
  };

  const setCanvasState = (index, subindex) => {
    const newImages = [...images];
    newImages[index][2][subindex][1] = !newImages[index][2][subindex][1];
    setImages(newImages);
  };

  const generateImg = async (idx) => {
    setLoading(true);
    const apiKey = 'VDuzvJ5vyuXWP3mBIR_HznhxpdQPESpdwZjuAJHtf4I'; // Replace with your Unsplash API key
    const numImages = 5; // Number of images to fetch

    let list = [];
    // Search for photos
    try {
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query: imgPrompts[idx],
          per_page: numImages,
          client_id: apiKey,
        },
      });
      list = response.data.results.map((item) => item.urls.regular);
    } catch (error) {
      console.error('Error fetching images from Unsplash:', error);
    }
    // Generate images
    const openai = new OpenAI({
      apiKey: 'sk-proj-PmRZheqLQuB191updPkNT3BlbkFJumzmIZDUSwa3pCanUONv',
      dangerouslyAllowBrowser: true,
    });
    async function generateImage(prompt) {
      try {
        const response = await openai.images.generate({
          prompt: prompt,
          n: 1, // Number of images to generate
          size: '1024x1024', // Size of the generated image
        });

        const imageUrl = response.data[0].url;
        console.log('Generated Image URL:', imageUrl);
        return imageUrl;

      } catch (error) {
        console.error('Error generating image:', error);
      }
    }
    const prompt = `A realistic and visually appealing photo of ${imgPrompts[idx]}`;
    const genImg = await generateImage(prompt);

    const newImages = [...images];
    const onCanvas = false;
    newImages[idx] = [
      images[idx][0],
      images[idx][1],
      [[genImg, onCanvas], ...list.slice(0, numImages).map(url => [url, onCanvas])],
    ];
    setLoading(false);
    setImages(newImages);
  };

  const modifyImgPrompts = (value, idx) => {
    const newImgPrompts = [...imgPrompts];
    newImgPrompts[idx] = value;
    setImgPrompts(newImgPrompts);
  };

  return (
    <div className="bg-white w-full text-center flex flex-col items-center">
      {loading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 opacity-75 z-50"
        >
          <div 
            className="border-4 border-gray-200 border-t-gray-600 rounded-full w-12 h-12 animate-spin"
          ></div>
        </div>
      )}
      <div className="w-full max-w-4xl bg-blue-200 p-14 border-b-gray-300 border-b-8">
        <div className="flex w-full items-center justify-center px-4 py-2">
          <button onClick={expandImageBox}>
            <FontAwesomeIcon icon={showFunctions ? faChevronUp : faChevronDown} size="1x" className="text-gray-600" />
          </button>
          <button onClick={addImageBox} className="font-bold bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-md shadow-md mx-4">
            Add Image Boxes
          </button>
        </div>
      </div>
      {showFunctions && (
        <div className="w-full max-w-4xl overflow-x-auto">
          {images.map((attributes, index) => (
            <div key={index} className="border rounded-md p-4 bg-gray-50 shadow-md mb-4">
              {!attributes[0] && (
                <>
                  {attributes[1] ? (
                    <div>
                      <div className="flex flex-col space-y-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            id="prompt"
                            name="prompt"
                            className="border rounded-md p-2 bg-gray-200 focus:bg-gray-300 flex-1 focus:outline-none"
                            placeholder="Enter prompt to generate image"
                            required
                            value={imgPrompts[index]}
                            onChange={(e) => modifyImgPrompts(e.target.value, index)}
                          />
                          <button
                            className="font-mono font-semibold bg-green-300 px-4 py-2 rounded-md shadow-md hover:bg-green-400"
                            onClick={() => generateImg(index)}
                          >
                            Search
                          </button>
                        </div>
                      </div>
                      <div className="flex overflow-x-auto">
                        {attributes[2].map((contents, subindex) => (
                          <div key={subindex} className="flex-shrink-0 mx-2">
                            <button onClick={() => setCanvasState(index, subindex)}>
                              {contents[0] && (
                                <img
                                  src={contents[0]}
                                  className="max-w-xs h-auto rounded border"
                                />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="border-b-2 p-4 rounded-md">
                      <p className="text-gray-600">No images available</p>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
  

  

AddImageBox.propTypes = {
  images: PropTypes.array.isRequired,
  setImages: PropTypes.func.isRequired,
};

export default AddImageBox;
