import { AuthGuard } from "@/components/auth/AuthGuard";
import { RecommendForm } from "@/components/recommend/RecommendForm";

export default function RecommendFormPage() {
  return (
    <AuthGuard>
      <section className="px-5 py-10 sm:px-8 sm:py-16">
        <RecommendForm />
      </section>
    </AuthGuard>
  );
}
