import DashboardLinks from "@/components/home-links";
import Logo from "../../components/logo";
import MiniProfile from "../../components/mini-profile";
import ClientSidebar from "@/components/sidebar";
import { Input } from "@/components/ui/input";
import SubscribeButton from "@/components/subscribe-button";
import PremiumLottie from "@/components/ui/premium-lottie";
import { createClient } from "@/utils/supabase/server";
import { checkSubscription } from "@/actions/subscription";

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
    <div className="w-full h-full flex justify-center items-center relative bg-black text-white">
      <div className="xl:max-w-[80rem] w-full h-full flex relative">
        <section className="w-[23%] sticky top-0 xl:flex flex-col items-stretch h-screen hidden border-r">
          <div className="flex flex-col items-stretch h-full space-y-4 mt-4">
            <ClientSidebar />
          </div>
        </section>
        <div className="w-[50%]">{children}</div>
        {/* <RightSection /> */}
        <section className="w-[25%] sticky top-0 xl:flex flex-col items-stretch h-screen hidden border-l">
          <div className="flex flex-col items-stretch h-full space-y-4 mt-4 px-4 pt-9">
            <Input name="email" placeholder="Search" required />
            <div className="border p-2 flex flex-col gap-5 rounded-xl ">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5">
                    <PremiumLottie />
                  </div>
                  <h4 className="font-bold text-lg">
                    {isSubscribed
                      ? "Premium Plan"
                      : "Subscribe to Premium Plan"}
                  </h4>
                </div>
                <p>
                  {isSubscribed
                    ? "You are subscribed to premium plan."
                    : "Get access to exclusive features and content by subscribing to our premium plan."}
                </p>
              </div>
              <SubscribeButton
                isSubscribed={isSubscribed}
                disabled={user?.id == null || isSubscribed}
                userId={user?.id ?? ""}
              />
            </div>
            <div className="border p-2 flex flex-col gap-5 rounded-xl ">
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
                    <div className="flex items-center ">
                      <span className="text-primary">#</span>
                      <span className="text-white">hashtag1</span>
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
                      <span className="text-white">hashtag1</span>
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
