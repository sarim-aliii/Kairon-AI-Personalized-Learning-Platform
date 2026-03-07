import React, { useRef, useState, useEffect } from 'react';

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return; // Only allow numbers

    const newOtp = [...otp];
    // Allow only last entered character (handles edge case of fast typing)
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Trigger complete if filled
    const combinedOtp = newOtp.join('');
    if (combinedOtp.length === length) onComplete(combinedOtp);

    // Move to next input if value is entered
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleClick = (index: number) => {
    // Optional: Move cursor to end of input on click
    inputRefs.current[index]?.setSelectionRange(1, 1);
    
    // Optional: If previous fields are empty, focus the first empty one
    if (index > 0 && !otp[index - 1]) {
        inputRefs.current[otp.indexOf("")]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      // Move focus to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length).split(''); // Get data and split chars
    
    if (pastedData.every(char => !isNaN(Number(char)))) { // Ensure all are numbers
        const newOtp = [...otp];
        pastedData.forEach((val, i) => {
            newOtp[i] = val;
        });
        setOtp(newOtp);
        
        const combinedOtp = newOtp.join('');
        if (combinedOtp.length === length) onComplete(combinedOtp);
        
        // Focus the last filled input or the next empty one
        const focusIndex = Math.min(pastedData.length, length - 1);
        inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center my-6">
      {otp.map((value, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="text"
          value={value}
          onChange={(e) => handleChange(index, e)}
          onClick={() => handleClick(index)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste} // Global paste handler on any input
          className="w-12 h-14 text-center text-2xl font-bold bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          maxLength={1} // Fallback
        />
      ))}
    </div>
  );
};

export default OtpInput;