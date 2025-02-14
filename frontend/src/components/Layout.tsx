import React from "react";
import Navbar from "./Navbar"; // Import your Navbar component
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer/>
    </div>
  );
};

export default Layout;