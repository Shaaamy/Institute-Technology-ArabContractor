import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";

export default function AuthSync() {
    const { isSignedIn, getToken } = useAuth();
    const syncedRef = useRef(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!isSignedIn) return;

        const fetchAndStore = async () => {
            const token = await getToken({ template: "backend" });
            if (token) {
                window.__clerkToken = token;   // ← makes token available to all apiFetch calls
                console.log("CLERK TOKEN:", token);
            }
        };

        const sync = async () => {
            await fetchAndStore();

            // Only call /api/Account/sync once per session
            if (!syncedRef.current) {
                syncedRef.current = true;
                await fetch("https://acwebsite-icmet-test.azurewebsites.net/api/Account/sync", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${window.__clerkToken}`,
                    },
                });
            }
        };

        sync();

        // Refresh the token every 50 seconds so it never expires mid-session
        // (Clerk tokens are valid for ~60 seconds)
        intervalRef.current = setInterval(fetchAndStore, 50_000);

        return () => clearInterval(intervalRef.current);
    }, [isSignedIn]);

    return null;
}