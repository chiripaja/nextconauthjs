import React from "react";

interface CardServiciosProps {
    children: React.ReactNode;
}

export const CardServicios: React.FC<CardServiciosProps> = ({ children }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-5 m-4  h-40 flex items-center justify-center">
            <div className="text-center " >
                <div className="mt-2 text-sm text-gray-500">
                 
                    { children }
                  
                    
                    </div>
            </div>
        </div>
    )
}
