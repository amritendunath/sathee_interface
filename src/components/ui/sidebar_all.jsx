import React, { useState, createContext, useContext } from 'react';
import { FiSidebar } from "react-icons/fi";
// Create a context for the sidebar state
const SidebarContext = createContext({
    isOpen: false,
    setIsOpen: () => { },
});

// Create a SidebarProvider component
export function SidebarProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const value = {
        isOpen,
        setIsOpen
        // setIsOpen: toggleSidebar,
    };

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );
}

// Create a custom hook to access the sidebar context
export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}

// Create a Sidebar component
export function Sidebar({ children }) {
    const { isOpen } = useSidebar();

    return (
        <div
            className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                } z-50`}
        >
            {children}
        </div>
    );
}

// Create a SidebarTrigger component
export function SidebarTrigger() {
    const { isOpen, setIsOpen } = useSidebar();

    return (
        <button
            // className="text-white focus:outline-none"
            className={`mt-4 text-gray-200 absolute top-0 left-0 m-2 focus:outline-none transition-transform transform ${isOpen ? 'translate-x-64' : 'translate-x-0'}`}
            onClick={() => setIsOpen(prevState => !prevState)}
        >
            <FiSidebar size={20}/>
        </button>
    );
}


// import React, { useState, createContext, useContext } from 'react';
// import { motion, AnimatePresence } from "framer-motion";

// const SidebarContext = createContext({
//   isOpen: false,
//   setIsOpen: () => {},
// });

// export function SidebarProvider({ children }) {
//   const [isOpen, setIsOpen] = useState(false);
  
//   return (
//     <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
//       {children}
//     </SidebarContext.Provider>
//   );
// }

// export function useSidebar() {
//   const context = useContext(SidebarContext);
//   if (!context) {
//     throw new Error('useSidebar must be used within a SidebarProvider');
//   }
//   return context;
// }

// export function SidebarLayout({ children, AppSidebar, ...props }) {
//   const { isOpen, setIsOpen } = useSidebar();

//   return (
//     <>
//       {/* Desktop Sidebar */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ x: "-100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "-100%" }}
//             transition={{ duration: 0.3, ease: "easeInOut" }}
//             className="hidden md:block h-full"
//           >
//             <div className="h-full bg-[#0B0E17] w-64 border-r border-[#181B24] text-white">
//               <div className="opacity-100"> {/* Add this wrapper */}
//                 <AppSidebar {...props} />
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Mobile Sidebar */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ x: "-100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "-100%" }}
//             transition={{ duration: 0.3, ease: "easeInOut" }}
//             className="fixed top-0 left-0 h-full z-50 md:hidden bg-[#0B0E17] w-64 border-r border-[#181B24]"
//           >
//             <div className="opacity-100"> {/* Add this wrapper */}
//               <AppSidebar {...props} />
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Keep the overlay but remove any opacity that might affect content */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 z-40 md:hidden pointer-events-auto"
//             onClick={() => setIsOpen(false)}
//           />
//         )}
//       </AnimatePresence>

//       {children}
//     </>
//   );
// }