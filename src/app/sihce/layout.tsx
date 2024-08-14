import { Sidebar, TopMenu } from "@/components";
import { TopMenu2 } from "@/components/ui/TopMenu2";

export default  function SihceLayout({
 children
}: {
 children: React.ReactNode;
}) {
  return (
    <>
 
        
    {/* Main Layout content - Contenido principal del Layout */}
 
      
      <TopMenu2 />

      {/* TODO: Contenido en el Layout.tsx */}
      <div className="flex-1 p-4 flex justify-center items-center ">
          {/* Card Container */}
          <div className="h-full w-full">
            {children}
          </div>
        </div>

  </>
  );
}