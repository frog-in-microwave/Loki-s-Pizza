import { cookies } from "next/headers";
import MenuClient from "../components/MenuClient";
import { Language } from "../types";

/**
 * SERVER COMPONENT
 * In Next.js (App Router), files in the 'app' directory are Server Components by default.
 * This means this code runs ONLY on the server. It never ships to the user's browser.
 * 
 * KEYWORDS TO SEARCH: "Next.js Server Components", "Next.js cookies() API"
 */
export default async function Home() {
  // We use the cookies() API to read data sent by the user's browser.
  // Because this runs on the server, we can know the user's language preference
  // BEFORE we generate the HTML, preventing any "flicker" on the screen.
  const cookieStore = await cookies();
  const savedLangCookie = cookieStore.get("restaurant-language");
  
  // We check if the cookie exists and equals "ar". If not, we default to "en" (English).
  const initialLang: Language = savedLangCookie?.value === "ar" ? "ar" : "en";

  // PROPS: We pass the 'initialLang' data down to our MenuClient component.
  // MenuClient is a Client Component, so this is how the Server talks to the Browser.
  return <MenuClient initialLang={initialLang} />;
}
