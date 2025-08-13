import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { generate } from './generate';
import { getLinks } from './getLinks';

const AddTextBox = ({ textBoxes, setTextBoxes }) => {
  const [showFunctions, setShowFunctions] = useState(false);
  const [GPTPrompts, setGPTPrompts] = useState([]);
  const [links, setLinks] = useState([]);
  const [textSizes, setTextSizes] = useState([]);
  const [bgColors, setBgColors] = useState([]);
  const [textColors, setTextColors] = useState([]);
  const [loading, setLoading] = useState(false);

  const expandTextBox = () => {
    setShowFunctions(!showFunctions);
  };

  const addTextBox = () => {
    const isDeleted = false;
    const isSelected = false;
    const text = '';
    const textSize = 16;
    const textColor = '#171717';
    const bgColor = '#e1fcdc';

    // Update local state arrays
    setTextSizes([...textSizes, textSize]);
    setTextColors([...textColors, textColor]);
    setBgColors([...bgColors, bgColor]);

    // Update textBoxes state
    setTextBoxes([...textBoxes, [isDeleted, isSelected, text, textSize, textColor, bgColor]]);
    setShowFunctions(true);

    setGPTPrompts([...GPTPrompts, ''])
    setLinks([...links, []])
  };

  const deleteTextBox = (idx) => {
    const newTextBoxesList = [...textBoxes];
    newTextBoxesList[idx] = [true, textBoxes[idx][1], '', 0, '', ''];
    setTextBoxes(newTextBoxesList);
  };

  const generateText = async (idx) => {
    setLoading(true)
    console.log(GPTPrompts[idx])
    const generatedLinks = await getLinks(GPTPrompts[idx])
    const newLinks = [...links]
    newLinks[idx] = generatedLinks
    setLinks(newLinks)

    const generatedText = await generate(GPTPrompts[idx]);
    const newTextBoxesList = [...textBoxes];
    newTextBoxesList[idx] = [false, true, generatedText, textBoxes[idx][3], textBoxes[idx][4], textBoxes[idx][5]];
    setTextBoxes(newTextBoxesList);
    setLoading(false)
  };

  const modifyGPTPrompts = (value, idx) => {
    const newGPTPrompts = [...GPTPrompts];
    newGPTPrompts[idx] = value;
    setGPTPrompts(newGPTPrompts);
  };

  const handleFontSizeChange = (idx, value) => {
    const size = parseInt(value, 10);
    if (!isNaN(size) && size >= 8) {
      const newTextBoxes = [...textBoxes];
      newTextBoxes[idx] = [newTextBoxes[idx][0], newTextBoxes[idx][1], newTextBoxes[idx][2], size, newTextBoxes[idx][4], newTextBoxes[idx][5]];
      setTextBoxes(newTextBoxes);

      setTextSizes(prevSizes => {
        const newSizes = [...prevSizes];
        newSizes[idx] = size;
        return newSizes;
      });
    }
  };

  const handleTextColorChange = (idx, color) => {
    const newTextBoxes = [...textBoxes];
    newTextBoxes[idx] = [newTextBoxes[idx][0], newTextBoxes[idx][1], newTextBoxes[idx][2], newTextBoxes[idx][3], color, newTextBoxes[idx][5]];
    setTextBoxes(newTextBoxes);

    setTextColors(prevColors => {
      const newColors = [...prevColors];
      newColors[idx] = color;
      return newColors;
    });
  };

  const handleBgColorChange = (idx, color) => {
    const newTextBoxes = [...textBoxes];
    newTextBoxes[idx] = [newTextBoxes[idx][0], newTextBoxes[idx][1], newTextBoxes[idx][2], newTextBoxes[idx][3], newTextBoxes[idx][4], color];
    setTextBoxes(newTextBoxes);

    setBgColors(prevColors => {
      const newColors = [...prevColors];
      newColors[idx] = color;
      return newColors;
    });
  };

  return (
    <div className="bg-white w-full text-center flex flex-col items-center">
      {loading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 opacity-75 z-50"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f4f6',
            opacity: 0.75,
          }}
        >
          <div 
            style={{
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #4b5563',
              borderRadius: '50%',
              width: '3rem',
              height: '3rem',
              animation: 'spin 1s linear infinite',
            }}
          ></div>
        </div>
      )}
      <div className="w-full max-w-4xl bg-blue-200 p-14 border-b-gray-300 border-b-4">
        <div className="flex w-full items-center justify-center px-4 py-2">
          <button onClick={expandTextBox}>
            <FontAwesomeIcon icon={showFunctions ? faChevronUp : faChevronDown} size="1x" className="text-gray-600" />
          </button>
          <button onClick={addTextBox} className="font-bold bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-md shadow-md mx-4">
            Add Text Box
          </button>
        </div>
      </div>
      <div className="w-full max-w-4xl p-0">
        {showFunctions &&
          <div className="space-y-4">
            {textBoxes.map((attributes, index) => (
              <div key={index} className="border rounded-md bg-gray-50 shadow-md px-4">
                {!attributes[0] &&
                  <>
                    {textBoxes[index][1] ?
                      <div className="space-y-4">
                        <div className="flex flex-col space-y-4">
                          <input
                            type="text"
                            id="prompt"
                            name="prompt"
                            className="border rounded-md p-2 mt-2 bg-gray-200 focus:bg-gray-300 focus:outline-none"
                            placeholder="Enter prompt to generate text"
                            required
                            value={GPTPrompts[index]}
                            onChange={(e) => modifyGPTPrompts(e.target.value, index)}
                          />
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                value={textSizes[index]}
                                onChange={(e) => handleFontSizeChange(index, e.target.value)}
                                min="8"
                                className="border rounded-md px-2 py-1 text-center w-20"
                              />
                              <span>px</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="color"
                                value={bgColors[index]}
                                onChange={(e) => handleBgColorChange(index, e.target.value)}
                                className="w-8 h-8 p-0 border-none"
                              />
                              <span>Background</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="color"
                                value={textColors[index]}
                                onChange={(e) => handleTextColorChange(index, e.target.value)}
                                className="w-8 h-8 p-0 border-none"
                              />
                              <span>Text</span>
                            </div>
                            <button
                              className='font-mono font-semibold bg-green-300 px-4 py-2 rounded-md shadow-md hover:bg-green-400'
                              onClick={() => generateText(index)}
                            >
                              Generate
                            </button>
                            <button
                              className="font-mono font-semibold bg-red-100 px-4 py-2 rounded-md shadow-md hover:bg-red-200"
                              onClick={() => deleteTextBox(index)}
                            >
                              Delete Box
                            </button>
                          </div>
                        </div>
                        <div>
                          {(links[index].length > 0 && !attributes[0]) && (
                            <div className="space-y-2">
                              <h3 className="font-semibold text-lg">Links:</h3>
                              <ul className="list-disc pl-5">
                                {links[index].map((link, linkIndex) => (
                                  <li key={linkIndex}>
                                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                      {link}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="p-2" style={{ fontSize: `${textSizes[index]}px`, color: textColors[index], backgroundColor: bgColors[index] }}></div>
                      </div>
                      :
                      <div className="flex justify-center items-center p-4">
                        <div className="text-center">
                          <p className="text-gray-600">Click box to open commands...</p>
                        </div>
                      </div>
                    }
                  </>
                }
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  );
  
};

AddTextBox.propTypes = {
  textBoxes: PropTypes.array.isRequired,
  setTextBoxes: PropTypes.func.isRequired,
};

export default AddTextBox;
