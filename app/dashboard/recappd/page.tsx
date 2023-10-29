"use client";
import DashboardTemplates from "@/components/dashboard-templates";
import useStoreUserEffect from "../useStoreUserEffect";
const NewsPage = () => {
  const userId = useStoreUserEffect();
  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center text-green-400">
          My Past Recapps
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          See the recapps you&rsquo;ve made in the past.
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        <DashboardTemplates userId={userId} />
      </div>
    </div>
  );
};
export default NewsPage;
