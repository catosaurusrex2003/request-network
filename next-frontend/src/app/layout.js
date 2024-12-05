"use client";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/Sidebar/Sidebar";
import FooterAdmin from "@/components/Footers/FooterAdmin";
import { Web3Provider } from "@/components/Navbars/Web3Provider";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/config/firebase";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Login from "./login/page";
import { useAuthStore } from "@/store/auth";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata = {
//   title: "Bounty Stream",
//   description: "Distribute Crypto Bounty efficiently",
// };

export default function RootLayout({ children }) {
  const auth = getAuth(app);

  const isUserValid = useAuthStore((state) => state.isUserValid);
  const setIsUserValid = useAuthStore((state) => state.setIsUserValid);

  useEffect(() => {
    const checkAuth = () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsUserValid(true);
        } else {
          console.log("no user found");
          redirect("/");
        }
      });
    };

    checkAuth();
  }, []);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Web3Provider>
          <Sidebar />
          <div className="relative md:ml-64 bg-blueGray-100">
            {/* Header */}
            {/* <div className="px-4 md:px-10 mx-auto w-full -m-24"> */}
            {isUserValid ? children : <Login />}
            <FooterAdmin />
            {/* </div> */}
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}
