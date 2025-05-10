"use client";
import FeedBox from "@/components/feedbox";
import FeedTabLinkItems from "@/components/feedtab-link-items";
import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { toggleOperationModal } from "@/store/actions/operationModalActions";
import { useAppDispatch } from "@/store/configureStore";
import { createClient } from "@/utils/supabase/client";
import { InfoIcon } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const supabase = createClient();
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const res = await supabase.auth.getUser();
      if (res.data.user != null) {
        await dispatch(toggleOperationModal(false));
        router.replace("/dashboard/feed/for-you");
      }
    };
    check();
  }, []);
}
