import {useEffect, useState} from 'react';

interface IUseAnimatedTypingProps {
  fullText: string;
  typingSpeed?: number;
  cursorBlinkSpeed?: number;
  visible?: boolean;
}

const useAnimatedTyping = ({
  fullText,
  typingSpeed = 10,
  cursorBlinkSpeed = 500,
  visible = true,
}: IUseAnimatedTypingProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    if (!visible) {
      setDisplayedText('');
      return;
    }

    let charIndex = 0;
    let animationFrame: number;

    const typeText = () => {
      if (charIndex < fullText.length) {
        setDisplayedText(prev => prev + fullText[charIndex]);
        charIndex++;
        animationFrame = setTimeout(typeText, typingSpeed);
      }
    };

    typeText();

    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, cursorBlinkSpeed);

    return () => {
      clearTimeout(animationFrame);
      clearInterval(cursorInterval);
    };
  }, [fullText, typingSpeed, cursorBlinkSpeed, visible]);

  return {displayedText, cursorVisible};
};

export default useAnimatedTyping;
