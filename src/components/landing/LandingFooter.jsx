import { Link } from "react-router-dom";

export function LandingFooter() {
    return (
        <footer className="bg-black text-white pt-16 pb-8 border-t border-white/10">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Brand Logo */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter">ottobon.</h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    <ul className="space-y-4">
                        {[
                            { label: "Explore Jobs", to: "/jobs" },
                            { label: "Discover Companies", to: "/jobs" },
                            { label: "Browse Collections", to: "/jobs" },
                        ].map((item) => (
                            <li key={item.label}>
                                <Link to={item.to} className="text-white/60 hover:text-white transition-colors text-sm font-medium">
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <ul className="space-y-4">
                        {[
                            { label: "For Job Seekers", to: "/register" },
                            { label: "For Employers", to: "/register" },
                            { label: "Sign up", to: "/register" },
                        ].map((item) => (
                            <li key={item.label}>
                                <Link to={item.to} className="text-white/60 hover:text-white transition-colors text-sm font-medium">
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <ul className="space-y-4">
                        {[
                            { label: "Directory", to: "/jobs" },
                            { label: "Conferences", to: "/jobs" },
                        ].map((item) => (
                            <li key={item.label}>
                                <Link to={item.to} className="text-white/60 hover:text-white transition-colors text-sm font-medium">
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <ul className="space-y-4">
                        {[
                            { label: "FAQs", to: "/jobs" },
                            { label: "About Us", to: "/jobs" },
                            { label: "Contact Us", to: "/jobs" },
                        ].map((item) => (
                            <li key={item.label}>
                                <Link to={item.to} className="text-white/60 hover:text-white transition-colors text-sm font-medium">
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/50 font-medium">
                    <div className="flex gap-6">
                        <span className="hover:text-white transition-colors cursor-pointer">Cookies Policy</span>
                        <span className="hover:text-white transition-colors cursor-pointer">Legal Terms</span>
                        <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
