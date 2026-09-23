/**
 * RAG retrieval eval (offline): runs fixed queries through the mock parser +
 * product layer (snapshot or DB, whichever is active) and asserts expected
 * product ids are recalled. Run: npx tsx scripts/eval-rag.ts
 * Exit 0 = all pass. Re-run before prompt/parser/model changes.
 */
import { parseMessage } from "../src/lib/chat";
import { queryProducts } from "../src/lib/products";

interface EvalCase {
  query: string;
  expectAny: number[];
  minRecall?: number;
}

const CASES: EvalCase[] = [
  { query: "jacket under $50", expectAny: [16, 17] },
  { query: "Men's clothing", expectAny: [1, 2, 3, 4, 29, 32] },
  { query: "toys for kids", expectAny: [25, 26, 28] },
  { query: "something for seniors", expectAny: [35, 36, 37, 38] },
  { query: "gifts for teenagers", expectAny: [27, 29, 30, 31, 32] },
  { query: "cheap electronics", expectAny: [9] },
  { query: "Top rated", expectAny: [25, 28, 38, 11] },
  { query: "Under $50", expectAny: [25, 18, 23, 28, 38, 21, 2, 16, 17, 22, 35] },
  { query: "kids shoes under $40", expectAny: [] },
  { query: "board games", expectAny: [27] },
  { query: "jackets", expectAny: [16, 17, 21] },
];

async function main(): Promise<void> {
  let passed = 0;
  for (const c of CASES) {
    const parsed = parseMessage(c.query);
    const products = await queryProducts(parsed.filters);
    const ids = new Set(products.map((p) => p.id));
    const hits = c.expectAny.filter((id) => ids.has(id));
    const need = c.minRecall ?? (c.expectAny.length === 0 ? 0 : 1);
    const ok =
      c.expectAny.length === 0 ? products.length === 0 : hits.length >= need;
    if (ok) passed++;
    console.log(
      `${ok ? "PASS" : "FAIL"}  ${JSON.stringify(c.query)} → [${products.map((p) => p.id).join(",")}]` +
        (ok ? "" : `  expected any of [${c.expectAny.join(",")}]`)
    );
  }
  console.log(`\n${passed}/${CASES.length} passed`);
  if (passed !== CASES.length) process.exit(1);
}

main().catch((e: unknown) => {
  console.error(e instanceof Error ? e.message : String(e));
  process.exit(1);
});
