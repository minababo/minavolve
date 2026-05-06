"use client";

import { useRef, useState, useTransition } from "react";
import {
  closestCorners,
  type CollisionDetection,
  DndContext,
  KeyboardCode,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useRouter } from "next/navigation";

import { moveKanbanStory } from "@/app/(app)/projects/[projectId]/kanban/actions";
import {
  buildKanbanColumns,
  compareKanbanStories,
  getKanbanStatusFromColumnId,
  getKanbanStatusLabel,
  type KanbanStatus,
  type KanbanStory,
} from "@/lib/kanban";

import { KanbanColumn } from "./kanban-column";

type KanbanBoardProps = {
  projectId: string;
  initialStories: KanbanStory[];
};

type ReorderedBoard = {
  stories: KanbanStory[];
  targetStatus: KanbanStatus;
  orderedStoryIds: string[];
};

function getStoryId(id: UniqueIdentifier) {
  return String(id);
}

function getStoriesByStatus(stories: KanbanStory[], status: KanbanStatus) {
  return stories
    .filter((story) => story.status === status)
    .sort(compareKanbanStories);
}

function getStoryIdsByStatus(stories: KanbanStory[], status: KanbanStatus) {
  return getStoriesByStatus(stories, status).map((story) => story.id);
}

function getDropStatus(overId: string, stories: KanbanStory[]) {
  const columnStatus = getKanbanStatusFromColumnId(overId);

  if (columnStatus) {
    return columnStatus;
  }

  return stories.find((story) => story.id === overId)?.status ?? null;
}

const kanbanCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  const collisions =
    pointerCollisions.length > 0 ? pointerCollisions : closestCorners(args);
  const storyCollisions = collisions.filter(({ id }) => {
    return !getKanbanStatusFromColumnId(getStoryId(id));
  });

  return storyCollisions.length > 0 ? storyCollisions : collisions;
};

function getReorderedBoard(
  stories: KanbanStory[],
  storyId: string,
  overId: string,
): ReorderedBoard | null {
  if (storyId === overId) {
    return null;
  }

  const movingStory = stories.find((story) => story.id === storyId);
  const targetStatus = getDropStatus(overId, stories);

  if (!movingStory || !targetStatus) {
    return null;
  }

  const sourceStatus = movingStory.status;
  const sourceStories = getStoriesByStatus(stories, sourceStatus);
  const targetStoriesWithoutMoving = getStoriesByStatus(
    stories,
    targetStatus,
  ).filter((story) => story.id !== storyId);
  const overStory = stories.find((story) => story.id === overId);
  let targetIndex = targetStoriesWithoutMoving.length;

  if (overStory?.status === targetStatus) {
    const overTargetIndex = targetStoriesWithoutMoving.findIndex(
      (story) => story.id === overStory.id,
    );

    targetIndex =
      overTargetIndex >= 0 ? overTargetIndex : targetStoriesWithoutMoving.length;

    if (sourceStatus === targetStatus) {
      const sourceIndex = sourceStories.findIndex(
        (story) => story.id === storyId,
      );
      const sourceOverIndex = sourceStories.findIndex(
        (story) => story.id === overStory.id,
      );

      if (sourceIndex >= 0 && sourceOverIndex >= 0 && sourceIndex < sourceOverIndex) {
        targetIndex += 1;
      }
    }
  }

  const boundedTargetIndex = Math.max(
    0,
    Math.min(targetIndex, targetStoriesWithoutMoving.length),
  );
  const reorderedTargetStories = [...targetStoriesWithoutMoving];

  reorderedTargetStories.splice(boundedTargetIndex, 0, {
    ...movingStory,
    status: targetStatus,
    sort_order: boundedTargetIndex * 1000,
  });

  const normalizedTargetStories = reorderedTargetStories.map((story, index) => ({
    ...story,
    status: targetStatus,
    sort_order: index * 1000,
  }));
  const normalizedStoryById = new Map(
    normalizedTargetStories.map((story) => [story.id, story]),
  );
  const nextStories = stories.map(
    (story) => normalizedStoryById.get(story.id) ?? story,
  );
  const currentTargetOrder = getStoriesByStatus(stories, targetStatus).map(
    (story) => story.id,
  );
  const nextTargetOrder = normalizedTargetStories.map((story) => story.id);
  const orderDidChange =
    currentTargetOrder.length !== nextTargetOrder.length ||
    currentTargetOrder.some((currentStoryId, index) => {
      return currentStoryId !== nextTargetOrder[index];
    });

  if (sourceStatus === targetStatus && !orderDidChange) {
    return null;
  }

  return {
    stories: nextStories,
    targetStatus,
    orderedStoryIds: nextTargetOrder,
  };
}

