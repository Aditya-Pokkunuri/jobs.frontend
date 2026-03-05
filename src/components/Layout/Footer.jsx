const Footer = () => {
    return (
        <footer className="border-t-2 border-black py-12 mt-auto bg-white">
            <div className="container mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="text-[10px] font-black text-black uppercase tracking-[0.4em]">
                    &copy; {new Date().getFullYear()} // OTTOBON_JOBS_NETWORK
                </div>
                <div className="flex gap-10 text-[9px] font-black text-black/40 uppercase tracking-[0.3em]">
                    <a href="#" className="hover:text-black hover:underline transition-all">TERMINAL_PRIVACY</a>
                    <a href="#" className="hover:text-black hover:underline transition-all">SYSTEM_TERMS</a>
                    <a href="#" className="hover:text-black hover:underline transition-all">NODE_STATUS</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
