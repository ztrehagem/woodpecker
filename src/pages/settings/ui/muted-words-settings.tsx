import type { AppBskyActorDefs } from "@atproto/api";
import React, { useState } from "react";

import Card from "#src/shared/ui/card.tsx";
import { DeleteIcon } from "#src/shared/ui/icon/index.ts";

type MutedWordTarget = "content" | "tag";

interface MutedWordsSettingsProps {
  mutedWords: AppBskyActorDefs.MutedWord[];
  isSaving: boolean;
  onAdd: (value: string, target: MutedWordTarget) => void;
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
  const normalizedValue = value.trim().replace(/^#/, "");

  const submit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (normalizedValue.length === 0) {
      return;
    }

    onAdd(normalizedValue, target);
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
          <div
            className="flex w-fit rounded-md border border-highlight p-0.5"
            aria-label="Mute type"
          >
            {(["content", "tag"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={target === option}
                onClick={() => setTarget(option)}
                className="cursor-pointer rounded-sm px-3 py-1.5 text-sm font-medium aria-pressed:bg-highlight"
              >
                {option === "content" ? "Word" : "Hashtag"}
              </button>
            ))}
          </div>

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

              return (
                <li
                  key={mutedWord.id ?? `${mutedWord.value}-${index}`}
                  className="flex items-center gap-3 py-3"
                >
                  <span className="min-w-0 grow wrap-anywhere">{label}</span>
                  <span className="text-xs text-fg-muted">{isTag ? "Hashtag" : "Word"}</span>
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