function getPersistedMove(
  initialStories: KanbanStory[],
  finalStories: KanbanStory[],
  storyId: string,
): ReorderedBoard | null {
  const initialStory = initialStories.find((story) => story.id === storyId);
  const finalStory = finalStories.find((story) => story.id === storyId);

  if (!initialStory || !finalStory) {
    return null;
  }

  const targetStatus = finalStory.status;
  const initialTargetOrder = getStoryIdsByStatus(initialStories, targetStatus);
  const finalTargetOrder = getStoryIdsByStatus(finalStories, targetStatus);
  const statusDidChange = initialStory.status !== finalStory.status;
  const orderDidChange =
    initialTargetOrder.length !== finalTargetOrder.length ||
    initialTargetOrder.some((currentStoryId, index) => {
      return currentStoryId !== finalTargetOrder[index];
    });

  if (!statusDidChange && !orderDidChange) {
    return null;
  }

  return {
    stories: finalStories,
    targetStatus,
    orderedStoryIds: finalTargetOrder,
  };
}

export function KanbanBoard({ projectId, initialStories }: KanbanBoardProps) {
  const router = useRouter();
  const dragStartStoriesRef = useRef<KanbanStory[] | null>(null);
  const [stories, setStories] = useState(initialStories);
  const [activeStory, setActiveStory] = useState<KanbanStory | null>(null);
  const [activeOverStatus, setActiveOverStatus] =
    useState<KanbanStatus | null>(null);
  const [pendingStoryId, setPendingStoryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [isPending, startTransition] = useTransition();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      keyboardCodes: {
        start: [KeyboardCode.Space],
        cancel: [KeyboardCode.Esc],
        end: [KeyboardCode.Space, KeyboardCode.Tab],
      },
    }),
  );
  const columns = buildKanbanColumns(stories);
  const movementDisabled = isPending || Boolean(pendingStoryId);

  function handleDragStart(event: DragStartEvent) {
    const story = stories.find(
      (candidate) => candidate.id === getStoryId(event.active.id),
    );

    dragStartStoriesRef.current = stories;
    setActiveStory(story ?? null);
    setActiveOverStatus(story?.status ?? null);
    setError(null);
  }

  function handleDragOver(event: DragOverEvent) {
    if (!event.over || movementDisabled) {
      setActiveOverStatus(null);
      return;
    }

    const storyId = getStoryId(event.active.id);
    const overId = getStoryId(event.over.id);
    const overStatus = getDropStatus(overId, stories);
    const reorderedBoard = getReorderedBoard(stories, storyId, overId);

    setActiveOverStatus(overStatus);

    if (reorderedBoard) {
      setStories(reorderedBoard.stories);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveStory(null);
    setActiveOverStatus(null);

    const storyId = getStoryId(event.active.id);
    const overId = event.over ? getStoryId(event.over.id) : null;
    const previousStories = dragStartStoriesRef.current ?? stories;

    if (!event.over || movementDisabled) {
      setStories(previousStories);
      dragStartStoriesRef.current = null;
      return;
    }

    const finalReorder = overId
      ? getReorderedBoard(stories, storyId, overId)
      : null;
    const finalStories = finalReorder?.stories ?? stories;
    const persistedMove = getPersistedMove(
      previousStories,
      finalStories,
      storyId,
    );

    dragStartStoriesRef.current = null;

    if (!persistedMove) {
      setStories(finalStories);
      return;
    }

    const movedStory = previousStories.find((story) => story.id === storyId);

    setStories(persistedMove.stories);
    setPendingStoryId(storyId);

    startTransition(() => {
      void (async () => {
        const result = await moveKanbanStory({
          projectId,
          storyId,
          status: persistedMove.targetStatus,
          orderedStoryIds: persistedMove.orderedStoryIds,
        });

        if (!result.ok) {
          setStories(previousStories);
          setError(result.message);
        } else {
          setAnnouncement(
            `${movedStory?.title ?? "Story"} moved to ${getKanbanStatusLabel(
              persistedMove.targetStatus,
            )}.`,
          );
          router.refresh();
        }

        setPendingStoryId(null);
      })();
    });
  }

  function handleDragCancel() {
    setActiveStory(null);
    setActiveOverStatus(null);
    setStories(dragStartStoriesRef.current ?? stories);
    dragStartStoriesRef.current = null;
  }

  return (
    <div>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-slate-600">
          Click a story card to open it, or drag the card between columns to
          update its workflow status.
        </p>
        {pendingStoryId ? (
          <p className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800">
            Saving board movement...
          </p>
        ) : null}
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
          {error}
        </div>
      ) : null}

      <DndContext
        id={`kanban-board-${projectId}`}
        sensors={sensors}
        collisionDetection={kanbanCollisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="overflow-x-auto pb-3">
          <div className="grid min-w-[1180px] grid-cols-5 gap-4">
            {columns.map((column) => (
              <KanbanColumn
                key={column.status}
                column={column}
                disabled={movementDisabled}
                isDropTarget={
                  Boolean(activeStory) && activeOverStatus === column.status
                }
                pendingStoryId={pendingStoryId}
              />
            ))}
          </div>
        </div>

      </DndContext>
    </div>
  );
}
