import {useEffect, useState} from 'react';

interface IUseAnimatedTypingProps {
  fullText: string;
  typingSpeed?: number;
  cursorBlinkSpeed?: number;
  visible?: boolean;
}

const useAnimatedTyping = ({
  fullText,
  typingSpeed = 1,
  cursorBlinkSpeed = 500,
  visible = true,
}: IUseAnimatedTypingProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    if (visible) {
      setDisplayedText('');
      let charIndex = 0;

      const typingInterval = setInterval(() => {
        if (charIndex < fullText.length) {
          setDisplayedText(prev => prev + fullText[charIndex]);
          charIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, typingSpeed);

      const cursorInterval = setInterval(() => {
        setCursorVisible(prev => !prev);
      }, cursorBlinkSpeed);

      return () => {
        clearInterval(typingInterval);
        clearInterval(cursorInterval);
      };
    }
  }, [fullText, typingSpeed, cursorBlinkSpeed]);

  return {displayedText, cursorVisible};
};

export default useAnimatedTyping;
