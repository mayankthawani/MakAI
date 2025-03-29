import { currentUser } from "@clerk/nextjs/server"
import { db } from "./prisma";


export const checkuser = async()=>{
    const user = await currentUser();


if(!user){
    return null;
}

try{
    const loggedinuser = await db.user.findUnique({
        where: {
            clerkUserId : user.id,
        },

    });
    if(loggedinuser){
        return loggedinuser;
    }

    const name = `${user.firstName} ${user.lastName}`;

    const newuser = await db.user.create({
       data:{
        clerkUserId : user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress

       }
    });

    return newuser;

}catch(error){
    console.log(error.message)
}
}