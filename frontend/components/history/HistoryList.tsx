"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { HistoryItem } from "@/components/history/HistoryItem";
import { deleteRecommendation, listRecommendations } from "@/lib/api";
import type { RecommendationHistoryItem } from "@/types/recommendation";

export function HistoryList() {
  const [items, setItems] = useState<RecommendationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RecommendationHistoryItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    setDeleteError(null);
    try {
      setItems(await listRecommendations({ allowLocalFallback: false }));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "추천 기록을 불러오지 못했어요.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    async function loadInitialHistory() {
      setIsLoading(true);
      setError(null);
      setDeleteError(null);
      try {
        const nextItems = await listRecommendations({ allowLocalFallback: false });
        if (!active) return;
        setItems(nextItems);
      } catch (loadError) {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "추천 기록을 불러오지 못했어요.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadInitialHistory();

    return () => {
      active = false;
    };
  }, []);

  const handleRequestDelete = (item: RecommendationHistoryItem) => {
    setDeleteError(null);
    setDeleteTarget(item);
  };

  const handleCancelDelete = () => {
    if (deletingId) return;
    setDeleteError(null);
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const item = deleteTarget;
    setDeletingId(item.id);
    setDeleteError(null);
    try {
      await deleteRecommendation(item.id, { allowLocalFallback: false });
      setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
      setDeleteTarget(null);
    } catch (deleteFailure) {
      setDeleteError(deleteFailure instanceof Error ? deleteFailure.message : "추천 기록을 삭제하지 못했어요.");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-[24px] border border-gift-line bg-white/70" />;
  }

  if (error) {
    return <ErrorState title="추천 기록을 불러오지 못했어요" description={error} onRetry={load} />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="아직 저장된 추천 기록이 없어요"
        actionHref="/recommend/form"
        actionLabel="추천 시작하기"
      />
    );
  }

  return (
    <div className="space-y-5">
      {deleteError ? (
        <div className="rounded-[16px] border border-red-100 bg-red-50 px-4 py-3 text-[15px] font-bold text-red-700">
          {deleteError}
        </div>
      ) : null}
      {items.map((item) => (
        <HistoryItem key={item.id} item={item} isDeleting={deletingId === item.id} onDelete={handleRequestDelete} />
      ))}
      <DeleteConfirmModal
        item={deleteTarget}
        error={deleteError}
        isDeleting={Boolean(deletingId)}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

function DeleteConfirmModal({
  item,
  error,
  isDeleting,
  onCancel,
  onConfirm,
}: {
  item: RecommendationHistoryItem | null;
  error: string | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    if (!item) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDeleting) {
        onCancel();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isDeleting, item, onCancel]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gift-ink/45 px-5 py-8 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-history-title"
        aria-describedby="delete-history-description"
        className="w-full max-w-[430px] rounded-[10px] bg-white px-7 py-8 text-center shadow-[0_26px_80px_rgba(39,39,39,0.22)]"
      >
        <div className="mx-auto mb-6 grid size-12 place-items-center rounded-full bg-gift-soft text-[26px] font-black leading-none text-gift-yellow-2">
          <span aria-hidden="true" className="-mt-0.5">
            !
          </span>
        </div>
        <h2 id="delete-history-title" className="text-[21px] font-black tracking-[-0.04em] text-gift-ink">
          추천 기록을 삭제하시겠습니까?
        </h2>
        <p id="delete-history-description" className="mx-auto mt-3 max-w-[310px] text-[15px] font-semibold leading-7 text-gift-ink">
          <span className="block text-gift-muted">‘{item.subtitle}’ 기록은 삭제 후</span>
          <span className="block text-gift-muted">복구할 수 없습니다.</span>
        </p>
        {error ? (
          <p className="mt-5 rounded-[10px] border border-red-100 bg-red-50 px-4 py-3 text-left text-[13px] font-bold leading-6 text-red-700">
            {error}
          </p>
        ) : null}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            disabled={isDeleting}
            onClick={onCancel}
            className="h-10 min-w-[72px] rounded-[8px] border-gift-line bg-white px-4 text-[15px] text-gift-muted shadow-none hover:bg-gift-soft"
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={isDeleting}
            onClick={onConfirm}
            className="h-10 min-w-[72px] rounded-[8px] border-gift-yellow bg-gift-yellow px-4 text-[15px] text-gift-ink shadow-none hover:bg-[#ffd545]"
          >
            {isDeleting ? "삭제 중" : "확인"}
          </Button>
        </div>
      </section>
    </div>
  );
}
