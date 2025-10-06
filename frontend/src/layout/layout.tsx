// import React, { useEffect, useState, type ReactNode } from "react";

// interface ALayoutProps {
//     children: ReactNode;
// }

// const Layout: React.FC<ALayoutProps> = ({ children }) => {
//     const [visible, setVisible] = useState(false);

//     useEffect(() => {
//         const timer = setTimeout(() => setVisible(true), 10);
//         return () => clearTimeout(timer);
//     }, []);

//     return (
//         <div
//             className={`transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
//                 }`}
//         >
//             {children}

//         </div>
//     );
// };

// export default Layout;