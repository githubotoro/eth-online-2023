"use client"

export const UserChats = () => {
    const chats = await userAlice.chat.list("CHATS");
    return(
        <div>
            Chats
        </div>
    )
}

