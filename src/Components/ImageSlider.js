import React, { useRef, useState, useEffect, useCallback }   from 'react'
import SliderImages from './SliderImages';
import throttle from 'lodash.throttle';
import './ImageSlider.css';
import Aux from './HOC/Aux';
import Dots from './Dots';

const timing = (1 / 60) * 1000;
const decay = v => -0.1 * ((1 / timing) ^ 4) + v;

const ImageSlider = (props) => {

  const swipeDataObj = {};
  swipeDataObj.initialClientX = 0;
  swipeDataObj.finalClientX = 0;
  swipeDataObj.initialClientY = 0;
  swipeDataObj.finalClientY = 0;
  const threshold = 10;
  const length = props.slides.length;
  const minDistance = 50;
  const carouselWrapperReference = useRef();

  const [swiped, setSwiped] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [imageCounter, setImageCounter] = useState(1);
  const [clickStartX, setClickStartX] = useState();
  const [scrollStartX, setScrollStartX] = useState();
  const [Dragging, setDragging] = useState(false);
  const [direction, setDirection] = useState(0);
  const [momentum, setMomentum] = useState(0);
  const [lastScrollX, setLastScrollX] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("");

  const handleLastScrollX = useCallback(
    throttle(screenX => {
      setLastScrollX(screenX);
    }, timing),
    []
  );
  const momentumHandler = useCallback(
    throttle(nextMomentum => {
      setMomentum(nextMomentum);
      carouselWrapperReference.current.scrollLeft = carouselWrapperReference.current.scrollLeft + nextMomentum * timing * direction;
    }, timing),
    [scrollWrapperCurrent, direction]
  );
  useEffect(() => {
    if (direction !== 0) {
      if (momentum > 0.1 && !Dragging) {
        momentumHandler(decay(momentum));
      } else if (Dragging) {
        setMomentum(speed);
      } else {
        setDirection(0);
      }
    }
  }, [momentum, Dragging, speed, direction, momentumHandler]);

  const scrollWrapperCurrent = carouselWrapperReference.current;
  useEffect(() => {
    if (carouselWrapperReference.current) {
      const handleDragStart = e => {
        setClickStartX(e.screenX);
        setScrollStartX(carouselWrapperReference.current.scrollLeft);
        setDirection(0);
      };
      const handleDragMove = e => {
        e.preventDefault();
        e.stopPropagation();

        if ((clickStartX !== undefined && scrollStartX !== undefined)) {
          const touchDelta = clickStartX - e.screenX;
          carouselWrapperReference.current.scrollLeft = scrollStartX + touchDelta;
          if (touchDelta > 0) {
            setScrollDirection("right");
          } else {
            setScrollDirection("left");
          }
          if (Math.abs(touchDelta) > 1) {
            setDragging(true);
            setDirection(touchDelta / Math.abs(touchDelta));
            setSpeed(Math.abs((lastScrollX - e.screenX) / timing));
            handleLastScrollX(e.screenX);
          }
        }
      };
      const handleDragEnd = () => {
        if (Dragging && clickStartX !== undefined) {
            if (scrollDirection === "right") {
              setCurrentImage(currentImage === length - 1 ? 0 : currentImage + 1);
              setImageCounter(currentImage === length - 1 ? 1 : currentImage + 2);
            } else {
              setCurrentImage(currentImage === 0 ? length - 1 : currentImage - 1);
              setImageCounter(currentImage === 0 ? length : currentImage);          
            }
          setClickStartX(undefined);
          setScrollStartX(undefined);
          setDragging(false);
          
        }
      };

      if (carouselWrapperReference.current.ontouchstart === undefined) {
        carouselWrapperReference.current.onmousedown = handleDragStart;
        carouselWrapperReference.current.onmousemove = handleDragMove;
        carouselWrapperReference.current.onmouseup = handleDragEnd;
        carouselWrapperReference.current.onmouseleave = handleDragEnd;
      }
    }
  }, [scrollWrapperCurrent, clickStartX, Dragging, scrollStartX, handleLastScrollX, lastScrollX]);

  if (!Array.isArray(props.slides) || props.slides.length <= 0) {
    return null;
  }

  const dotClickHandler = (e) => {
    const dotAssosiatedImageId = +e.target.id;
    setCurrentImage(dotAssosiatedImageId);
    setImageCounter(dotAssosiatedImageId+1);
  }

  const _onTouchStart = (e) => {
    const touch = e.touches[0];
    swipeDataObj.initialClientX = touch.clientX;
    swipeDataObj.initialClientY = touch.clientY;
  }

  const _onTouchMove = (e) => {
     const touch = e.touches[0];
    swipeDataObj.finalClientX = touch.clientX;
    swipeDataObj.finalClientY = touch.clientY;
  }

  const _onTouchEnd = (e) => {
   
    if ((swipeDataObj.finalClientX > swipeDataObj.initialClientX)) {
      setCurrentImage(currentImage === 0 ? length - 1 : currentImage - 1);
      setImageCounter(currentImage === 0 ? length : currentImage);
    } else {  
      setCurrentImage(currentImage === length - 1 ? 0 : currentImage + 1);
      setImageCounter(currentImage === length - 1 ? 1 : currentImage + 2);
    }
  }

  return (
    <Aux>
      <div className="slider">
      <div className="scroll-wrapper" >
        <div className="scroll-container" ref={carouselWrapperReference} 
          onTouchStart={_onTouchStart}
          onTouchMove={_onTouchMove}
          onTouchEnd={_onTouchEnd}>
        {SliderImages.map((slide, index) => {
            return (
            
                <div className={index === currentImage ? 'slide active' : 'slide'} key={index} >
                  {index === currentImage && (
                    <img src={slide.image} alt='Scandiweb_carousel_project' className='img' 
                    />   
                  
                  )}
                </div>
              
            );
            
          })}
        </div>
      </div>
    </div>
    <div className="image-count">
      <p>{imageCounter}/{length}</p>
    </div>
    <div className="dots-container">
      {SliderImages.map((slide, index) => {
        return (
            <Dots key={index} active={index === currentImage} dotId={index} clicked={dotClickHandler} />
        );
      })}
    </div>
  </Aux>
  );
  
}

export default ImageSlider;
