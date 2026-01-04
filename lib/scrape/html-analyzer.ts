/**
 * HTML 구조 분석 및 섹션 분할 로직
 */

import {
  DOMNode,
  DOMSection,
  CATEGORY_HINTS,
  SEMANTIC_PRIORITY,
  FramerElementInfo,
} from "./types";
import { inferCategoryFromFramerName } from "./framer-extractor";

/**
 * DOM 노드에서 CSS 선택자 생성
 */
function buildSelector(node: DOMNode): string {
  let selector = node.tag;
  if (node.id) {
    selector += `#${node.id}`;
  } else if (node.className) {
    const firstClass = node.className.split(" ")[0];
    if (firstClass && !firstClass.includes(":")) {
      selector += `.${firstClass}`;
    }
  }
  return selector;
}

/**
 * DOM 노드의 텍스트에서 카테고리 추론
 */
function inferCategory(node: DOMNode, framerName?: string): string | null {
  if (framerName) {
    const framerCategory = inferCategoryFromFramerName(framerName);
    if (framerCategory) {
      return framerCategory;
    }
  }

  const textToSearch = [node.tag, node.id, node.className]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  for (const [category, hints] of Object.entries(CATEGORY_HINTS)) {
    if (hints.some((hint) => textToSearch.includes(hint))) {
      return category;
    }
  }

  return null;
}

/**
 * Framer 요소 정보를 사용하여 DOM 섹션의 카테고리를 보강
 */
export function enhanceSectionsWithFramerData(
  sections: DOMSection[],
  framerElements: FramerElementInfo[]
): DOMSection[] {
  if (framerElements.length === 0) {
    return sections;
  }

  return sections.map((section) => {
    if (section.category) {
      return section;
    }

    const relatedFramerEl = framerElements.find((el) => {
      if (el.framerName) {
        const sectionText = [section.tag, section.selector].join(" ").toLowerCase();
        return sectionText.includes(el.framerName.toLowerCase());
      }
      return false;
    });

    if (relatedFramerEl?.framerName) {
      const framerCategory = inferCategoryFromFramerName(relatedFramerEl.framerName);
      if (framerCategory) {
        return {
          ...section,
          category: framerCategory,
          confidence: 0.85,
        };
      }
    }

    return section;
  });
}

/**
 * DOM 트리에서 섹션 분할
 */
export function analyzeDOM(domTree: DOMNode): DOMSection[] {
  const sections: DOMSection[] = [];
  const coveredRanges: { start: number; end: number }[] = [];

  function findSemanticSections(node: DOMNode, depth: number = 0): void {
    const isSemanticTag = SEMANTIC_PRIORITY.includes(node.tag);
    const hasSignificantHeight = node.rect.height > 100;

    if (isSemanticTag && hasSignificantHeight) {
      const selector = buildSelector(node);
      const category = inferCategory(node);

      sections.push({
        index: sections.length,
        tag: node.tag,
        selector,
        category,
        rect: {
          top: node.rect.top,
          height: node.rect.height,
        },
        confidence: node.tag === "section" ? 0.9 : 0.8,
      });

      coveredRanges.push({
        start: node.rect.top,
        end: node.rect.top + node.rect.height,
      });

      if (node.tag !== "main") {
        return;
      }
    }

    for (const child of node.children) {
      findSemanticSections(child, depth + 1);
    }
  }

  findSemanticSections(domTree);

  function findGaps(node: DOMNode, depth: number = 0): void {
    if (node.rect.height < 200 || depth > 5) return;

    const nodeStart = node.rect.top;
    const nodeEnd = nodeStart + node.rect.height;

    const isCovered = coveredRanges.some(
      (range) => nodeStart >= range.start && nodeEnd <= range.end
    );

    if (!isCovered && node.tag === "div" && node.rect.height > 300) {
      const hasSemanticChild = node.children.some((c) =>
        SEMANTIC_PRIORITY.includes(c.tag)
      );

      if (!hasSemanticChild) {
        const selector = buildSelector(node);
        sections.push({
          index: sections.length,
          tag: node.tag,
          selector,
          category: inferCategory(node),
          rect: {
            top: node.rect.top,
            height: node.rect.height,
          },
          confidence: 0.5,
        });

        coveredRanges.push({
          start: nodeStart,
          end: nodeEnd,
        });
      }
    }

    for (const child of node.children) {
      findGaps(child, depth + 1);
    }
  }

  findGaps(domTree);

  sections.sort((a, b) => a.rect.top - b.rect.top);
  sections.forEach((s, i) => {
    s.index = i;
  });

  return deduplicateSections(sections);
}

/**
 * 겹치는 섹션 제거
 */
function deduplicateSections(sections: DOMSection[]): DOMSection[] {
  const result: DOMSection[] = [];

  for (const section of sections) {
    const overlapping = result.find((existing) => {
      const overlapStart = Math.max(existing.rect.top, section.rect.top);
      const overlapEnd = Math.min(
        existing.rect.top + existing.rect.height,
        section.rect.top + section.rect.height
      );
      const overlapHeight = overlapEnd - overlapStart;

      const minHeight = Math.min(existing.rect.height, section.rect.height);
      return overlapHeight > minHeight * 0.5;
    });

    if (overlapping) {
      if (section.confidence > overlapping.confidence) {
        const idx = result.indexOf(overlapping);
        result[idx] = section;
      }
    } else {
      result.push(section);
    }
  }

  result.forEach((s, i) => {
    s.index = i;
  });

  return result;
}
