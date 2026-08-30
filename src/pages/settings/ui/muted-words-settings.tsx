import type { AppBskyActorDefs } from "@atproto/api";
import React, { useState } from "react";

import Card from "#src/shared/ui/card.tsx";
import { DeleteIcon } from "#src/shared/ui/icon/index.ts";

type MutedWordTarget = "content" | "tag";
type MutedWordActorTarget = "all" | "exclude-following";
type MutedWordDuration = "forever" | "24-hours" | "7-days" | "30-days";

const ACTOR_TARGETS = [
  ["all", "Everyone"],
  ["exclude-following", "People you don't follow"],
] as const satisfies [MutedWordActorTarget, string][];

const DURATIONS = [
  ["forever", "Forever"],
  ["24-hours", "24 hours"],
  ["7-days", "7 days"],
  ["30-days", "30 days"],
] as const satisfies [MutedWordDuration, string][];

interface MutedWordsSettingsProps {
  mutedWords: AppBskyActorDefs.MutedWord[];
  isSaving: boolean;
  onAdd: (
    value: string,
    target: MutedWordTarget,
    actorTarget: MutedWordActorTarget,
    expiresAt?: string,
  ) => void;
  onRemove: (mutedWord: AppBskyActorDefs.MutedWord) => void;
}

export function MutedWordsSettings({
  mutedWords,
  isSaving,
  onAdd,
  onRemove,
}: MutedWordsSettingsProps): React.ReactElement {
  const [value, setValue] = useState("");
  const [target, setTarget] = useState<MutedWordTarget>("content");
  const [actorTarget, setActorTarget] = useState<MutedWordActorTarget>("all");
  const [duration, setDuration] = useState<MutedWordDuration>("forever");
  const normalizedValue = value.trim().replace(/^#/, "");

  const submit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (normalizedValue.length === 0) {
      return;
    }

    const expiresAt = getExpiresAt(duration);
    onAdd(normalizedValue, target, actorTarget, expiresAt);
    setValue("");
  };

  return (
    <Card>
      <section className="p-5 tablet:p-6" aria-labelledby="muted-words-heading">
        <h2 id="muted-words-heading" className="text-lg font-semibold">
          Muted words and hashtags
        </h2>
        <p className="mt-1 text-sm text-fg-muted">
          Posts containing these words or hashtags will be hidden.
        </p>

        <form className="mt-5 flex flex-col gap-3" onSubmit={submit}>
          <fieldset>
            <legend className="mb-1 text-sm font-medium">Mute type</legend>
            <div className="flex w-fit rounded-md border border-highlight p-0.5">
              {(["content", "tag"] as const).map((option) => (
                <label key={option} className="relative">
                  <input
                    type="radio"
                    name="mute-type"
                    value={option}
                    checked={target === option}
                    disabled={isSaving}
                    onChange={() => setTarget(option)}
                    className="peer absolute inset-0 z-10 cursor-pointer opacity-0 disabled:cursor-not-allowed"
                  />
                  <span className="block cursor-pointer rounded-sm px-3 py-1.5 text-sm font-medium peer-checked:bg-highlight peer-focus-visible:ring-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                    {option === "content" ? "Word" : "Hashtag"}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-1 text-sm font-medium">Apply to</legend>
            <div className="flex w-fit flex-wrap rounded-md border border-highlight p-0.5">
              {ACTOR_TARGETS.map(([option, label]) => (
                <label key={option} className="relative">
                  <input
                    type="radio"
                    name="actor-target"
                    value={option}
                    checked={actorTarget === option}
                    disabled={isSaving}
                    onChange={() => setActorTarget(option)}
                    className="peer absolute inset-0 z-10 cursor-pointer opacity-0 disabled:cursor-not-allowed"
                  />
                  <span className="block cursor-pointer rounded-sm px-3 py-1.5 text-sm font-medium peer-checked:bg-highlight peer-focus-visible:ring-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-1 text-sm font-medium">Duration</legend>
            <div className="flex w-fit flex-wrap rounded-md border border-highlight p-0.5">
              {DURATIONS.map(([option, label]) => (
                <label key={option} className="relative">
                  <input
                    type="radio"
                    name="duration"
                    value={option}
                    checked={duration === option}
                    disabled={isSaving}
                    onChange={() => setDuration(option)}
                    className="peer absolute inset-0 z-10 cursor-pointer opacity-0 disabled:cursor-not-allowed"
                  />
                  <span className="block cursor-pointer rounded-sm px-3 py-1.5 text-sm font-medium peer-checked:bg-highlight peer-focus-visible:ring-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex gap-2">
            <label htmlFor="muted-word" className="sr-only">
              {target === "content" ? "Word to mute" : "Hashtag to mute"}
            </label>
            <input
              id="muted-word"
              type="text"
              value={value}
              disabled={isSaving}
              onChange={(event) => setValue(event.target.value)}
              placeholder={target === "content" ? "Enter a word or phrase" : "Enter a hashtag"}
              className="min-w-0 grow rounded-md border border-highlight bg-filling px-3 py-2 text-sm outline-none focus-visible:ring-2 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSaving || normalizedValue.length === 0}
              className="cursor-pointer rounded-md bg-link px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </form>

        {mutedWords.length > 0 ? (
          <ul className="mt-5 divide-y divide-highlight border-t border-highlight">
            {mutedWords.map((mutedWord, index) => {
              const isTag = mutedWord.targets.includes("tag");
              const label = `${isTag ? "#" : ""}${mutedWord.value}`;
              const actorTargetLabel =
                mutedWord.actorTarget === "exclude-following"
                  ? "People you don't follow"
                  : "Everyone";
              const expirationLabel =
                mutedWord.expiresAt != null && mutedWord.expiresAt.length > 0
                  ? `Until ${new Date(mutedWord.expiresAt).toLocaleString()}`
                  : "Forever";

              return (
                <li
                  key={mutedWord.id ?? `${mutedWord.value}-${index}`}
                  className="flex items-center gap-3 py-3"
                >
                  <div className="flex grow flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="min-w-0 grow wrap-anywhere">{label}</span>
                    <span className="text-xs text-fg-muted">
                      {isTag ? "Hashtag" : "Word"} · {actorTargetLabel} · {expirationLabel}
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${label}`}
                    disabled={isSaving}
                    onClick={() => onRemove(mutedWord)}
                    className="cursor-pointer rounded-md p-2 text-fg-muted hover:bg-highlight hover:text-fg disabled:opacity-50"
                  >
                    <DeleteIcon className="size-5" aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-5 border-t border-highlight pt-4 text-sm text-fg-muted">
            No muted words or hashtags.
          </p>
        )}
      </section>
    </Card>
  );
}

function getExpiresAt(duration: MutedWordDuration): string | undefined {
  const dayMilliseconds = 24 * 60 * 60 * 1000;

  switch (duration) {
    case "forever":
      return void 0;
    case "24-hours":
      return new Date(Date.now() + dayMilliseconds).toISOString();
    case "7-days":
      return new Date(Date.now() + 7 * dayMilliseconds).toISOString();
    case "30-days":
      return new Date(Date.now() + 30 * dayMilliseconds).toISOString();
  }
}
