"use client";

import React, { useState } from "react";

interface PrivacyPolicyModalProps {
  privacyPolicy: string;
  onAccept: () => void;
  onDecline: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  privacyPolicy,
  onAccept,
  onDecline,
}) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isScrolledToBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 10;
    if (isScrolledToBottom) {
      setHasScrolled(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-[100] flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-lg border border-[#2E2E2E] max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-[#2E2E2E]">
          <h2 className="text-white text-2xl font-semibold">Gizlilik Politikası</h2>
          <p className="text-gray-400 text-sm mt-2">
            Devam etmek için lütfen gizlilik politikasını okuyun ve kabul edin
          </p>
        </div>
        <div
          className="flex-1 overflow-y-auto p-6 text-gray-300 text-sm md:text-base"
          onScroll={handleScroll}
        >
          <div className="whitespace-pre-line">{privacyPolicy}</div>
        </div>
        <div className="p-6 border-t border-[#2E2E2E] flex gap-4">
          <button
            onClick={onDecline}
            className="flex-1 px-4 py-2 bg-[#2E2E2E] text-white rounded-lg hover:bg-[#3E3E3E] transition"
          >
            Reddet
          </button>
          <button
            onClick={onAccept}
            disabled={!hasScrolled}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-orange-400 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;


