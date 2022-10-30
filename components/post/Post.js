import { auth, db } from "../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
function Post() {
    const [user, loading] = useAuthState(auth);
    const [post, setPost] = useState({
        description: ""
    });
    const router = useRouter();
    const postToBeEdit = router.query;
    console.log("router: ", router);
    const handlePost = (e) => {
        setPost((prev) => {
            return { ...prev, description: e.target.value }
        })
    };

    const submitPost = async (e) => {
        e.preventDefault();

        // Run checks for description
        if (!post.description) {
            return toast.error("Cannot post empty post", {
                autoClose: 1500,
            })
        }

        if (post.description.length > 300) {
            return toast.error("post is too long...", {
                autoClose: 1500,
            })
        }

        // update post
        if (post?.id) {
            const docRef = doc(db, 'posts', post.id)
            const updatedPost = { ...post, timestamp: serverTimestamp() }
            await updateDoc(docRef, updatedPost);
            toast.success("Poster Updated Successfully 🚀");
        } else {
            // make a new post
            const collectionRef = collection(db, 'posts')
            await addDoc(collectionRef, {
                ...post,
                timestamp: serverTimestamp(),
                user: user?.uid,
                avatar: user.photoURL,
                username: user?.displayName
            });
            toast.success("Poster is Created 🚀");
        }
        setPost({ description: "" });
        return router.push('/');
    }

    // Check user
    const checkUser = async () => {
        if (loading) return;
        if (!user) router.push("/auth/login");
        if (postToBeEdit?.id) {
            setPost({
                description: postToBeEdit?.description,
                id: postToBeEdit?.id
            })
        }
    };

    useEffect(() => {
        checkUser();
    }, [user, loading])
    return (
        <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
            <h1 className="text-2xl font-bold">
                {/* post.hasOwnProperty('id') */}
                {post?.id ? "Edit Your Post" : "create a new poster"}
            </h1>
            <form onSubmit={submitPost}>
                <div className="py-2">
                    <h3 className="text-lg font-medium py-2">Description</h3>
                    <textarea
                        value={post.description}
                        className="bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-sm"
                        onChange={handlePost}
                    >
                    </textarea>
                    <p className={`text-cyan-600 font-medium text-sm ${post?.description?.length > 300 ? 'text-red-600' : ''}`}>
                        {post?.description?.length}/300
                    </p>
                </div>
                <button
                    type="submit"
                    className="w-full bg-cyan-600 text-white font-medium py-2 my-2 rounded-lg text-sm">
                    Submit
                </button>
            </form>
        </div>
    )
}

export default Post;
