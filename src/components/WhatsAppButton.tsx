import React from 'react';
import { Button } from './ui/button';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = '254743491613'; // Kenyan number with country code
  const message = 'Hello! I would like to inquire about your flower arrangements.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] transition-colors duration-300 shadow-lg"
        aria-label="Chat with us on WhatsApp"
      >
        <MessageCircle className="w-8 h-8 text-white" />
      </a>
      <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 px-3 py-2 rounded-lg shadow-md text-sm whitespace-nowrap hidden md:block">
        Need help? Chat with us!
      </div>
    </div>
  );
};

export default WhatsAppButton;
