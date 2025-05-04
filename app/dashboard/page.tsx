import FeedBox from "@/components/feedbox";
import FeedTabLinkItems from "@/components/feedtab-link-items";
import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function dashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* <div>
        {Array.from({ length: 100 }, (_, i) => (
          <FeedBox key={i} />
        ))}
      </div> */}
    </div>
  );
}
