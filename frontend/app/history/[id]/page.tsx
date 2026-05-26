import { AuthGuard } from "@/components/auth/AuthGuard";
import { RecommendationDetail } from "@/components/result/RecommendationDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function HistoryDetailPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <AuthGuard>
      <RecommendationDetail id={id} fromHistory />
    </AuthGuard>
  );
}
