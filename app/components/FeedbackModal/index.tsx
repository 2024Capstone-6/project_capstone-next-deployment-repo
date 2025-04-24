interface ConfirmExitModalProps {
  onContinue: () => void;
  onExit: () => void;
}

export default function ConfirmExitModal({ onContinue, onExit }: ConfirmExitModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-[400px]">
        <h2 className="text-lg font-bold mb-4 text-gray-800">대화를 종료하시겠어요?</h2>
        <p className="text-sm text-gray-600 mb-6">종료하면 회화 피드백이 제공됩니다.</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
            onClick={onContinue}
          >
            계속하기
          </button>
          <button
            className="px-4 py-2 rounded-md bg-nihonred text-white hover:bg-red-500"
            onClick={onExit}
          >
            종료하기
          </button>
        </div>
      </div>
    </div>
  );
}
