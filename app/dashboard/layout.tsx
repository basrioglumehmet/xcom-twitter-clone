import { createClient } from "@/utils/supabase/server";
import { checkSubscription } from "@/actions/subscription";
import { Input } from "@/components/ui/input";
import ClientSidebar from "@/components/sidebar";
import SubscriptionStatus from "@/components/subscription-status";
import MobileClientSidebar from "@/components/mobile-client-sidebar.old";

export default async function dashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isSubscribed = await checkSubscription(user?.id ?? "");

  return (
    <div className="w-full  h-full flex text-black justify-center text-sm items-center relative bg-background ">
      <div className="xl:max-w-[80rem] w-full h-full flex relative">
        <section className="w-[23%] sticky top-0 xl:flex flex-col items-stretch h-screen hidden border-r">
          <div className="flex flex-col items-stretch h-full space-y-4 mt-4">
            <ClientSidebar />
          </div>
        </section>
        <section className="xl:hidden w-full fixed bottom-0 bg-white p-2 min-h-14 border-t flex items-center justify-between gap-5 z-10 backdrop-blur-md">
          {/* <MobileClientSidebar /> */}
        </section>
        <div className=" xl:w-[50%] w-full h-full">{children}</div>
        <section className="hidden  w-[25%] sticky top-0 xl:flex flex-col items-stretch h-screen  border-l">
          <div className="flex flex-col items-stretch h-full space-y-4 mt-4 px-4 pt-9">
            <Input name="email" placeholder="Search" required />
            <SubscriptionStatus
              userId={user?.id ?? ""}
              initialIsSubscribed={isSubscribed}
            />
            <div className="border p-2 flex flex-col gap-5 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">#</span>
                <h4 className="font-bold text-lg">Trend Hashtags</h4>
              </div>
              <ul className="flex flex-col gap-5">
                <li className="hover:bg-background-2 p-2 rounded-lg cursor-pointer">
                  <div className="flex flex-col gap-2">
                    <span className="text-muted-foreground text-sm">
                      Trending in Türkiye
                    </span>
                    <div className="flex items-center">
                      <span className="text-primary">#</span>
                      <span className="text-black">hashtag1</span>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      3.5K Posts
                    </span>
                  </div>
                </li>
                <li className="hover:bg-background-2 p-2 rounded-lg cursor-pointer">
                  <div className="flex flex-col gap-2">
                    <span className="text-muted-foreground text-sm">
                      Trending in Worldwide
                    </span>
                    <div className="flex items-center">
                      <span className="text-primary">#</span>
                      <span className="text-black">hashtag1</span>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      3.5K Posts
                    </span>
                  </div>
                </li>
              </ul>
            </div>
            <span className="font-bold">
              This is a non-commercial clone project. All rights to the original
              product belong to X Corp.
            </span>
            <span className="font-thin text-sm">
              © 2025 Mehmet Basrioğlu - Clone Project.
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
