import { Outlet } from "react-router";
import { useMemo } from "react";
import AppNavBar from "./AppNavBar";
import AppSideBar from "./AppSidebar";
import { useSidebarStore } from "../Store/sidebarStore";


const AppLayout: React.FC = () => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebarStore();
    const sideBarClasses = useMemo(() => {
        return `flex-1 transition-all duration-300 ease-in-out 
      ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"} 
      ${isMobileOpen ? "ml-0" : ""}`;
    }, [isExpanded, isHovered, isMobileOpen]);


    return (
        <div className="min-h-screen xl:flex">
            <div>
                <AppSideBar />
            </div>
            <div className={sideBarClasses}>
                <AppNavBar />

                <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AppLayout;