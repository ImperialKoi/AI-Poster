import AddTextBox from "./components/AddTextBox";
import MovableTextBox from "./components/MovableTextBox";
import AddImageBox from './components/AddImageBox'
import MovableImage from "./components/MovableImage";
import bgimg from './components/bgimg.png'
import { useState, useRef } from 'react'

const App = () => {
  const [textBoxes, setTextBoxes] = useState([])
  const [images, setImages] = useState([])
  const canvasRef = useRef(null)

  //this one for handling selection 
  const handleSetTextBoxes = (index, newState) => {
    setTextBoxes(prevState => {
        // Create a new array where every text box has [1] set to false
        const resetState = prevState.map(item => [item[0], false, item[2], item[3], item[4], item[5]]);

        // Update the specific index with the new state
        resetState[index] = newState;

        return resetState;
    });
  };
  
  return (
    <div className="h-screen bg-gray-200 flex overflow-hidden">
      <div className="flex w-1/2 justify-center items-center">
        <div className="h-5/6 w-11/12 bg-white rounded-lg" ref={canvasRef}>
          {textBoxes.map((attributes, index) => (
            //attribute[0] is isDeleted, attribute[1] is isSelected, attribute[2] is text, [3] is textSize, [4] is textColor, [5] is bgColor
            <div key={index} >
              <MovableTextBox isDeleted={attributes[0]}
                currentlySelected={attributes[1]}
                setSelectState={(newValues) => handleSetTextBoxes(index, newValues)}
                startingText={attributes[2]} textSize={attributes[3]} textColor={attributes[4]}
                bgColor={attributes[5]} startingCanvasRef={canvasRef.current}
              />
            </div>
          ))}
          {images.map((attributes, index) => (
            //[0] is isDeleted, [1] is isSelected, [2] is a list of images
            <div key={index}>
              {!attributes[0] &&
                <div>
                  {attributes[2].map((image, subindex) => (
                    <div key={subindex}>
                      {image[1] &&
                        <>
                          {subindex==3 ? 
                            <MovableImage image={image[0]} inputy={300}/>
                            :
                            <MovableImage image={image[0]}/>
                          }
                        </>
                      }
                    </div>
                  ))}
                </div>
              }
            </div>
          ))}
        </div>
      </div>
      <div className='overflow-y-auto'>
        <AddTextBox textBoxes={textBoxes} setTextBoxes={setTextBoxes} />
        <AddImageBox images={images} setImages={setImages} />
        <div>
          <img src={bgimg} alt="Background" className='opacity-75 h-96' />
        </div>
      </div>
    </div>
  );
};

export default App;