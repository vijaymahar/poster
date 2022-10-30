import Navbar from "../navbar/Navbar"

function Layout({ children }) {
    return (
        <div className="font-poppins">
            <Navbar />
            <main>
                {children}
            </main>
        </div>
    )
}

export default Layout
