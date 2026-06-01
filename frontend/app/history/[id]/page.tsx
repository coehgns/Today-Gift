import { AuthRedirectGuard } from "@/components/auth/AuthRedirectGuard";
import { RecommendationDetail } from "@/components/result/RecommendationDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function HistoryDetailPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <AuthRedirectGuard>
      <RecommendationDetail id={id} fromHistory />
    </AuthRedirectGuard>
  );
}
