'use client'
import { ModalGenerico } from "@/components/ui/ModalGenerico";
import { useState } from "react";


export default function NamePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
    const opcionesDNI = [
        { id: 1, descripcion: "DNI" },
        { id: 2, descripcion: "C.E." },
    ];
    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };
  return (
    <div>
   <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <button
        className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
        onClick={openModal}
      >
        Open Modal
      </button>

      <ModalGenerico isOpen={isModalOpen} onClose={closeModal}>
        <h3 className="text-lg font-semibold text-gray-900">Modal Title</h3>
        <p className="mt-4 text-sm text-gray-600">
          This is the content of the modal. You can place any content here.
        </p>
        <div className="mt-6 flex justify-end">
          <button
            className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </ModalGenerico>
    </div>
    </div>
  );
}