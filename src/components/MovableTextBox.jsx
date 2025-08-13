import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const MovableTextBox = ({ isDeleted, setSelectState, startingText, textSize, textColor, bgColor, startingCanvasRef}) => {
    const [isTyping, setIsTyping] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [text, setText] = useState(startingText);
    const [position, setPosition] = useState({ x: 45, y: 90 });
    const [dimensions, setDimensions] = useState({ width: 300, height: 'auto' });
    const startOffset = useRef({ x: 0, y: 0 });
    const startSize = useRef({ width: 0, height: 0 });
    const boxRef = useRef(null);
    const textRef = useRef(null);
    const canvasRef = useRef(startingCanvasRef)

    // Minimum and maximum dimensions for resizing
    const minSize = { width: 50, height: 50 };
    const maxSize = { width: 636, height: 614 };

    useEffect(() => {
        setText(startingText);
    }, [startingText]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging) {
                const newX = e.clientX - startOffset.current.x;
                const newY = e.clientY - startOffset.current.y;
        
                // Boundary limits for movement
                const boundary = {
                    left: 29,
                    top: 62,
                    right: 665 - boxRef.current.offsetWidth,
                    bottom: 675 - boxRef.current.offsetHeight
                };
        
                // Restrict movement within boundary
                const boundedX = Math.max(boundary.left, Math.min(newX, boundary.right));
                const boundedY = Math.max(boundary.top, Math.min(newY, boundary.bottom));
        
                setPosition({ x: boundedX, y: boundedY });
        
            } else if (isResizing) {
                const boxRect = boxRef.current.getBoundingClientRect();
                const newWidth = Math.max(
                    Math.min(e.clientX - boxRect.left, maxSize.width),
                    minSize.width
                );
                const newHeight = Math.max(
                    Math.min(e.clientY - boxRect.top, maxSize.height),
                    minSize.height
                );
        
                setDimensions({ width: newWidth, height: newHeight });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
        };

        const handleClickOutside = (e) => {
            if (boxRef.current && !boxRef.current.contains(e.target) && canvasRef.current.contains(e.target)) {
                const isSelected = false;
                setSelectState([isDeleted, isSelected, text, textSize, textColor, bgColor]);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousedown', handleClickOutside);
        };

    }, [isDragging, isResizing, isDeleted, setSelectState]);

    const handleMouseDown = (e) => {
        if (e.target.classList.contains('resize-handle')) {
            setIsTyping(false);
            setIsResizing(true);
            startSize.current = {
                width: boxRef.current.offsetWidth,
                height: boxRef.current.offsetHeight,
            };
        } else if (e.target.tagName === 'SPAN') {
            e.stopPropagation();
            setIsTyping(true);
        } else {
            setIsTyping(false);
            setIsDragging(true);
            startOffset.current = {
                x: e.clientX - position.x,
                y: e.clientY - position.y
            };
        }
        const isSelected = true;
        setSelectState([isDeleted, isSelected, text, textSize, textColor, bgColor]);
        moveCursor()
        e.preventDefault();
    };

    useEffect(() => {
        if (textRef.current) {
            textRef.current.focus();
        }
        setIsTyping(false);
    }, [isTyping]);

    const handleInput = (e) => {
        // Get the current selection
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        
        // Update the text
        let newText = e.target.innerText;
        setText(newText);
        
        // Save the current cursor position
        const cursorPosition = {
            node: range.startContainer,
            offset: range.startOffset
        };
        
        // If resizing is needed
        if (textRef.current && boxRef.current) {
            // Dynamically resize the text box based on content
            const scrollHeight = textRef.current.scrollHeight;
            if (scrollHeight + 30 > boxRef.current.offsetHeight) {
                setDimensions(prev => ({ ...prev, height: scrollHeight + 30 }));
            }
        }
        
        // Restore the cursor position after the update
        setTimeout(() => {
            if (textRef.current) {
                const newRange = document.createRange();
                newRange.setStart(cursorPosition.node, cursorPosition.offset);
                newRange.collapse(true);
                selection.removeAllRanges();
                selection.addRange(newRange);
            }
        }, 0); // Delay to ensure the text update is completed
    };

    const handleKeyDown = (event) => {
        console.log(event.key)
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default behavior
            const enteredText = `${text}\n`
            setText(enteredText)
            moveCursor(event)
        }
    };

    const moveCursor = (e) => {
        const selection = window.getSelection();
        const range = document.createRange();
        const p = e.target;

        range.selectNodeContents(p);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    };

    if (isDeleted) return null;

    return (
        <div
            ref={boxRef}
            className={'absolute p-3 text-gray-950 flex items-center justify-center cursor-pointer rounded-md z-10 border-dashed border-2 border-transparent hover:border-gray-400 active:border-gray-400'}
            style={{ left: `${position.x}px`, top: `${position.y}px`, width: `${dimensions.width}px`, height: dimensions.height, background: bgColor }}
            onMouseDown={handleMouseDown}
        >
            <span
                ref={textRef}
                className="w-full h-full mx-2 border-2 border-transparent rounded-s-sm focus:outline-none hover:border-gray-100 focus:border-gray-100 cursor-text whitespace-pre-line"
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                style={{fontSize: textSize, color: textColor}}
            >
                {text}
            </span>
            <div className="resize-handle absolute bottom-0 right-0 w-3 h-3 cursor-se-resize border-b-4 border-b-transparent border-r-4 border-r-transparent
            hover:border-b-gray-400 active:border-b-gray-400 rounded-br-md hover:border-r-gray-400 active:border-r-gray-400"></div>
        </div>
    );
};

MovableTextBox.propTypes = {
    isDeleted: PropTypes.bool.isRequired,
    setSelectState: PropTypes.func.isRequired,
    startingText: PropTypes.string.isRequired,
    textSize: PropTypes.number.isRequired,
    textColor: PropTypes.number.isRequired,
    bgColor: PropTypes.string.isRequired,
    startingCanvasRef: PropTypes.object.isRequired,
};

export default MovableTextBox;
