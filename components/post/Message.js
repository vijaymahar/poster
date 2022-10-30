import Image from "next/image"

function Message({ children, avatar, username, description }) {
    return (
        <div className="bg-white p-8 border-b-2 rounded-lg">
            <div className="flex items-center gap-2">
                <Image className="w-12 rounded-full cursor-pointer" width={"50"} height={"50"} src={avatar} alt={description} />
                <h2>{username}</h2>
            </div>
            <div className="py-4">
                <p>
                    {description}
                </p>

            </div>
            {children}
        </div>
    )
}

export default Message
