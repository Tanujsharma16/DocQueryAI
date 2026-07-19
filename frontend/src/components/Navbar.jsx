function Navbar(){

    return(
        <nav className="w-full px-8 py-4 flex justify-between items-center border-b">

            <h1 className="text-2xl font-bold">
                DocQuery AI
            </h1>

            <div>
                <button className="px-4 py-2 rounded-lg bg-black text-white">
                    Upload PDF
                </button>
            </div>

        </nav>
    )

}

export default Navbar;