import { FcGoogle } from "react-icons/fc"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth"
import { useEffect } from "react";
function Login() {

    const router = useRouter();
    const [user, loading] = useAuthState(auth);
    // Sign in with google
    const googleProvider = new GoogleAuthProvider();

    const googleLogin = async () => {
        try {
            const result = signInWithPopup(auth, googleProvider);

        } catch (err) {
            console.log("err: ", err);
        }
    }

    useEffect(() => {
        if (!user) return console.log("login");
        router.push("/")
    }, [user])

    return (
        <div className="shadow-xl mt-32 p-10 text-gray-700 rounded-lg">
            <h2 className="text-2xl font-medium">
                Join Today
            </h2>
            <div className="py-4">
                <h3 className="py-4">
                    Sign with one of the providers
                </h3>
                <button onClick={googleLogin} className="text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4">
                    <FcGoogle className="text-2xl mr-2" />
                    Sign in with Google
                </button>
            </div>
        </div>
    )
}

export default Login
