"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  addNode,
  apply,
  canRedo,
  canUndo,
  createHistory,
  duplicateNode,
  groupNodes,
  normalize,
  redo,
  removeNode,
  serialize,
  setGroupOp,
  toExpression,
  undo,
  updateCondition,
  validate,
} from "@/lib/condition-tree";
import type {
  Comparator,
  ConditionNode,
  ConditionTree,
  GroupNode,
  History,
  TreeNode,
} from "@/lib/condition-tree";

const ACCENT = "#818cf8";

const FIELDS = ["country", "plan", "seats", "mrr", "signup_year", "tags"];
const OPS: { value: Comparator; label: string }[] = [
  { value: "eq", label: "is" },
  { value: "neq", label: "is not" },
  { value: "gt", label: ">" },
  { value: "gte", label: ">=" },
  { value: "lt", label: "<" },
  { value: "lte", label: "<=" },
  { value: "contains", label: "contains" },
];

function useEngine() {
  const idRef = useRef(0);
  const idGen = useCallback(() => `n${++idRef.current}`, []);
  const [history, setHistory] = useState<History>(() => {
    // Seed with the JD's own example: country is US and (plan is Scale or seats > 10)
    // Seed ids use an "s" prefix so they never collide with idGen's "n" ids.
    let s = 0;
    const seedId = () => `s${++s}`;
    const c = (field: string, op: Comparator, value: ConditionNode["value"]): ConditionNode => ({
      kind: "condition",
      id: seedId(),
      field,
      op,
      value,
    });
    const tree: ConditionTree = {
      kind: "group",
      id: seedId(),
      op: "and",
      children: [
        c("country", "eq", "US"),
        {
          kind: "group",
          id: seedId(),
          op: "or",
          children: [c("plan", "eq", "Scale"), c("seats", "gt", 10)],
        },
      ],
    };
    return createHistory(tree, { now: Date.now, coalesceMs: 500, limit: 50 });
  });

  const commit = useCallback(
    (fn: (t: ConditionTree) => ConditionTree, label: string, coalesceKey: string | null = null) =>
      setHistory((h) => apply(h, fn(h.present.tree), label, coalesceKey)),
    [],
  );

  return { history, setHistory, commit, idGen };
}

