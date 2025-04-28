import ProfileCard from "@/app/components/Profile/ProfileCard";
 
 
 export default function ProfilePage() {
   return (
     <div className="w-full flex justify-center px-4 py-28 min-h-[100vh]">
       <main className="h-[90%] max-w-5xl mx-auto p-6">
         <ProfileCard />
       </main>
     </div>
   )
}