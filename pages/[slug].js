import { useEffect, useState } from 'react'
import Message from "../components/post/Message";
import { useRouter } from "next/router";
// import { async } from "@firebase/util";
import { auth, db } from "../utils/firebase";
import { toast } from "react-toastify";
import { arrayUnion, doc, getDoc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";
import Image from "next/image";

function Comments() {
    const [message, setMessage] = useState('');
    const [allMessages, setAllmessages] = useState([]);

    const router = useRouter();
    const routerData = router.query;

    const submitMessage = async () => {
        // check if the user is logged
        if (!auth.currentUser) return router.push('/auth/login');

        // message is empty
        if (!message) {
            toast.error("Message is Empty");
            return;
        }

        const docRef = doc(db, 'posts', routerData?.id)
        await updateDoc(docRef, {
            comments: arrayUnion({
                message,
                avatar: auth.currentUser.photoURL,
                username: auth.currentUser.displayName,
                time: Timestamp.now(),
            })
        });

        setMessage("");
        getComments();
    }


    // Get Comments
    const getComments = async () => {
        const docRef = doc(db, 'posts', routerData?.id);
        // const docSnap = await getDoc(docRef);
        // setAllmessages(docSnap.data().comments);
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
            setAllmessages(snapshot.data().comments)
        })
        return unsubscribe;
    };

    useEffect(() => {
        if (!router.isReady) return;
        getComments();
    }, [router.isReady]);

    return (
        <div>
            <Message {...routerData}>
                <div className="my-4">
                    <div className="flex">
                        <input
                            className="bg-gray-800 w-full p-2 text-white text-sm"
                            type="text"
                            value={message}
                            placeholder="send a messasge"
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                            onClick={submitMessage}
                            className="bg-cyan-500 text-white py-2 px-4 text-sm">
                            Submit
                        </button>
                    </div>
                    <div className="py-6">
                        <h2 className="font-bold">
                            Comments
                        </h2>
                        {
                            allMessages?.map(message => {
                                return (
                                    <div className="bg-white p-4 my-4 border-2" key={message.time}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Image className="w-10 rounded-full cursor-pointer" width={"40"} height={"40"} src={message.avatar} alt={message.username} />
                                            {/* <Image src={message.avatar} alt="" /> */}
                                            <h2>
                                                {message?.username}
                                            </h2>
                                        </div>
                                        <h2>
                                            {message.message}
                                        </h2>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </Message>
        </div>
    )
}

export default Comments;
