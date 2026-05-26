import { RecommendationDetail } from "@/components/result/RecommendationDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function RecommendationResultPage({ params }: PageProps) {
  const { id } = await params;
  return <RecommendationDetail id={id} />;
}
