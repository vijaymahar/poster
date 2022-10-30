import Link from "next/link"
import { auth } from "../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";
function Navbar() {

    const [user, loading] = useAuthState(auth);
    console.log("user: ", user);

    return (
        <nav className="flex justify-between items-center py-10">
            <Link href={"/"}>
                <button className="text-lg font-medium">
                    Poster
                </button>
            </Link>
            <ul className="flex items-center gap-10">
                {
                    !user ?
                        <Link href={"/auth/login"}>
                            <a className="py-2 px-4 text-sm bg-cyan-500 text-white rounded-lg font-medium ml-8">
                                Join Now
                            </a>
                        </Link> :

                        <div className="flex items-center gap-6">
                            <Link href={"/post"}>
                                <button className="font-medium bg-cyan-500 text-white py-2 px-4 rounded-md text-sm">
                                    Post
                                </button>
                            </Link>
                            <Link href={"/dashboard"}>
                                <Image className="w-12 rounded-full cursor-pointer" width={"50"} height={"50"} src={user.photoURL} alt={user?.displayName} />
                            </Link>

                        </div>
                }

            </ul>
        </nav>
    )
}

export default Navbar
