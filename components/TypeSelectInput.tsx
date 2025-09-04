"use client";
import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";

// Option shape for the type selector
interface Option {
  value: string;
  label: string;
  placeholder: string;
}

// Default options (exported if consumers want to reuse/extend)
export const defaultOptions: Option[] = [
  {
    value: "customerID",
    label: "Customer ID",
    placeholder: "Enter your customer ID here...",
  },
  {
    value: "ticketID",
    label: "Ticket ID",
    placeholder: "Enter your ticket ID here...",
  },
];

interface TypeSelectInputProps {
  options?: Option[];
  value?: string;
  onTypeChange?: (value: string) => void;
  inputValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  id?: string;
}

export function TypeSelectInput({
  options = defaultOptions,
  value: controlledType,
  onTypeChange,
  inputValue: controlledValue,
  onValueChange,
  className = "",
  id,
}: TypeSelectInputProps) {
  const [uncontrolledType, setUncontrolledType] = useState(options[0].value);
  const [uncontrolledValue, setUncontrolledValue] = useState("");

  const typeValue = controlledType ?? uncontrolledType;
  const inputVal = controlledValue ?? uncontrolledValue;
  const active = useMemo(
    () => options.find((o) => o.value === typeValue) || options[0],
    [options, typeValue]
  );

  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const activeIndex = options.findIndex((o) => o.value === active.value);
  const [focusIndex, setFocusIndex] = useState(
    activeIndex >= 0 ? activeIndex : 0
  );

  useEffect(() => {
    if (!open) return;
    const listener = (e: MouseEvent) => {
      if (listRef.current?.contains(e.target as Node)) return;
      if (buttonRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    window.addEventListener("mousedown", listener);
    return () => window.removeEventListener("mousedown", listener);
  }, [open]);

  const commitType = useCallback(
    (val: string) => {
      if (onTypeChange) onTypeChange(val);
      else setUncontrolledType(val);
      setOpen(false);
      buttonRef.current?.focus();
    },
    [onTypeChange]
  );

  const onButtonKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setFocusIndex((idx) =>
        e.key === "ArrowDown"
          ? Math.min(options.length - 1, idx + 1)
          : Math.max(0, idx - 1)
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
      } else {
        const opt = options[focusIndex];
        if (opt) commitType(opt.value);
      }
    } else if (e.key === " ") {
      e.preventDefault();
      if (!open) setOpen(true);
      else setOpen(false);
    }
  };

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusIndex((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const opt = options[focusIndex];
      if (opt) commitType(opt.value);
    } else if (/^[a-z0-9]$/i.test(e.key)) {
      const lower = e.key.toLowerCase();
      const found = options.findIndex((o) =>
        o.label.toLowerCase().startsWith(lower)
      );
      if (found >= 0) setFocusIndex(found);
    }
  };

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index='${focusIndex}']`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [focusIndex, open]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        listRef.current?.focus();
      });
    }
  }, [open]);

  return (
    <div
      className={`flex w-full max-w-xl rounded-lg border border-neutral-300 bg-white focus-within:ring-2 focus-within:ring-[#0066B2] transition-shadow ${className}`}
    >
      <div className="relative">
        <button
          ref={buttonRef}
          id={id ? `${id}-type` : undefined}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={id ? `${id}-type-list` : undefined}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={onButtonKey}
          className="bg-[#0066B2] text-white text-sm font-medium pl-4 pr-9 py-3 h-full outline-none cursor-pointer hover:brightness-105 focus:brightness-110 rounded-s-lg"
        >
          {active.label}
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 fill-white opacity-90"
          >
            <path d="M5.25 7.5L10 12.25L14.75 7.5H5.25Z" />
          </svg>
        </button>
        {open && (
          <ul
            ref={listRef}
            role="listbox"
            id={id ? `${id}-type-list` : undefined}
            tabIndex={-1}
            onKeyDown={onListKey}
            className="absolute left-0 top-full mt-1 z-50 min-w-[10rem] max-h-64 overflow-auto rounded-md border border-neutral-300 bg-white shadow-lg focus:outline-none"
          >
            {options.map((o, idx) => {
              const selected = o.value === active.value;
              const focused = idx === focusIndex;
              return (
                <li
                  key={o.value}
                  role="option"
                  aria-selected={selected}
                  data-index={idx}
                  onMouseEnter={() => setFocusIndex(idx)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    commitType(o.value);
                  }}
                  className={`px-3 py-2 text-sm cursor-pointer select-none ${
                    selected
                      ? "bg-[#0066B2] text-white"
                      : focused
                      ? "bg-[#0066B2]/10"
                      : "bg-white"
                  } ${focused ? "outline-none ring-1 ring-[#0066B2]/40" : ""}`}
                >
                  {o.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="flex-1 relative">
        <input
          id={id}
          type="text"
          value={inputVal}
          onChange={(e) => {
            const v = e.target.value;
            if (onValueChange) onValueChange(v);
            else setUncontrolledValue(v);
          }}
          placeholder={active.placeholder}
          className="w-full h-full placeholder:text-neutral-400 px-4 py-3 text-sm focus:outline-none"
        />
      </div>
    </div>
  );
}

export default TypeSelectInput;
