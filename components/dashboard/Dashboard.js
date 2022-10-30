import { auth, db } from "../../utils/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { useRouter } from "next/router"
import { useEffect } from "react";
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import { useState } from "react";
import Message from "../post/Message";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai"
import Link from "next/link";
function Dashboard() {
    const router = useRouter();
    const [user, loading] = useAuthState(auth);
    const [posts, setPosts] = useState([]);
    //check if user is logged in
    const checkUserExist = async () => {
        if (loading) return;
        if (!user) return router.push("auth/login");
        const collectionRef = collection(db, "posts");
        const q = query(collectionRef, where('user', '==', user.uid))
        const unsubscribe = onSnapshot(q, (snapshort) => {
            setPosts(snapshort.docs.map(doc => ({ ...doc.data(), id: doc.id })))
        });
        return unsubscribe;
    }


    // Delete poster
    const deletePoster = async (id) => {
        const docRef = doc(db, 'posts', id);
        await deleteDoc(docRef);
    }

    // fetch user data
    useEffect(() => {
        checkUserExist()

    }, [user, loading])

    return (
        <div>
            <h1>
                Your Posters
            </h1>
            <div>
                {
                    posts.map(post => {
                        return (
                            <Message {...post} key={post.id}>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => deletePoster(post.id)}
                                        className="text-pink-600 flex items-center justify-center gap-2 py-2 text-sm">
                                        <BsTrash2Fill className="text-2xl" />
                                        Delete
                                    </button>
                                    <Link href={{ pathname: "/post", query: post }}>
                                        <button className="text-teal-600 flex items-center justify-center gap-2 py-2 text-sm">
                                            <AiFillEdit className="text-2xl" />
                                            Edit
                                        </button>
                                    </Link>
                                </div>
                            </Message>
                        )

                    })
                }
            </div>
            <button
                className="font-medium text-white bg-gray-800 py-2 px-4 my-6"
                onClick={() => auth.signOut()}
            >
                Sign Out
            </button>
        </div>
    )
}

export default Dashboard;
