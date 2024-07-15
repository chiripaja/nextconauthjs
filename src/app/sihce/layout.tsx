import { Sidebar, TopMenu } from "@/components";

export default function SihceLayout({
 children
}: {
 children: React.ReactNode;
}) {
  return (
    <>
    <Sidebar />
        
    {/* Main Layout content - Contenido principal del Layout */}
    <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%] min-h-screen bg-slate-300 ">
      
      <TopMenu />

      {/* TODO: Contenido en el Layout.tsx */}
      <div className="flex-1 p-4 flex justify-center items-center">
          {/* Card Container */}
          <div className="h-full w-full bg-white shadow-md rounded-lg p-4">
            {children}
          </div>
        </div>
    </div>
  </>
  );
}