import React, { useEffect, useCallback, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import IconLucide from "../Icon/IconLucide";
import { useSidebarStore } from "../Store/sidebarStore";
import LogoIcon from "../Logo/Logo";





type SubItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
  pro?: boolean;
  new?: boolean;
};

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: SubItem[];
};

const navItems: NavItem[] = [



  {
    icon: <IconLucide name="folder" size={24} strokeWidth={1} />,
    name: "Formulario",
    path: "/formulario",
    // subItems: [
    //   {
    //     name: "Formatos",
    //     icon: <IconLucide name="form" size={24} strokeWidth={1} />,
    //   },
    //   {
    //     name: "Equipos",
    //     path: "/formulario/equipos",
    //     icon: <IconLucide name="form" size={24} strokeWidth={1} />,
    //   },
    // ],
  },
  {
    name: "Equipo",
    icon: <IconLucide name="folder" size={24} strokeWidth={1} />,
    path: "/equipo",
    // subItems: [
    //   {
    //     name: "Equipos",
    //     icon: <IconLucide name="folder" size={24} strokeWidth={1} />,
    //   },
      // {
      //   name: "Formatos",
      //   path: "/formatos",
      //   icon: <IconLucide name="folder" size={24} strokeWidth={1} />,
      // },
    // ],
  },
];

const othersItems: NavItem[] = [];

const AppSideBar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebarStore();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);

  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );

  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) =>
    location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  //Menus desplegables
  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`flex items-center px-3 py-2 rounded-lg w-full text-left 
                ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? " active [&.active]:bg-blue-200"
                  : "inactive text-gray-600 dark:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span className="flex-shrink-0">{nav.icon}</span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="truncate ml-3">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <IconLucide name="chevronRight" size={24} strokeWidth={1}
                  className={`ml-auto w-5 h-5 transition-transform duration-200 
                    ${openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "rotate-90 text-brand-500 text-blue-700"
                      : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full
                ${isActive(nav.path) ? "bg-blue-200 dark:bg-gray-800 text-brand-500" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
              >
                <span className="flex-shrink-0">{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="truncate">{nav.name}</span>
                )}
              </Link>
            )
          )}

          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 mb-2 space-y-1 ml-2">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all ${isActive(subItem.path)
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                      <span className="flex-shrink-0">{subItem.icon}</span>
                      <span className="truncate">{subItem.name}</span>
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed my-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              {/* <ResponsiveImage/> */}
              <LogoIcon sizeWidth={60} sizeHeight={80} textSize="text-3xl" />
            </>
          ) : (
            <LogoIcon sizeWidth={50} sizeHeight={100} showText={false} />
          )}
        </Link>
      </div>
      <div className="flex overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu DE ARTICULOS"
                ) : (
                  <IconLucide name="minus" size={24} strokeWidth={1} />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSideBar;