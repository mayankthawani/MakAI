import {Inngest} from 'inngest';
export const inngest = new Inngest({ id: 'my-project' , name:"MakAI",
    credentials: {
        gemini: {
            apikey: process.env.GEMINI_API_KEY,
        }
    }
 });