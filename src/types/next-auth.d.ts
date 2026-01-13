import { DefaultSession } from "next-auth"
import { AdapterUser } from "@auth/core/adapters"

declare module "next-auth" {
    interface User {
        role: "admin" | "parent"
    }

    interface Session {
        user: {
            role: "admin" | "parent"
        } & DefaultSession["user"]
    }
}

declare module "@auth/core/adapters" {
    interface AdapterUser {
        role: "admin" | "parent";
    }
}
