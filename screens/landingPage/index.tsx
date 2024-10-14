"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Toaster } from "sonner";
import Dropdown from "./Dropdown";
import UsersList from "../adminTable";
const LandingPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { status, update, data: session } = useSession();
  console.log("SESSION >>>>", session);
  return (
    <>
      <Toaster />
      {/* navbar start here */}

      <nav className="sticky top-0 z-50 bg-black text-white p-4 w-full px-10 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="font-bold text-lg">Ahsan Ali</span>
          <span className="text-sm">Backend</span>
        </div>
        <div className="hidden md:flex space-x-4 items-center">
          {status === "authenticated" ? (
            <Dropdown user={session} />
          ) : (
            <>
              <Link href="/signin">
                <motion.button
                  className="bg-[#FF4F4F] px-4 py-2 rounded-3xl shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
              </Link>
              <Link href="/signup">
                <motion.button
                  className="bg-[#FF4F4F] px-4 py-2 rounded-3xl shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  SignUp
                </motion.button>
              </Link>
            </>
          )}
        </div>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <span className="navbar-toggler-icon">&#9776;</span>
        </button>

        {isOpen && (
          <motion.div
            className="absolute top-16 left-0 w-full bg-black text-white flex flex-col items-center space-y-4 p-4 md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Link href="#">
              <motion.button
                className="hover:underline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(false)}
              >
                Resources
              </motion.button>
            </Link>
            {status === "authenticated" ? (
              <>
                <Link href="/dashboard">
                  <motion.button
                    className="hover:underline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </motion.button>
                </Link>

                <motion.button
                  className="hover:underline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => signOut()}
                >
                  LogOut
                </motion.button>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <motion.button
                    className="hover:underline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </motion.button>
                </Link>
                <Link href="/signup">
                  <motion.button
                    className="hover:underline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(false)}
                  >
                    SignUp Now
                  </motion.button>
                </Link>
              </>
            )}

            <Link href="#">
              <motion.button
                className="bg-[#FF4F4F] px-4 py-2 rounded-3xl shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(false)}
              >
                Book a Demo
              </motion.button>
            </Link>
          </motion.div>
        )}
      </nav>
      <div>
        {session ? (
          <>
            <div>
              <div className="color:blue"> Current User</div>
              <div>Email:{session?.user?.email}</div>
              <div>FullName:{session?.user?.fullname}</div>
              <div>Role:{session?.user?.role}</div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      <div>
        {session?.user.role === "ADMIN" ? (
          <>
            <div>
              <UsersList />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
export default LandingPage;