export default function ConditionTreeDemo({ embed = false }: { embed?: boolean }) {
  const { history, setHistory, commit, idGen } = useEngine();
  const tree = history.present.tree;
  const issues = useMemo(() => validate(tree), [tree]);
  const issueIds = useMemo(() => new Set(issues.map((i) => i.nodeId)), [issues]);
  const wire = useMemo(() => JSON.stringify(serialize(tree), null, 2), [tree]);
  const expression = useMemo(() => toExpression(tree), [tree]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "z") return;
      e.preventDefault();
      setHistory((h) => (e.shiftKey ? redo(h) : undo(h)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setHistory]);

  const newCondition = (): ConditionNode => ({
    kind: "condition",
    id: idGen(),
    field: "",
    op: "eq",
    value: "",
  });

  return (
    <main className="min-h-screen bg-black text-neutral-200 selection:bg-indigo-400/30">
      {/* breathing light field */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background: `radial-gradient(60% 45% at 50% 0%, ${ACCENT}14, transparent 70%)`,
        }}
      />
      <div
        className={
          embed
            ? "relative mx-auto max-w-6xl px-6 py-8"
            : "relative mx-auto max-w-6xl px-6 py-16 md:py-24"
        }
      >
        <header className={embed ? "hidden" : "mb-12"}>
          <p className="font-mono text-[11px] tracking-[0.35em] text-neutral-500 uppercase">
            Exhibit - Condition Tree Engine
          </p>
          <h1 className="mt-4 text-3xl md:text-5xl font-medium tracking-tight text-neutral-50">
            Build an audience.
            <span className="text-neutral-500"> Undo freely.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-neutral-400 leading-relaxed">
            A pure-TypeScript engine for nested AND/OR condition trees - immutable
            operations, command-history undo/redo with coalescing, validation, and a
            canonical serialized form. The UI below only renders and dispatches; every
            edit you make flows through the engine.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* builder */}
          <section className="rounded-2xl border border-neutral-800/80 bg-neutral-950/60 backdrop-blur p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <p className="font-mono text-[11px] tracking-[0.25em] text-neutral-500 uppercase">
                Builder
              </p>
              <div className="flex items-center gap-2">
                <HistoryButton
                  label="Undo"
                  hint="⌘Z"
                  disabled={!canUndo(history)}
                  count={history.past.length}
                  onClick={() => setHistory(undo)}
                />
                <HistoryButton
                  label="Redo"
                  hint="⇧⌘Z"
                  disabled={!canRedo(history)}
                  count={history.future.length}
                  onClick={() => setHistory(redo)}
                />
              </div>
            </div>
            <Group
              node={tree}
              isRoot
              issueIds={issueIds}
              onOp={(id, op) => commit((t) => setGroupOp(t, id, op), "Toggle group")}
              onAddCondition={(id) =>
                commit((t) => addNode(t, id, newCondition()), "Add condition")
              }
              onAddGroup={(id) =>
                commit(
                  (t) =>
                    addNode(t, id, {
                      kind: "group",
                      id: idGen(),
                      op: "or",
                      children: [newCondition()],
                    }),
                  "Add group",
                )
              }
              onRemove={(id) => commit((t) => removeNode(t, id), "Remove")}
              onDuplicate={(id) => commit((t) => duplicateNode(t, id, idGen), "Duplicate")}
              onWrap={(id) => commit((t) => groupNodes(t, [id], "or", idGen), "Group")}
              onEdit={(id, patch) =>
                commit((t) => updateCondition(t, id, patch), "Edit condition", `edit:${id}`)
              }
            />
            <div className="mt-5 flex items-center justify-between border-t border-neutral-800/60 pt-4">
              <button
                onClick={() => commit((t) => normalize(t), "Normalize")}
                className="font-mono text-[11px] tracking-widest uppercase text-neutral-400 hover:text-neutral-100 transition-colors"
              >
                Normalize to canonical form
              </button>
              <p className="font-mono text-[11px] text-neutral-600">
                edits within 500ms coalesce into one undo step
              </p>
            </div>
          </section>

          {/* live output */}
          <section className="flex flex-col gap-6">
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/60 p-5">
              <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-neutral-500 uppercase">
                Reads as
              </p>
              <p className="text-lg leading-relaxed text-neutral-100">{expression}</p>
              {issues.length > 0 && (
                <ul className="mt-4 space-y-1">
                  {issues.map((i, k) => (
                    <li key={k} className="font-mono text-[12px] text-amber-400/90">
                      {i.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="min-h-0 grow rounded-2xl border border-neutral-800/80 bg-neutral-950/60 p-5">
              <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-neutral-500 uppercase">
                Canonical serialized form - v1
              </p>
              <pre className="max-h-105 overflow-auto font-mono text-[12px] leading-relaxed text-neutral-400">
                {wire}
              </pre>
            </div>
          </section>
        </div>

        <footer
          className={`${embed ? "mt-8" : "mt-14"} border-t border-neutral-800/60 pt-6 flex flex-wrap items-center gap-x-6 gap-y-2`}
        >
          {[
            "Pure TypeScript, zero dependencies",
            "Immutable ops with structural sharing",
            "Injected ids + clock",
            "18 tests under node:test",
          ].map((line) => (
            <p key={line} className="font-mono text-[11px] tracking-wider text-neutral-500">
              {line}
            </p>
          ))}
        </footer>
      </div>
    </main>
  );
}

function HistoryButton({
  label,
  hint,
  count,
  disabled,
  onClick,
}: {
  label: string;
  hint: string;
  count: number;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="group flex items-center gap-2 rounded-lg border border-neutral-800 px-3 py-1.5 font-mono text-[11px] tracking-widest uppercase text-neutral-300 transition-colors enabled:hover:border-indigo-400/50 enabled:hover:text-white disabled:opacity-30"
    >
      {label}
      <span className="text-neutral-600 group-enabled:group-hover:text-indigo-300">
        {count}
      </span>
      <span className="hidden md:inline text-neutral-700">{hint}</span>
    </button>
  );
}

interface GroupHandlers {
  issueIds: Set<string>;
  onOp: (id: string, op: GroupNode["op"]) => void;
  onAddCondition: (id: string) => void;
  onAddGroup: (id: string) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onWrap: (id: string) => void;
  onEdit: (id: string, patch: Partial<Omit<ConditionNode, "kind" | "id">>) => void;
}

function Group({
  node,
  isRoot = false,
  ...h
}: { node: GroupNode; isRoot?: boolean } & GroupHandlers) {
  return (
    <div
      className={
        isRoot
          ? ""
          : "rounded-xl border border-neutral-800/70 bg-neutral-900/30 p-3 mt-2"
      }
    >
      <div className="flex items-center gap-2">
        <button
          onClick={() => h.onOp(node.id, node.op === "and" ? "or" : "and")}
          className="rounded-md px-2 py-0.5 font-mono text-[11px] tracking-widest uppercase transition-colors"
          style={{ color: ACCENT, background: `${ACCENT}1a` }}
          title="Toggle AND/OR"
        >
          {node.op}
        </button>
        <span className="font-mono text-[11px] text-neutral-600">
          {node.children.length} {node.children.length === 1 ? "clause" : "clauses"}
        </span>
        {!isRoot && <NodeActions id={node.id} {...h} wrappable={false} />}
      </div>
      <div className={isRoot ? "mt-2" : "mt-1"}>
        {node.children.map((child) => (
          <TreeRow key={child.id} node={child} {...h} />
        ))}
      </div>
      <div className="mt-2 flex gap-4 pl-1">
        <AddButton onClick={() => h.onAddCondition(node.id)} label="+ condition" />
        <AddButton onClick={() => h.onAddGroup(node.id)} label="+ group" />
      </div>
    </div>
  );
}

function TreeRow({ node, ...h }: { node: TreeNode } & GroupHandlers) {
  if (node.kind === "group") return <Group node={node} {...h} />;
  const invalid = h.issueIds.has(node.id);
  return (
    <div
      className={`mt-2 flex flex-wrap items-center gap-2 rounded-lg border px-2 py-1.5 transition-colors ${
        invalid ? "border-amber-400/40" : "border-neutral-800/60"
      } bg-neutral-900/40`}
    >
      <select
        value={node.field}
        onChange={(e) => h.onEdit(node.id, { field: e.target.value })}
        className="bg-transparent font-mono text-[13px] text-neutral-200 outline-none"
      >
        <option value="" disabled className="bg-neutral-900">
          field…
        </option>
        {FIELDS.map((f) => (
          <option key={f} value={f} className="bg-neutral-900">
            {f}
          </option>
        ))}
      </select>
      <select
        value={node.op}
        onChange={(e) => h.onEdit(node.id, { op: e.target.value as Comparator })}
        className="bg-transparent font-mono text-[13px] text-neutral-400 outline-none"
      >
        {OPS.map((o) => (
          <option key={o.value} value={o.value} className="bg-neutral-900">
            {o.label}
          </option>
        ))}
      </select>
      <input
        value={String(node.value)}
        onChange={(e) => {
          const raw = e.target.value;
          const num = Number(raw);
          h.onEdit(node.id, { value: raw !== "" && !Number.isNaN(num) ? num : raw });
        }}
        placeholder="value…"
        className="w-24 grow bg-transparent font-mono text-[13px] text-neutral-100 outline-none placeholder:text-neutral-600"
      />
      <NodeActions id={node.id} {...h} wrappable />
    </div>
  );
}

function NodeActions({
  id,
  wrappable,
  onRemove,
  onDuplicate,
  onWrap,
}: { id: string; wrappable: boolean } & Pick<
  GroupHandlers,
  "onRemove" | "onDuplicate" | "onWrap"
>) {
  const cls =
    "font-mono text-[11px] text-neutral-600 hover:text-neutral-200 transition-colors";
  return (
    <span className="ml-auto flex items-center gap-3">
      {wrappable && (
        <button className={cls} onClick={() => onWrap(id)} title="Wrap in a group">
          group
        </button>
      )}
      <button className={cls} onClick={() => onDuplicate(id)} title="Duplicate">
        dup
      </button>
      <button className={cls} onClick={() => onRemove(id)} title="Remove">
        ×
      </button>
    </span>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="font-mono text-[11px] tracking-widest uppercase text-neutral-500 hover:text-indigo-300 transition-colors"
    >
      {label}
    </button>
  );
}
