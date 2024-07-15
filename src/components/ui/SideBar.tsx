
import Image from 'next/image';
import Link from 'next/link';
import { SidebarItem } from './SidebarItem';
import { IoCalendarOutline, IoCheckboxOutline, IoListOutline } from 'react-icons/io5';
import { LogoutBtn } from '../LogoutBtn';
import { Profile } from './Profile';

const menuItems = [
  {
    icon: <IoCalendarOutline />,
    title: 'Admision',
    path: '/sihce/admision'
  },
  {
    icon: <IoCheckboxOutline />,
    title: 'Triaje',
    path: '/sihce/triaje'
  },
]


export const Sidebar =async () => {


  return (
    <aside className="ml-[-100%] fixed z-10 top-0 pb-3 px-6 w-full flex flex-col justify-between h-screen border-r bg-white transition duration-300 md:w-4/12 lg:ml-0 lg:w-[25%] xl:w-[20%] 2xl:w-[15%]">
      <div>
        <div className="-mx-6 px-6 py-4">
     
          {/* TODO: Next/Link hacia dashboard */}
          <Link href="#" title="home">
            {/* Next/Image */}
            <Image src="https://tailus.io/sources/blocks/stats-cards/preview/images/logo.svg" 
              className="w-32" 
              alt="tailus logo" 
              width={150}
              height={150}
            />
          
          </Link>
        </div>

        <div className="mt-8 text-center">
         
          <Image 
            src="https://tailus.io/sources/blocks/stats-cards/preview/images/second_user.webp" 
            width={150}
            height={150}
            alt="" 
            className="w-10 h-10 m-auto rounded-full object-cover lg:w-28 lg:h-28" 
          />
               <Profile/>
       
        </div>

        <ul className="space-y-2 tracking-wide mt-8">
          {
            menuItems.map( item => (
              <SidebarItem key={ item.path } {...item} />
            ))
          }
          
        </ul>
      </div>

      <div className="px-6 -mx-6 pt-4 flex justify-between items-center border-t">
        <LogoutBtn/>
      </div>
    </aside>
  )
}