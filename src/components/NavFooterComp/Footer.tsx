"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-[#0A121F] text-gray-300 px-6 md:px-18 py-10">
            <div className="max-w-7xl mx-auto grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                {/* Logo + Description */}
                <div>
                    <h2 className="text-xl font-bold">
                        <span className="flex items-baseline font-extrabold">
                            <span className="text-2xl md:text-3xl text-cyan-400">
                                Cine
                            </span>
                            <span className="text-2xl md:text-3xl text-white">
                                Watch
                            </span>
                        </span>
                    </h2>
                    <p className="mt-3 text-sm">
                        Your one-stop destination for movies, trailers, and
                        cinema tickets.
                    </p>

                    {/* Social Icons */}
                    <div className="flex gap-4 mt-4">
                        {/* Facebook */}
                        <Link href="#">
                            <svg
                                className="w-5 h-5 hover:fill-sky-400 transition"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.2 3-3.2.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.3 3h-1.9v7A10 10 0 0 0 22 12z" />
                            </svg>
                        </Link>

                        {/* Twitter */}
                        <Link href="#">
                            <svg
                                className="w-5 h-5 hover:fill-sky-400 transition"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M19.6 7.2c.01.2.01.5.01.7 0 6.9-5.2 14.8-14.8 14.8-2.9 0-5.6-.9-7.9-2.4.4 0 .9.1 1.3.1 2.4 0 4.6-.8 6.4-2.2-2.2 0-4-1.5-4.6-3.5.3 0 .7.1 1 .1.5 0 1-.1 1.5-.2-2.3-.5-4-2.5-4-5v-.1c.7.4 1.4.7 2.2.7a5 5 0 0 1-1.6-6.7c2.5 3 6.3 5 10.6 5.2a5.8 5.8 0 0 1-.1-1.2c0-2.7 2.2-5 5-5 1.4 0 2.6.6 3.5 1.5a10 10 0 0 0 3.2-1.2 5 5 0 0 1-2.2 2.8 10 10 0 0 0 2.9-.8 10.8 10.8 0 0 1-2.5 2.6z" />
                            </svg>
                        </Link>

                        {/* Instagram */}
                        <Link href="#">
                            <svg
                                className="w-5 h-5 hover:fill-sky-400 transition"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2c1.7 0 3 1.3 3 3s-1.3 3-3 3a3 3 0 1 1 0-6zm4.5-.9a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2z" />
                            </svg>
                        </Link>

                        {/* YouTube */}
                        <Link href="#">
                            <svg
                                className="w-5 h-5 hover:fill-sky-400 transition"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M23.5 6.2s-.2-1.6-.9-2.3c-.9-.9-2-.9-2.5-1C17.2 2.5 12 2.5 12 2.5h0s-5.2 0-8.1.4c-.5.1-1.6.1-2.5 1C.7 4.6.5 6.2.5 6.2S0 8.1 0 10v1.9c0 1.9.5 3.8.5 3.8s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.9.2 8.1.4 8.1.4s5.2 0 8.1-.4c.5-.1 1.6-.1 2.5-1 .7-.7.9-2.3.9-2.3s.5-1.9.5-3.8V10c0-1.9-.5-3.8-.5-3.8zM9.5 14.5v-5l6.5 2.5-6.5 2.5z" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* Company */}
                <div>
                    <h3 className="font-semibold text-white mb-3">Company</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="#">About Us</Link>
                        </li>
                        <li>
                            <Link href="#">Careers</Link>
                        </li>
                        <li>
                            <Link href="#">Press</Link>
                        </li>
                        <li>
                            <Link href="#">Contact</Link>
                        </li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="font-semibold text-white mb-3">Support</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="#">Help Center</Link>
                        </li>
                        <li>
                            <Link href="#">FAQ</Link>
                        </li>
                        <li>
                            <Link href="#">Terms of Service</Link>
                        </li>
                        <li>
                            <Link href="#">Privacy Policy</Link>
                        </li>
                    </ul>
                </div>

                {/* Download App */}
                <div>
                    <h3 className="font-semibold text-white mb-3">
                        Download Our App
                    </h3>
                    <p className="text-sm">
                        Get the best experience on your phone
                    </p>
                    <div className="flex flex-col gap-3 mt-4">
                        <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm">
                            App Store
                        </button>
                        <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm">
                            Google Play
                        </button>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700 mt-10 pt-6 text-sm flex flex-col xs:flex-col md:flex-row items-center justify-between gap-4">
                <p>© 2025 Cinewatch. All rights reserved.</p>
                <div className="flex gap-6">
                    <Link href="#">Terms</Link>
                    <Link href="#">Privacy</Link>
                    <Link href="#">Cookies</Link>
                </div>
            </div>
        </footer>
    );
}
