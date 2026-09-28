"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md hover:bg-zinc-800 transition-colors text-red-400 hover:text-red-300"
        >
            <LogOut className="w-5 h-5" />
            Sign Out
        </button>
    )
}
