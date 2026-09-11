import { _ as _plugin_vue_export_helper_default, b as useComponentProps, d as useAppConfig, v as vue_exports, t as tv, s as server_renderer_exports, P as Primitive, k as useVModel, h as useFormField, o as useFieldGroup, p as useComponentIcons, j as _sfc_main$5, i as _sfc_main$3, c as useLocale, e as useForwardProps, r as reactivePick, f as usePortal, g as createReusableTemplate, D as isArrayOfArray, E as compare$1, G as get, H as _sfc_main$4, a as _sfc_main$6, F as FieldGroupReset, I as defineKeyedFunctionFactory, J as dataDiagnostics, K as fetchDefaults, L as useAsyncData, M as useRequestFetch, N as useRoute, O as NuxtLink, Q as usePrimitiveElement, m as useForwardExpose, R as looseToNumber, S as getDisplayValue, T as Teleport_default, n as Presence_default, U as getActiveElement, W as AUTOFOCUS_ON_UNMOUNT, X as focus, $ as $fetch$2, Y as injectConfigProviderContext, w as createContext, Z as useCollection, C as createEventHook, y as useForwardProps$1, l as useEmitAsProps, a0 as AUTOFOCUS_ON_MOUNT, a1 as focusFirst, a2 as getTabbableCandidates, a3 as EVENT_OPTIONS, a4 as getTabbableEdges, a5 as useParentElement, A as refAutoReset, a6 as require_shared_cjs_prod, a7 as unrefElement, a8 as tryOnBeforeUnmount, a9 as onKeyStroke, aa as isNullish, ab as createGlobalState, z as createSharedComposable, V as VisuallyHidden_default, ac as __exportAll, ad as __reExport } from '../virtual/entry.mjs';
import { G as defu, H as isEqual } from '../_/nitro.mjs';

//#region src/index.ts
/**
* Compute the 64-bit FNV-1a hash of a string as two 32-bit lanes.
*
* This is the fast core: no BigInt, no allocations, plain `Math.imul`-free
* 32-bit arithmetic. Prefer {@link fnv1a64Hex} or {@link fnv1a64Base36} for a
* usable key; use this directly only when you want to avoid string formatting.
*
* The hash is computed over UTF-16 code units (`str.charCodeAt(i)`), not UTF-8
* bytes. For ASCII input this matches a canonical FNV-1a-64; for non-ASCII it
* does not. See the README for details.
*
* @param str - The string to hash.
* @returns The `{ high, low }` 32-bit lanes of the 64-bit hash.
*/
function fnv1a64(str) {
	const len = str.length;
	let i = 0;
	let t0 = 0;
	let v0 = 8997;
	let t1 = 0;
	let v1 = 33826;
	let t2 = 0;
	let v2 = 40164;
	let t3 = 0;
	let v3 = 52210;
	while (i < len) {
		v0 ^= str.charCodeAt(i++);
		t0 = v0 * 435;
		t1 = v1 * 435;
		t2 = v2 * 435;
		t3 = v3 * 435;
		t2 += v0 << 8;
		t3 += v1 << 8;
		t1 += t0 >>> 16;
		v0 = t0 & 65535;
		t2 += t1 >>> 16;
		v1 = t1 & 65535;
		v3 = t3 + (t2 >>> 16) & 65535;
		v2 = t2 & 65535;
	}
	return {
		high: (v3 << 16 | v2) >>> 0,
		low: (v1 << 16 | v0) >>> 0
	};
}
/**
* Compute the 64-bit FNV-1a hash of a string as a `bigint`.
*
* Ergonomic and comparable, at the cost of composing the two lanes into a
* `bigint`. For a compact string key, prefer {@link fnv1a64Base36}.
*
* @param str - The string to hash.
* @returns The 64-bit hash as an unsigned `bigint`.
*/
function fnv1a64BigInt(str) {
	const { high, low } = fnv1a64(str);
	return BigInt(high) << 32n | BigInt(low);
}
const hexDigits = "0123456789abcdef";
/**
* Every byte value rendered as its two hex digits, so a 32-bit lane formats in
* 4 lookups instead of `toString(16)` plus a `padStart`. Leading zeros are
* intrinsic to the table, which is what makes the padding free.
*/
Array.from({ length: 256 }, (_, i) => hexDigits.charAt(i >> 4) + hexDigits.charAt(i & 15));
/**
* Compute the 64-bit FNV-1a hash of a string as a base36 string.
*
* This is the shortest textual form (up to 13 characters) and is ideal for
* cache keys. The length varies with the value; it is not zero-padded. Equal
* inputs always produce identical strings.
*
* @param str - The string to hash.
* @returns A base36 string of the 64-bit hash.
*/
function fnv1a64Base36(str) {
	return fnv1a64BigInt(str).toString(36);
}

function walk(input, seen) {
	if (input === null) return "L";
	let out, i = 0, keys = input, tmp = typeof input;
	if (tmp !== "object") {
		if (tmp === "number") return input - input === 0 ? "n" + input : "L";
		if (tmp === "string") return "s" + input;
		if (tmp === "bigint") return "n" + input;
		if (tmp === "boolean") return input ? "T" : "F";
		return;
	}
	let is_arr = Array.isArray(input);
	if (!is_arr) {
		if (input instanceof Date) return "d" + +input;
		if (input instanceof RegExp) return "r" + input.source + input.flags;
	}
	tmp = seen.indexOf(input);
	if (~tmp) return "~" + (tmp + 1);
	if (typeof input.toJSON === "function" && !ArrayBuffer.isView(input)) {
		input = input.toJSON();
		if (input === null || typeof input !== "object") return walk(input, seen);
		tmp = seen.indexOf(input);
		if (~tmp) return "~" + (tmp + 1);
		is_arr = Array.isArray(input);
	}
	seen.push(keys);
	if (is_arr) {
		for (out = "a"; i < input.length; out += (tmp = walk(input[i++], seen)) === undefined ? "L" : tmp);
	} else if (input instanceof Set) {
		out = "e";
		for (let value of input) out += (tmp = walk(value, seen)) === undefined ? "L" : tmp;
	} else if (input instanceof Map) {
		keys = [...input.keys()];
		if (keys.length > 1) keys.sort();
		for (out = "o"; i < keys.length; i++) {
			if ((tmp = walk(input.get(keys[i]), seen)) !== undefined) out += keys[i] + tmp;
		}
	} else if (input[Symbol.toStringTag] === undefined || ArrayBuffer.isView(input)) {
		keys = Object.keys(input);
		if (keys.length > 1) keys.sort();
		for (out = "o"; i < keys.length; i++) {
			if ((tmp = walk(input[keys[i]], seen)) !== undefined) out += keys[i] + tmp;
		}
	} else {
		throw new Error("Unsupported value");
	}
	seen.pop();
	return out;
}
/**
* Canonicalize a value into a stable identity string. Two structurally-equal
* inputs return the same id, regardless of key order.
*
* @example
* ```ts
* identify({ a: 1, b: 2 }) === identify({ b: 2, a: 1 }); // true
* ```
*/
function identify(input) {
	return walk(input, []) ?? "U";
}

//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/arrays.js
/**
* The function `findValuesBetween` takes an array and two values, then returns a subarray containing
* elements between the first occurrence of the start value and the first occurrence of the end value
* in the array.
* @param {T[]} array - The `array` parameter is an array of values of type `T`.
* @param {T} start - The `start` parameter is the value that marks the beginning of the range you want
* to find in the array.
* @param {T} end - The `end` parameter in the `findValuesBetween` function represents the end value
* that you want to find in the array. This function will return a subarray of values that are between
* the `start` and `end` values in the original array.
* @returns The `findValuesBetween` function returns an array of values from the input array that are
* between the `start` and `end` values (inclusive). If either the `start` or `end` values are not
* found in the input array, an empty array is returned.
*/
function findValuesBetween(array, start, end) {
	const startIndex = array.findIndex((i) => isEqual(i, start));
	const endIndex = array.findIndex((i) => isEqual(i, end));
	if (startIndex === -1 || endIndex === -1) return [];
	const [minIndex, maxIndex] = [startIndex, endIndex].sort((a, b) => a - b);
	return array.slice(minIndex, maxIndex + 1);
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/handleAndDispatchCustomEvent.js
function handleAndDispatchCustomEvent(name, handler, detail) {
	const target = detail.originalEvent.target;
	const event = new CustomEvent(name, {
		bubbles: false,
		cancelable: true,
		detail
	});
	if (handler) target.addEventListener(name, handler, { once: true });
	target.dispatchEvent(event);
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/DismissableLayer/context.js
var context = /*#__PURE__*/ (0, vue_exports.reactive)({
	layersRoot: /* @__PURE__ */ new Set(),
	layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
	originalBodyPointerEvents: void 0,
	branches: /* @__PURE__ */ new Set()
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useBodyScrollLock.js
var useBodyLockStackCount = createSharedComposable(() => {
	const map = (0, vue_exports.ref)(/* @__PURE__ */ new Map());
	(0, vue_exports.ref)();
	const locked = (0, vue_exports.computed)(() => {
		for (const value of map.value.values()) if (value) return true;
		return false;
	});
	injectConfigProviderContext({ scrollBody: (0, vue_exports.ref)(true) });
	(0, vue_exports.watch)(locked, (val, oldVal) => {}, {
		immediate: true,
		flush: "sync"
	});
	return map;
});
function useBodyScrollLock(initialState) {
	const id = Math.random().toString(36).substring(2, 7);
	const map = useBodyLockStackCount();
	map.value.set(id, initialState ?? false);
	const locked = (0, vue_exports.computed)({
		get: () => map.value.get(id) ?? false,
		set: (value) => map.value.set(id, value)
	});
	tryOnBeforeUnmount();
	return locked;
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useComposing.js
var imeScriptRE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Bopomofo}]/u;
function useComposing(onEnd) {
	const isComposing = (0, vue_exports.ref)(false);
	const isImeComposition = (0, vue_exports.ref)(true);
	const sawImeScript = (0, vue_exports.ref)(false);
	const shouldDeferInput = (0, vue_exports.computed)(() => isComposing.value && isImeComposition.value);
	function handleCompositionStart() {
		isComposing.value = true;
		isImeComposition.value = true;
		sawImeScript.value = false;
	}
	function handleCompositionUpdate(event) {
		if (!event.data) return;
		if (imeScriptRE.test(event.data)) {
			isImeComposition.value = true;
			sawImeScript.value = true;
		}
	}
	function handleCompositionEnd(event) {
		(0, vue_exports.nextTick)(() => {
			isComposing.value = false;
			onEnd?.(event);
		});
	}
	return {
		isComposing,
		shouldDeferInput,
		handleCompositionStart,
		handleCompositionUpdate,
		handleCompositionEnd
	};
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useDirection.js
/**
* The `useDirection` function provides a way to access the current direction in your application.
* @param {Ref<Direction | undefined>} [dir] - An optional ref containing the direction (ltr or rtl).
* @returns  computed value that combines with the resolved direction.
*/
function useDirection(dir) {
	const context = injectConfigProviderContext({ dir: (0, vue_exports.ref)("ltr") });
	return (0, vue_exports.computed)(() => dir?.value || context.dir?.value || "ltr");
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useFilter.js
/**
* Provides locale-aware string filtering functions.
* Uses `Intl.Collator` for comparison to ensure proper Unicode handling.
*
* @param options - Optional collator options to customize comparison behavior.
*   See [Intl.CollatorOptions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator#options) for details.
* @returns An object with methods to check if a string starts with, ends with, or contains a substring.
*
* @example
* const { startsWith, endsWith, contains } = useFilter();
*
* startsWith('hello', 'he'); // true
* endsWith('hello', 'lo'); // true
* contains('hello', 'ell'); // true
*/
function useFilter$1(options) {
	const computedOptions = (0, vue_exports.computed)(() => (0, vue_exports.unref)(options));
	const collator = (0, vue_exports.computed)(() => new Intl.Collator("en", {
		usage: "search",
		...computedOptions.value
	}));
	const startsWith = (string, substring) => {
		if (substring.length === 0) return true;
		string = string.normalize("NFC");
		substring = substring.normalize("NFC");
		return collator.value.compare(string.slice(0, substring.length), substring) === 0;
	};
	const endsWith = (string, substring) => {
		if (substring.length === 0) return true;
		string = string.normalize("NFC");
		substring = substring.normalize("NFC");
		return collator.value.compare(string.slice(-substring.length), substring) === 0;
	};
	const contains = (string, substring) => {
		if (substring.length === 0) return true;
		string = string.normalize("NFC");
		substring = substring.normalize("NFC");
		let scan = 0;
		const sliceLen = substring.length;
		for (; scan + sliceLen <= string.length; scan++) {
			const slice = string.slice(scan, scan + sliceLen);
			if (collator.value.compare(substring, slice) === 0) return true;
		}
		return false;
	};
	return {
		startsWith,
		endsWith,
		contains
	};
}
/**
* Injects a pair of focus guards at the edges of the whole DOM tree
* to ensure `focusin` & `focusout` events can be caught consistently.
*/
function useFocusGuards() {
	(0, vue_exports.watchEffect)((cleanupFn) => {});
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useFormControl.js
function useFormControl(el) {
	return (0, vue_exports.computed)(() => (0, vue_exports.toValue)(el) ? Boolean(unrefElement(el)?.closest("form")) : true);
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useForwardPropsEmits.js
function useForwardPropsEmits(props, emit) {
	const parsedProps = useForwardProps$1(props);
	const emitsAsProps = emit ? useEmitAsProps(emit) : {};
	return (0, vue_exports.computed)(() => ({
		...parsedProps.value,
		...emitsAsProps
	}));
}
/**
* Marks everything except given node(or nodes) as aria-hidden
* @param {Element | Element[]} originalTarget - elements to keep on the page
* @param [parentNode] - top element, defaults to document.body
* @param {String} [markerName] - a special attribute to mark every node
* @return {Undo} undo command
*/
var hideOthers = function(originalTarget, parentNode, markerName) {
	Array.from(Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
	return function() {
		return null;
	};
};
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useHideOthers.js
/**
* The `useHideOthers` function is a TypeScript function that takes a target element reference and
* hides all other elements in ARIA when the target element is present, and restores the visibility of the
* hidden elements when the target element is removed.
* @param {MaybeElementRef} target - The `target` parameter is a reference to the element that you want
* to hide other elements when it is clicked or focused.
*/
function useHideOthers(target) {
	let undo;
	(0, vue_exports.watch)(() => unrefElement(target), (el) => {
		let isInsideClosedPopover = false;
		try {
			isInsideClosedPopover = !!el?.closest("[popover]:not(:popover-open)");
		} catch {}
		if (el && !isInsideClosedPopover) undo = hideOthers(el);
		else if (undo) undo();
	});
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useId.js
var count = 0;
/**
* The `useId` function generates a unique identifier using a provided deterministic ID,
* a configured `<ConfigProvider>` ID source, Vue's native `useId`, or a fallback counter.
* @param {string | null | undefined} [deterministicId] - The `useId` function you provided takes an
* optional parameter `deterministicId`, which can be a string, null, or undefined. If
* `deterministicId` is provided, the function will return it. Otherwise, it will generate an id using
* the configured ID source.
*/
function useId(deterministicId, prefix = "reka") {
	let id;
	const configProviderContext = injectConfigProviderContext({ useId: void 0 });
	if (configProviderContext.useId) id = configProviderContext.useId();
	else if ("useId" in vue_exports) id = vue_exports.useId?.();
	else id = `${++count}`;
	return prefix ? `${prefix}-${id}` : id;
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useKbd.js
function useKbd() {
	return {
		ALT: "Alt",
		ARROW_DOWN: "ArrowDown",
		ARROW_LEFT: "ArrowLeft",
		ARROW_RIGHT: "ArrowRight",
		ARROW_UP: "ArrowUp",
		BACKSPACE: "Backspace",
		CAPS_LOCK: "CapsLock",
		CONTROL: "Control",
		DELETE: "Delete",
		END: "End",
		ENTER: "Enter",
		ESCAPE: "Escape",
		F1: "F1",
		F10: "F10",
		F11: "F11",
		F12: "F12",
		F2: "F2",
		F3: "F3",
		F4: "F4",
		F5: "F5",
		F6: "F6",
		F7: "F7",
		F8: "F8",
		F9: "F9",
		HOME: "Home",
		META: "Meta",
		PAGE_DOWN: "PageDown",
		PAGE_UP: "PageUp",
		SHIFT: "Shift",
		SPACE: " ",
		TAB: "Tab",
		CTRL: "Control",
		ASTERISK: "*",
		SPACE_CODE: "Space"
	};
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useSize.js
function useSize(element) {
	const size = (0, vue_exports.ref)();
	return {
		width: (0, vue_exports.computed)(() => size.value?.width ?? 0),
		height: (0, vue_exports.computed)(() => size.value?.height ?? 0)
	};
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useTypeahead.js
function useTypeahead(callback) {
	const search = refAutoReset("", 1e3);
	const handleTypeaheadSearch = (key, items) => {
		search.value = search.value + key;
		{
			const currentItem = getActiveElement();
			const itemsWithTextValue = items.map((item) => ({
				...item,
				textValue: item.value?.textValue ?? item.ref.textContent?.trim() ?? ""
			}));
			const currentMatch = itemsWithTextValue.find((item) => item.ref === currentItem);
			const nextMatch = getNextMatch(itemsWithTextValue.map((item) => item.textValue), search.value, currentMatch?.textValue);
			const newItem = itemsWithTextValue.find((item) => item.textValue === nextMatch);
			if (newItem) newItem.ref.focus();
			return newItem?.ref;
		}
	};
	const resetTypeahead = () => {
		search.value = "";
	};
	return {
		search,
		handleTypeaheadSearch,
		resetTypeahead
	};
}
/**
* Wraps an array around itself at a given start index
* Example: `wrapArray(['a', 'b', 'c', 'd'], 2) === ['c', 'd', 'a', 'b']`
*/
function wrapArray(array, startIndex) {
	return array.map((_, index) => array[(startIndex + index) % array.length]);
}
/**
* This is the "meat" of the typeahead matching logic. It takes in all the values,
* the search and the current match, and returns the next match (or `undefined`).
*
* We normalize the search because if a user has repeatedly pressed a character,
* we want the exact same behavior as if we only had that one character
* (ie. cycle through options starting with that character)
*
* We also reorder the values by wrapping the array around the current match.
* This is so we always look forward from the current match, and picking the first
* match will always be the correct one.
*
* Finally, if the normalized search is exactly one character, we exclude the
* current match from the values because otherwise it would be the first to match always
* and focus would never move. This is as opposed to the regular case, where we
* don't want focus to move if the current match still matches.
*/
function getNextMatch(values, search, currentMatch) {
	const normalizedSearch = search.length > 1 && Array.from(search).every((char) => char === search[0]) ? search[0] : search;
	const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1;
	let wrappedValues = wrapArray(values, Math.max(currentMatchIndex, 0));
	if (normalizedSearch.length === 1) wrappedValues = wrappedValues.filter((v) => v !== currentMatch);
	const nextMatch = wrappedValues.find((value) => value.toLowerCase().startsWith(normalizedSearch.toLowerCase()));
	return nextMatch !== currentMatch ? nextMatch : void 0;
}
/**
* Listens for `pointerdown` outside a DOM subtree. We use `pointerdown` rather than `pointerup`
* to mimic layer dismissing behaviour present in OS.
* Returns props to pass to the node we want to check for outside events.
*/
function usePointerDownOutside(onPointerDownOutside, element, enabled = true) {
	element?.value?.ownerDocument ?? globalThis?.document;
	const isPointerInsideDOMTree = (0, vue_exports.ref)(false);
	(0, vue_exports.ref)(() => {});
	(0, vue_exports.watchEffect)((cleanupFn) => {});
	return { onPointerDownCapture: () => {
		if (!(0, vue_exports.toValue)(enabled)) return;
		isPointerInsideDOMTree.value = true;
	} };
}
/**
* Listens for when focus happens outside a DOM subtree.
* Returns props to pass to the root (node) of the subtree we want to check.
*/
function useFocusOutside(onFocusOutside, element, enabled = true) {
	element?.value?.ownerDocument ?? globalThis?.document;
	const isFocusInsideDOMTree = (0, vue_exports.ref)(false);
	(0, vue_exports.watchEffect)((cleanupFn) => {});
	return {
		onFocusCapture: () => {
			if (!(0, vue_exports.toValue)(enabled)) return;
			isFocusInsideDOMTree.value = true;
		},
		onBlurCapture: () => {
			if (!(0, vue_exports.toValue)(enabled)) return;
			isFocusInsideDOMTree.value = false;
		}
	};
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/DismissableLayer/DismissableLayer.js
var DismissableLayer_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "DismissableLayer",
	props: {
		disableOutsidePointerEvents: {
			type: Boolean,
			required: false,
			default: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		},
		present: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"dismiss"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const { forwardRef, currentElement: layerElement } = useForwardExpose();
		const ownerDocument = (0, vue_exports.computed)(() => layerElement.value?.ownerDocument ?? globalThis.document);
		const layers = (0, vue_exports.computed)(() => context.layersRoot);
		const index = (0, vue_exports.computed)(() => {
			return layerElement.value ? Array.from(layers.value).indexOf(layerElement.value) : -1;
		});
		const isBodyPointerEventsDisabled = (0, vue_exports.computed)(() => {
			return context.layersWithOutsidePointerEventsDisabled.size > 0;
		});
		const isPointerEventsEnabled = (0, vue_exports.computed)(() => {
			const localLayers = Array.from(layers.value);
			const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1);
			const highestLayerWithOutsidePointerEventsDisabledIndex = localLayers.indexOf(highestLayerWithOutsidePointerEventsDisabled);
			return index.value >= highestLayerWithOutsidePointerEventsDisabledIndex;
		});
		const pointerDownOutside = usePointerDownOutside(async (event) => {
			const isPointerDownOnBranch = [...context.branches].some((branch) => branch?.contains(event.target));
			if (!props.present || !isPointerEventsEnabled.value || isPointerDownOnBranch) return;
			emits("pointerDownOutside", event);
			emits("interactOutside", event);
			await (0, vue_exports.nextTick)();
			if (!event.defaultPrevented) emits("dismiss");
		}, layerElement, () => props.present);
		const focusOutside = useFocusOutside((event) => {
			const isFocusInBranch = [...context.branches].some((branch) => branch?.contains(event.target));
			if (!props.present || isFocusInBranch) return;
			emits("focusOutside", event);
			emits("interactOutside", event);
			if (!event.defaultPrevented) emits("dismiss");
		}, layerElement);
		onKeyStroke("Escape", (event) => {
			if (!props.present) return;
			if (!(index.value === layers.value.size - 1)) return;
			emits("escapeKeyDown", event);
			if (!event.defaultPrevented) emits("dismiss");
		});
		(0, vue_exports.watch)([
			layerElement,
			() => props.disableOutsidePointerEvents,
			() => props.present
		], ([element, disableOutsidePointerEvents, present], _, onCleanup) => {
			if (!element || !present) return;
			if (disableOutsidePointerEvents) {
				if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
					context.originalBodyPointerEvents = ownerDocument.value.body.style.pointerEvents;
					ownerDocument.value.body.style.pointerEvents = "none";
				}
				context.layersWithOutsidePointerEventsDisabled.add(element);
				onCleanup(() => {
					context.layersWithOutsidePointerEventsDisabled.delete(element);
					if (context.layersWithOutsidePointerEventsDisabled.size === 0 && !isNullish(context.originalBodyPointerEvents)) ownerDocument.value.body.style.pointerEvents = context.originalBodyPointerEvents;
				});
			}
		}, { immediate: true });
		(0, vue_exports.watch)([layerElement, () => props.present], ([element, present], _, onCleanup) => {
			if (!element || !present) return;
			layers.value.add(element);
			onCleanup(() => {
				layers.value.delete(element);
			});
		}, { immediate: true });
		(0, vue_exports.watchEffect)((cleanupFn) => {
			cleanupFn(() => {
				if (!layerElement.value) return;
				layers.value.delete(layerElement.value);
				context.layersWithOutsidePointerEventsDisabled.delete(layerElement.value);
			});
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), {
				ref: (0, vue_exports.unref)(forwardRef),
				"as-child": _ctx.asChild,
				as: _ctx.as,
				"data-dismissable-layer": "",
				style: (0, vue_exports.normalizeStyle)({ pointerEvents: isBodyPointerEventsDisabled.value ? isPointerEventsEnabled.value ? "auto" : "none" : void 0 }),
				onFocusCapture: (0, vue_exports.unref)(focusOutside).onFocusCapture,
				onBlurCapture: (0, vue_exports.unref)(focusOutside).onBlurCapture,
				onPointerdownCapture: (0, vue_exports.unref)(pointerDownOutside).onPointerDownCapture
			}, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 8, [
				"as-child",
				"as",
				"style",
				"onFocusCapture",
				"onBlurCapture",
				"onPointerdownCapture"
			]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/FocusScope/stack.js
var useFocusStackState = createGlobalState(() => {
	return (0, vue_exports.ref)([]);
});
function createFocusScopesStack() {
	/** A stack of focus scopes, with the active one at the top */
	const stack = useFocusStackState();
	return {
		add(focusScope) {
			const activeFocusScope = stack.value[0];
			if (focusScope !== activeFocusScope) activeFocusScope?.pause();
			stack.value = arrayRemove(stack.value, focusScope);
			stack.value.unshift(focusScope);
		},
		remove(focusScope) {
			stack.value = arrayRemove(stack.value, focusScope);
			stack.value[0]?.resume();
		}
	};
}
function arrayRemove(array, item) {
	const updatedArray = [...array];
	const index = updatedArray.indexOf(item);
	if (index !== -1) updatedArray.splice(index, 1);
	return updatedArray;
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/FocusScope/FocusScope.js
var FocusScope_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "FocusScope",
	props: {
		loop: {
			type: Boolean,
			required: false,
			default: false
		},
		trapped: {
			type: Boolean,
			required: false,
			default: false
		},
		present: {
			type: Boolean,
			required: false,
			default: true
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	emits: ["mountAutoFocus", "unmountAutoFocus"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const { currentRef, currentElement } = useForwardExpose();
		(0, vue_exports.ref)(null);
		const focusScopesStack = createFocusScopesStack();
		const focusScope = /*#__PURE__*/ (0, vue_exports.reactive)({
			paused: false,
			pause() {
				this.paused = true;
			},
			resume() {
				this.paused = false;
			}
		});
		(0, vue_exports.watchEffect)((cleanupFn) => {});
		function dispatchMountAutoFocus(container, previouslyFocusedElement) {
			const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS);
			const handleMountAutoFocus = (ev) => emits("mountAutoFocus", ev);
			container.addEventListener(AUTOFOCUS_ON_MOUNT, handleMountAutoFocus);
			container.dispatchEvent(mountEvent);
			container.removeEventListener(AUTOFOCUS_ON_MOUNT, handleMountAutoFocus);
			if (!mountEvent.defaultPrevented) {
				focusFirst(getTabbableCandidates(container), { select: true });
				if (getActiveElement() === previouslyFocusedElement) focus(container);
			}
		}
		(0, vue_exports.watchEffect)(async (cleanupFn) => {
			const container = currentElement.value;
			await (0, vue_exports.nextTick)();
			if (!container) return;
			if (props.present !== false) focusScopesStack.add(focusScope);
			const previouslyFocusedElement = getActiveElement();
			if (!container.contains(previouslyFocusedElement) && props.present !== false) dispatchMountAutoFocus(container, previouslyFocusedElement);
			cleanupFn(() => {
				const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS);
				const unmountEventHandler = (ev) => {
					emits("unmountAutoFocus", ev);
				};
				container.addEventListener(AUTOFOCUS_ON_UNMOUNT, unmountEventHandler);
				container.dispatchEvent(unmountEvent);
				container.setAttribute("data-focus-scope-unmounting", "");
				setTimeout(() => {
					if (!unmountEvent.defaultPrevented) focus(previouslyFocusedElement ?? (void 0).body, { select: true });
					container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, unmountEventHandler);
					focusScopesStack.remove(focusScope);
					container.removeAttribute("data-focus-scope-unmounting");
				}, 0);
			});
		});
		(0, vue_exports.watch)(() => props.present, async (present, prevPresent) => {});
		function handleKeyDown(event) {
			if (!props.loop && !props.trapped) return;
			if (focusScope.paused) return;
			const isTabKey = event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey;
			const focusedElement = getActiveElement();
			if (isTabKey && focusedElement) {
				const container = event.currentTarget;
				const [first, last] = getTabbableEdges(container);
				if (!(first && last)) {
					if (focusedElement === container) event.preventDefault();
				} else if (!event.shiftKey && focusedElement === last) {
					event.preventDefault();
					if (props.loop) focus(first, { select: true });
				} else if (event.shiftKey && focusedElement === first) {
					event.preventDefault();
					if (props.loop) focus(last, { select: true });
				}
			}
		}
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), {
				ref_key: "currentRef",
				ref: currentRef,
				tabindex: "-1",
				"as-child": _ctx.asChild,
				as: _ctx.as,
				onKeydown: handleKeyDown
			}, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 8, ["as-child", "as"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/VisuallyHidden/VisuallyHiddenInputBubble.js
var VisuallyHiddenInputBubble_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	inheritAttrs: false,
	__name: "VisuallyHiddenInputBubble",
	props: {
		name: {
			type: String,
			required: true
		},
		value: {
			type: null,
			required: true
		},
		checked: {
			type: Boolean,
			required: false,
			default: void 0
		},
		required: {
			type: Boolean,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		feature: {
			type: String,
			required: false,
			default: "fully-hidden"
		}
	},
	setup(__props) {
		const props = __props;
		const { primitiveElement, currentElement } = usePrimitiveElement();
		const valueState = (0, vue_exports.computed)(() => props.checked ?? props.value);
		(0, vue_exports.watch)(valueState, (cur, prev) => {
			if (!currentElement.value) return;
			const input = currentElement.value;
			const inputProto = (void 0).HTMLInputElement.prototype;
			const setValue = Object.getOwnPropertyDescriptor(inputProto, "value").set;
			if (setValue && cur !== prev) {
				const inputEvent = new Event("input", { bubbles: true });
				const changeEvent = new Event("change", { bubbles: true });
				setValue.call(input, cur);
				input.dispatchEvent(inputEvent);
				input.dispatchEvent(changeEvent);
			}
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(VisuallyHidden_default, (0, vue_exports.mergeProps)({
				ref_key: "primitiveElement",
				ref: primitiveElement
			}, {
				...props,
				..._ctx.$attrs
			}, { as: "input" }), null, 16);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/VisuallyHidden/VisuallyHiddenInput.js
var VisuallyHiddenInput_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	inheritAttrs: false,
	__name: "VisuallyHiddenInput",
	props: {
		name: {
			type: String,
			required: true
		},
		value: {
			type: null,
			required: true
		},
		checked: {
			type: Boolean,
			required: false,
			default: void 0
		},
		required: {
			type: Boolean,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		feature: {
			type: String,
			required: false,
			default: "fully-hidden"
		}
	},
	setup(__props) {
		const props = __props;
		const isFormArrayEmptyAndRequired = (0, vue_exports.computed)(() => typeof props.value === "object" && Array.isArray(props.value) && props.value.length === 0 && props.required);
		const parsedValue = (0, vue_exports.computed)(() => {
			if (typeof props.value === "string" || typeof props.value === "number" || typeof props.value === "boolean" || props.value === null || props.value === void 0) return [{
				name: props.name,
				value: props.value
			}];
			else if (typeof props.value === "object" && Array.isArray(props.value)) return props.value.flatMap((obj, index) => {
				if (typeof obj === "object") return Object.entries(obj).map(([key, value]) => ({
					name: `${props.name}[${index}][${key}]`,
					value
				}));
				else return {
					name: `${props.name}[${index}]`,
					value: obj
				};
			});
			else if (props.value !== null && typeof props.value === "object" && !Array.isArray(props.value)) return Object.entries(props.value).map(([key, value]) => ({
				name: `${props.name}[${key}]`,
				value
			}));
			return [];
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)(vue_exports.Fragment, null, [(0, vue_exports.createCommentVNode)(" We render single input if it's required "), isFormArrayEmptyAndRequired.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(VisuallyHiddenInputBubble_default, (0, vue_exports.mergeProps)({ key: _ctx.name }, {
				...props,
				..._ctx.$attrs
			}, {
				name: _ctx.name,
				value: _ctx.value
			}), null, 16, ["name", "value"])) : ((0, vue_exports.openBlock)(true), (0, vue_exports.createElementBlock)(vue_exports.Fragment, { key: 1 }, (0, vue_exports.renderList)(parsedValue.value, (parsed) => {
				return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(VisuallyHiddenInputBubble_default, (0, vue_exports.mergeProps)({ key: parsed.name }, { ref_for: true }, {
					...props,
					..._ctx.$attrs
				}, {
					name: parsed.name,
					value: parsed.value
				}), null, 16, ["name", "value"]);
			}), 128))], 2112);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Listbox/utils.js
function queryCheckedElement(parentEl) {
	return parentEl?.querySelector("[data-state=checked]");
}
function valueComparator(value, currentValue, comparator) {
	if (value === void 0) return false;
	else if (Array.isArray(value)) return value.some((val) => compare(val, currentValue, comparator));
	else return compare(value, currentValue, comparator);
}
function compare(value, currentValue, comparator) {
	if (value === void 0 || currentValue === void 0) return false;
	if (typeof value === "string") return value === currentValue;
	if (typeof comparator === "function") return comparator(value, currentValue);
	if (typeof comparator === "string") return value?.[comparator] === currentValue?.[comparator];
	return isEqual(value, currentValue);
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/RovingFocus/utils.js
var MAP_KEY_TO_FOCUS_INTENT = {
	ArrowLeft: "prev",
	ArrowUp: "prev",
	ArrowRight: "next",
	ArrowDown: "next",
	PageUp: "first",
	Home: "first",
	PageDown: "last",
	End: "last"
};
function getDirectionAwareKey(key, dir) {
	if (dir !== "rtl") return key;
	return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
	const key = getDirectionAwareKey(event.key, dir);
	if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
	if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
	return MAP_KEY_TO_FOCUS_INTENT[key];
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Listbox/ListboxRoot.js
var [injectListboxRootContext, provideListboxRootContext] = /*#__PURE__*/ createContext("ListboxRoot");
var [injectListboxHighlightScrollContext, provideListboxHighlightScrollContext] = /*#__PURE__*/ createContext("ListboxHighlightScroll");
var ListboxRoot_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ListboxRoot",
	props: {
		modelValue: {
			type: null,
			required: false
		},
		defaultValue: {
			type: null,
			required: false
		},
		multiple: {
			type: Boolean,
			required: false
		},
		orientation: {
			type: String,
			required: false,
			default: "vertical"
		},
		dir: {
			type: String,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		selectionBehavior: {
			type: String,
			required: false,
			default: "toggle"
		},
		highlightOnHover: {
			type: Boolean,
			required: false
		},
		by: {
			type: [String, Function],
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		},
		name: {
			type: String,
			required: false
		},
		required: {
			type: Boolean,
			required: false
		}
	},
	emits: [
		"update:modelValue",
		"highlight",
		"entryFocus",
		"leave"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const { multiple, highlightOnHover, orientation, disabled, selectionBehavior, dir: propDir } = (0, vue_exports.toRefs)(props);
		const { getItems } = useCollection({ isProvider: true });
		const { handleTypeaheadSearch } = useTypeahead();
		const { primitiveElement, currentElement } = usePrimitiveElement();
		const kbd = useKbd();
		const dir = useDirection(propDir);
		const highlightScrollContext = injectListboxHighlightScrollContext(null);
		provideListboxHighlightScrollContext({
			suppressHighlightScroll: (0, vue_exports.ref)(false),
			onHighlightScrollRequest: () => {}
		});
		const isFormControl = useFormControl(currentElement);
		const firstValue = (0, vue_exports.ref)();
		const isUserAction = (0, vue_exports.ref)(false);
		const focusable = (0, vue_exports.ref)(true);
		const modelValue = useVModel(props, "modelValue", emits, {
			defaultValue: props.defaultValue ?? (multiple.value ? [] : void 0),
			passive: props.modelValue === void 0,
			deep: true
		});
		function onValueChange(val) {
			isUserAction.value = true;
			if (props.multiple) {
				const modelArray = Array.isArray(modelValue.value) ? [...modelValue.value] : [];
				const index = modelArray.findIndex((i) => compare(i, val, props.by));
				if (props.selectionBehavior === "toggle") {
					index === -1 ? modelArray.push(val) : modelArray.splice(index, 1);
					modelValue.value = modelArray;
				} else {
					modelValue.value = [val];
					firstValue.value = val;
				}
			} else if (props.selectionBehavior === "toggle") if (compare(modelValue.value, val, props.by)) modelValue.value = void 0;
			else modelValue.value = val;
			else modelValue.value = val;
			setTimeout(() => {
				isUserAction.value = false;
			}, 1);
		}
		const highlightedElement = (0, vue_exports.ref)(null);
		const previousElement = (0, vue_exports.ref)(null);
		const isVirtual = (0, vue_exports.ref)(false);
		const isComposing = (0, vue_exports.ref)(false);
		const virtualFocusHook = createEventHook();
		const virtualKeydownHook = createEventHook();
		const virtualHighlightHook = createEventHook();
		function getCollectionItem() {
			return getItems().map((i) => i.ref).filter((i) => i.dataset.disabled !== "");
		}
		function changeHighlight(el, scrollIntoView = true, focus) {
			if (!el) return;
			highlightedElement.value = el;
			const suppressHighlightScroll = highlightScrollContext?.suppressHighlightScroll.value ?? false;
			if (focus ?? focusable.value) if (suppressHighlightScroll) highlightedElement.value.focus({ preventScroll: true });
			else highlightedElement.value.focus();
			if (suppressHighlightScroll) highlightScrollContext?.onHighlightScrollRequest(scrollIntoView ? () => {
				const element = highlightedElement.value;
				if (element?.isConnected) element.scrollIntoView({ block: "nearest" });
			} : void 0);
			else if (scrollIntoView) highlightedElement.value.scrollIntoView({ block: "nearest" });
			const highlightedItem = getItems().find((i) => i.ref === el);
			emits("highlight", highlightedItem);
		}
		function highlightItem(value) {
			if (isVirtual.value) virtualHighlightHook.trigger(value);
			else {
				const item = getItems().find((i) => compare(i.value, value, props.by));
				if (item) {
					highlightedElement.value = item.ref;
					changeHighlight(item.ref);
				}
			}
		}
		function onKeydownEnter(event) {
			if (highlightedElement.value && highlightedElement.value.isConnected) {
				if (event.ctrlKey || event.metaKey || event.altKey) return;
				event.preventDefault();
				event.stopPropagation();
				if (!isComposing.value) highlightedElement.value.click();
			}
		}
		function onKeydownTypeAhead(event) {
			if (!focusable.value) return;
			isUserAction.value = true;
			if (isVirtual.value) virtualKeydownHook.trigger(event);
			else {
				const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
				if (isMetaKey && event.key === "a" && multiple.value) {
					const collection = getItems();
					const values = collection.map((i) => i.value);
					modelValue.value = [...values];
					event.preventDefault();
					const lastItem = collection.at(-1);
					if (lastItem) changeHighlight(lastItem.ref);
				} else if (!isMetaKey) {
					const el = handleTypeaheadSearch(event.key, getItems());
					if (el) changeHighlight(el);
				}
			}
			setTimeout(() => {
				isUserAction.value = false;
			}, 1);
		}
		function onCompositionStart() {
			isComposing.value = true;
		}
		function onCompositionEnd() {
			(0, vue_exports.nextTick)(() => {
				isComposing.value = false;
			});
		}
		function highlightFirstItem() {
			(0, vue_exports.nextTick)(() => {
				onKeydownNavigation(new KeyboardEvent("keydown", { key: "PageUp" }));
			});
		}
		function onLeave(event) {
			const el = highlightedElement.value;
			if (el?.isConnected) previousElement.value = el;
			highlightedElement.value = null;
			emits("leave", event);
		}
		function onEnter(event) {
			const entryFocusEvent = new CustomEvent("listbox.entryFocus", {
				bubbles: false,
				cancelable: true
			});
			event.currentTarget?.dispatchEvent(entryFocusEvent);
			emits("entryFocus", entryFocusEvent);
			if (entryFocusEvent.defaultPrevented) return;
			if (previousElement.value) changeHighlight(previousElement.value);
			else {
				const el = getCollectionItem()?.[0];
				changeHighlight(el);
			}
		}
		function onKeydownNavigation(event) {
			const intent = getFocusIntent(event, orientation.value, dir.value);
			if (!intent) return;
			let collection = getCollectionItem();
			if (highlightedElement.value) {
				if (intent === "last") collection.reverse();
				else if (intent === "prev" || intent === "next") {
					if (intent === "prev") collection.reverse();
					const currentIndex = collection.indexOf(highlightedElement.value);
					collection = collection.slice(currentIndex + 1);
				}
				handleMultipleReplace(event, collection[0]);
			}
			if (collection.length) {
				const index = !highlightedElement.value && intent === "prev" ? collection.length - 1 : 0;
				changeHighlight(collection[index]);
			}
			if (isVirtual.value) return virtualKeydownHook.trigger(event);
		}
		function handleMultipleReplace(event, targetEl) {
			if (isVirtual.value || props.selectionBehavior !== "replace" || !multiple.value || !Array.isArray(modelValue.value)) return;
			if ((event.altKey || event.ctrlKey || event.metaKey) && !event.shiftKey) return;
			if (event.shiftKey) {
				const collection = getItems().filter((i) => i.ref.dataset.disabled !== "");
				let lastValue = collection.find((i) => i.ref === targetEl)?.value;
				if (event.key === kbd.END) lastValue = collection.at(-1)?.value;
				else if (event.key === kbd.HOME) lastValue = collection[0]?.value;
				if (!lastValue || !firstValue.value) return;
				const values = findValuesBetween(collection.map((i) => i.value), firstValue.value, lastValue);
				modelValue.value = values;
			}
		}
		async function highlightSelected(event, scroll = true) {}
		let hasHighlightedOnMount = false;
		(0, vue_exports.watch)(modelValue, () => {
			if (!isUserAction.value) {
				const scroll = hasHighlightedOnMount;
				hasHighlightedOnMount = true;
				(0, vue_exports.nextTick)(() => {
					highlightSelected(void 0, scroll);
				});
			}
		}, {
			immediate: true,
			deep: true
		});
		__expose({
			highlightedElement,
			highlightItem,
			highlightFirstItem,
			highlightSelected,
			getItems
		});
		provideListboxRootContext({
			modelValue,
			onValueChange,
			multiple,
			orientation,
			dir,
			disabled,
			highlightOnHover,
			highlightedElement,
			isVirtual,
			virtualFocusHook,
			virtualKeydownHook,
			virtualHighlightHook,
			by: props.by,
			firstValue,
			selectionBehavior,
			focusable,
			onLeave,
			onEnter,
			changeHighlight,
			onKeydownEnter,
			onKeydownNavigation,
			onKeydownTypeAhead,
			onCompositionStart,
			onCompositionEnd,
			highlightFirstItem
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), {
				ref_key: "primitiveElement",
				ref: primitiveElement,
				as: _ctx.as,
				"as-child": _ctx.asChild,
				dir: (0, vue_exports.unref)(dir),
				"data-disabled": (0, vue_exports.unref)(disabled) ? "" : void 0,
				onPointerleave: onLeave,
				onFocusout: _cache[0] || (_cache[0] = async (event) => {
					const target = event.relatedTarget || event.target;
					await (0, vue_exports.nextTick)();
					if (highlightedElement.value && (0, vue_exports.unref)(currentElement) && !(0, vue_exports.unref)(currentElement).contains(target)) onLeave(event);
				})
			}, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default", { modelValue: (0, vue_exports.unref)(modelValue) }), (0, vue_exports.unref)(isFormControl) && _ctx.name ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(VisuallyHiddenInput_default), {
					key: 0,
					name: _ctx.name,
					value: (0, vue_exports.unref)(modelValue),
					disabled: (0, vue_exports.unref)(disabled),
					required: _ctx.required
				}, null, 8, [
					"name",
					"value",
					"disabled",
					"required"
				])) : (0, vue_exports.createCommentVNode)("v-if", true)]),
				_: 3
			}, 8, [
				"as",
				"as-child",
				"dir",
				"data-disabled"
			]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Listbox/ListboxContent.js
var ListboxContent_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ListboxContent",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const { CollectionSlot } = useCollection();
		const rootContext = injectListboxRootContext();
		const isClickFocus = refAutoReset(false, 10);
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(CollectionSlot), null, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(Primitive), {
					role: "listbox",
					as: _ctx.as,
					"as-child": _ctx.asChild,
					tabindex: (0, vue_exports.unref)(rootContext).focusable.value ? (0, vue_exports.unref)(rootContext).highlightedElement.value ? "-1" : "0" : "-1",
					"aria-orientation": (0, vue_exports.unref)(rootContext).orientation.value,
					"aria-multiselectable": !!(0, vue_exports.unref)(rootContext).multiple.value,
					"data-orientation": (0, vue_exports.unref)(rootContext).orientation.value,
					onMousedown: _cache[0] || (_cache[0] = (0, vue_exports.withModifiers)(($event) => isClickFocus.value = true, ["left"])),
					onFocus: _cache[1] || (_cache[1] = (ev) => {
						if ((0, vue_exports.unref)(isClickFocus)) return;
						(0, vue_exports.unref)(rootContext).onEnter(ev);
					}),
					onKeydown: [
						_cache[2] || (_cache[2] = (0, vue_exports.withKeys)((event) => {
							if ((0, vue_exports.unref)(rootContext).orientation.value === "vertical" && (event.key === "ArrowLeft" || event.key === "ArrowRight") || (0, vue_exports.unref)(rootContext).orientation.value === "horizontal" && (event.key === "ArrowUp" || event.key === "ArrowDown")) return;
							event.preventDefault();
							(0, vue_exports.unref)(rootContext).focusable.value && (0, vue_exports.unref)(rootContext).onKeydownNavigation(event);
						}, [
							"down",
							"up",
							"left",
							"right",
							"home",
							"end"
						])),
						(0, vue_exports.withKeys)((0, vue_exports.unref)(rootContext).onKeydownEnter, ["enter"]),
						(0, vue_exports.unref)(rootContext).onKeydownTypeAhead
					]
				}, {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
					_: 3
				}, 8, [
					"as",
					"as-child",
					"tabindex",
					"aria-orientation",
					"aria-multiselectable",
					"data-orientation",
					"onKeydown"
				])]),
				_: 3
			});
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Listbox/ListboxFilter.js
var ListboxFilter_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ListboxFilter",
	props: {
		modelValue: {
			type: String,
			required: false
		},
		autoFocus: {
			type: Boolean,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "input"
		}
	},
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const modelValue = useVModel(props, "modelValue", __emit, {
			defaultValue: "",
			passive: props.modelValue === void 0
		});
		const rootContext = injectListboxRootContext();
		const { primitiveElement} = usePrimitiveElement();
		const disabled = (0, vue_exports.computed)(() => props.disabled || rootContext.disabled.value || false);
		const activedescendant = (0, vue_exports.ref)();
		(0, vue_exports.watchSyncEffect)(() => activedescendant.value = rootContext.highlightedElement.value?.id);
		const { isComposing, shouldDeferInput, handleCompositionStart, handleCompositionUpdate, handleCompositionEnd } = useComposing((event) => {
			modelValue.value = event.target.value;
			rootContext.onCompositionEnd();
			rootContext.highlightFirstItem();
		});
		function onCompositionStart() {
			rootContext.onCompositionStart();
			handleCompositionStart();
		}
		function handleInput(event) {
			if (shouldDeferInput.value) return;
			modelValue.value = event.target.value;
			rootContext.highlightFirstItem();
		}
		function handleKeydownNavigation(event) {
			if (isComposing.value) return;
			event.preventDefault();
			rootContext.onKeydownNavigation(event);
		}
		function handleKeydownEnter(event) {
			if (isComposing.value) return;
			rootContext.onKeydownEnter(event);
		}
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), {
				ref_key: "primitiveElement",
				ref: primitiveElement,
				as: _ctx.as,
				"as-child": _ctx.asChild,
				value: (0, vue_exports.unref)(modelValue),
				disabled: disabled.value ? "" : void 0,
				"data-disabled": disabled.value ? "" : void 0,
				"aria-disabled": disabled.value ?? void 0,
				"aria-activedescendant": activedescendant.value,
				type: "text",
				onKeydown: [(0, vue_exports.withKeys)(handleKeydownNavigation, [
					"down",
					"up",
					"home",
					"end"
				]), (0, vue_exports.withKeys)(handleKeydownEnter, ["enter"])],
				onInput: handleInput,
				onCompositionstart: onCompositionStart,
				onCompositionupdate: (0, vue_exports.unref)(handleCompositionUpdate),
				onCompositionend: (0, vue_exports.unref)(handleCompositionEnd)
			}, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default", { modelValue: (0, vue_exports.unref)(modelValue) })]),
				_: 3
			}, 8, [
				"as",
				"as-child",
				"value",
				"disabled",
				"data-disabled",
				"aria-disabled",
				"aria-activedescendant",
				"onCompositionupdate",
				"onCompositionend"
			]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Listbox/ListboxGroup.js
var [injectListboxGroupContext, provideListboxGroupContext] = /*#__PURE__*/ createContext("ListboxGroup");
var ListboxGroup_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ListboxGroup",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const id = useId(void 0, "reka-listbox-group");
		provideListboxGroupContext({ id });
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)({ role: "group" }, props, { "aria-labelledby": (0, vue_exports.unref)(id) }), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["aria-labelledby"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Listbox/ListboxItem.js
var LISTBOX_SELECT = "listbox.select";
var [injectListboxItemContext, provideListboxItemContext] = /*#__PURE__*/ createContext("ListboxItem");
var ListboxItem_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ListboxItem",
	props: {
		value: {
			type: null,
			required: true
		},
		disabled: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "div"
		}
	},
	emits: ["select"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const id = useId(void 0, "reka-listbox-item");
		const { CollectionItem } = useCollection();
		const { forwardRef, currentElement } = useForwardExpose();
		const rootContext = injectListboxRootContext();
		const isHighlighted = (0, vue_exports.computed)(() => currentElement.value != null && currentElement.value === rootContext.highlightedElement.value);
		const isSelected = (0, vue_exports.computed)(() => valueComparator(rootContext.modelValue.value, props.value, rootContext.by));
		const disabled = (0, vue_exports.computed)(() => rootContext.disabled.value || props.disabled);
		async function handleSelect(ev) {
			emits("select", ev);
			if (ev?.defaultPrevented) return;
			if (!disabled.value && ev) {
				rootContext.onValueChange(props.value);
				rootContext.changeHighlight(currentElement.value);
			}
		}
		function handleSelectCustomEvent(ev) {
			handleAndDispatchCustomEvent(LISTBOX_SELECT, handleSelect, {
				originalEvent: ev,
				value: props.value
			});
		}
		provideListboxItemContext({ isSelected });
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(CollectionItem), { value: _ctx.value }, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.withMemo)([
					isHighlighted.value,
					isSelected.value,
					disabled.value,
					(0, vue_exports.unref)(rootContext).focusable.value
				], () => (0, vue_exports.createVNode)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)({ id: (0, vue_exports.unref)(id) }, _ctx.$attrs, {
					ref: (0, vue_exports.unref)(forwardRef),
					role: "option",
					tabindex: (0, vue_exports.unref)(rootContext).focusable.value ? isHighlighted.value ? "0" : "-1" : -1,
					"aria-selected": isSelected.value,
					as: _ctx.as,
					"as-child": _ctx.asChild,
					disabled: disabled.value ? "" : void 0,
					"data-disabled": disabled.value ? "" : void 0,
					"data-highlighted": isHighlighted.value ? "" : void 0,
					"data-state": isSelected.value ? "checked" : "unchecked",
					onClick: handleSelectCustomEvent,
					onKeydown: (0, vue_exports.withKeys)((0, vue_exports.withModifiers)(handleSelectCustomEvent, ["prevent"]), ["space"]),
					onPointermove: _cache[0] || (_cache[0] = () => {
						if ((0, vue_exports.unref)(rootContext).highlightedElement.value === (0, vue_exports.unref)(currentElement)) return;
						if ((0, vue_exports.unref)(rootContext).highlightOnHover.value) (0, vue_exports.unref)(rootContext).changeHighlight((0, vue_exports.unref)(currentElement), false, false);
					})
				}), {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
					_: 3
				}, 16, [
					"id",
					"tabindex",
					"aria-selected",
					"as",
					"as-child",
					"disabled",
					"data-disabled",
					"data-highlighted",
					"data-state",
					"onKeydown"
				]), _cache, 1)]),
				_: 3
			}, 8, ["value"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Listbox/ListboxItemIndicator.js
var ListboxItemIndicator_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ListboxItemIndicator",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "span"
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		const itemContext = injectListboxItemContext();
		return (_ctx, _cache) => {
			return (0, vue_exports.unref)(itemContext).isSelected.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)({
				key: 0,
				"aria-hidden": "true"
			}, props), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16)) : (0, vue_exports.createCommentVNode)("v-if", true);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/@tanstack+virtual-core@3.17.9/node_modules/@tanstack/virtual-core/dist/esm/lazy-measurements.js
function createLazyMeasurementsView(count, flat, getItemKey) {
	const cache = new Array(count);
	return new Proxy(cache, { get(target, prop, receiver) {
		if (typeof prop === "string") {
			const c = prop.charCodeAt(0);
			if (c >= 48 && c <= 57) {
				const i = +prop;
				if (Number.isInteger(i) && i >= 0 && i < count) {
					let v = target[i];
					if (!v) {
						const s = flat[i * 2];
						v = target[i] = {
							index: i,
							key: getItemKey(i),
							start: s,
							size: flat[i * 2 + 1],
							end: s + flat[i * 2 + 1],
							lane: 0
						};
					}
					return v;
				}
			}
			if (prop === "length") return count;
		}
		return Reflect.get(target, prop, receiver);
	} });
}
//#endregion
//#region node_modules/.pnpm/@tanstack+virtual-core@3.17.9/node_modules/@tanstack/virtual-core/dist/esm/utils.js
function memo(getDeps, fn, opts) {
	let deps = opts.initialDeps ?? [];
	let result;
	let isInitial = true;
	function memoizedFunction() {
		const newDeps = getDeps();
		if (!(newDeps.length !== deps.length || newDeps.some((dep, index) => deps[index] !== dep))) return result;
		deps = newDeps;
		result = fn(...newDeps);
		if ((opts == null ? void 0 : opts.onChange) && !(isInitial && opts.skipInitialOnChange)) opts.onChange(result);
		isInitial = false;
		return result;
	}
	memoizedFunction.updateDeps = (newDeps) => {
		deps = newDeps;
	};
	return memoizedFunction;
}
function notUndefined(value, msg) {
	if (value === void 0) throw new Error(`Unexpected undefined${""}`);
	else return value;
}
var approxEqual = (a, b) => Math.abs(a - b) < 1.01;
var debounce = (targetWindow, fn, ms) => {
	let timeoutId;
	return Object.assign(function(...args) {
		targetWindow.clearTimeout(timeoutId);
		timeoutId = targetWindow.setTimeout(() => fn.apply(this, args), ms);
	}, { cancel: () => {
		targetWindow.clearTimeout(timeoutId);
	} });
};
//#endregion
//#region node_modules/.pnpm/@tanstack+virtual-core@3.17.9/node_modules/@tanstack/virtual-core/dist/esm/index.js
var _isIOSResult;
var isIOSWebKit = () => {
	if (_isIOSResult !== void 0) return _isIOSResult;
	return _isIOSResult = false;
};
var getRect = (element) => {
	const { offsetWidth, offsetHeight } = element;
	return {
		width: offsetWidth,
		height: offsetHeight
	};
};
var defaultKeyExtractor = (index) => index;
var defaultRangeExtractor = (range) => {
	const start = Math.max(range.startIndex - range.overscan, 0);
	const len = Math.min(range.endIndex + range.overscan, range.count - 1) - start + 1;
	const arr = new Array(len);
	for (let i = 0; i < len; i++) arr[i] = start + i;
	return arr;
};
var observeElementRect = (instance, cb) => {
	const element = instance.scrollElement;
	if (!element) return;
	const targetWindow = instance.targetWindow;
	if (!targetWindow) return;
	const handler = (rect) => {
		const { width, height } = rect;
		cb({
			width: Math.round(width),
			height: Math.round(height)
		});
	};
	handler(getRect(element));
	if (!targetWindow.ResizeObserver) return () => {};
	const observer = new targetWindow.ResizeObserver((entries) => {
		const run = () => {
			const entry = entries[0];
			if (entry == null ? void 0 : entry.borderBoxSize) {
				const box = entry.borderBoxSize[0];
				if (box) {
					handler({
						width: box.inlineSize,
						height: box.blockSize
					});
					return;
				}
			}
			handler(getRect(element));
		};
		instance.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(run) : run();
	});
	observer.observe(element, { box: "border-box" });
	return () => {
		observer.unobserve(element);
	};
};
var addEventListenerOptions = { passive: true };
var supportsScrollend = true;
var observeOffset = (instance, cb, readOffset) => {
	const element = instance.scrollElement;
	if (!element) return;
	const targetWindow = instance.targetWindow;
	if (!targetWindow) return;
	const registerScrollendEvent = instance.options.useScrollendEvent && supportsScrollend;
	let offset = 0;
	const fallback = registerScrollendEvent ? null : debounce(targetWindow, () => cb(offset, false), instance.options.isScrollingResetDelay);
	const createHandler = (isScrolling) => () => {
		offset = readOffset(element);
		fallback?.();
		cb(offset, isScrolling);
	};
	const handler = createHandler(true);
	const endHandler = createHandler(false);
	element.addEventListener("scroll", handler, addEventListenerOptions);
	if (registerScrollendEvent) element.addEventListener("scrollend", endHandler, addEventListenerOptions);
	return () => {
		element.removeEventListener("scroll", handler);
		if (registerScrollendEvent) element.removeEventListener("scrollend", endHandler);
		fallback?.cancel();
	};
};
var observeElementOffset = (instance, cb) => observeOffset(instance, cb, (el) => {
	const { horizontal, isRtl } = instance.options;
	return horizontal ? el.scrollLeft * (isRtl && -1 || 1) : el.scrollTop;
});
var measureElement = (element, entry, instance) => {
	if (instance.options.useCachedMeasurements) {
		const index = instance.indexFromElement(element);
		const key = instance.options.getItemKey(index);
		return instance.itemSizeCache.get(key) ?? instance.options.estimateSize(index);
	}
	if (entry == null ? void 0 : entry.borderBoxSize) {
		const box = entry.borderBoxSize[0];
		if (box) return Math.round(box[instance.options.horizontal ? "inlineSize" : "blockSize"]);
	}
	if (!entry) {
		const index = instance.indexFromElement(element);
		const key = instance.options.getItemKey(index);
		const cachedSize = instance.itemSizeCache.get(key);
		if (cachedSize !== void 0) return cachedSize;
	}
	return element[instance.options.horizontal ? "offsetWidth" : "offsetHeight"];
};
var scrollWithAdjustments = (offset, { adjustments = 0, behavior }, instance) => {
	var _a, _b;
	(_b = (_a = instance.scrollElement) == null ? void 0 : _a.scrollTo) == null || _b.call(_a, {
		[instance.options.horizontal ? "left" : "top"]: offset + adjustments,
		behavior
	});
};
var elementScroll = scrollWithAdjustments;
var Virtualizer = class {
	constructor(opts) {
		this.unsubs = [];
		this.scrollElement = null;
		this.targetWindow = null;
		this.isScrolling = false;
		this.scrollState = null;
		this.measurementsCache = [];
		this._flatMeasurements = null;
		this.itemSizeCache = /* @__PURE__ */ new Map();
		this.itemSizeCacheVersion = 0;
		this.laneAssignments = /* @__PURE__ */ new Map();
		this.pendingMin = null;
		this.prevLanes = void 0;
		this.lanesChangedFlag = false;
		this.lanesSettling = false;
		this.pendingScrollAnchor = null;
		this.scrollRect = null;
		this.scrollOffset = null;
		this.scrollDirection = null;
		this.scrollAdjustments = 0;
		this._iosDeferredAdjustment = 0;
		this._iosTouching = false;
		this._iosJustTouchEnded = false;
		this._iosTouchEndTimerId = null;
		this._intendedScrollOffset = null;
		this._clampedAdjustment = null;
		this.elementsCache = /* @__PURE__ */ new Map();
		this.now = () => {
			var _a, _b, _c;
			return ((_c = (_b = (_a = this.targetWindow) == null ? void 0 : _a.performance) == null ? void 0 : _b.now) == null ? void 0 : _c.call(_b)) ?? Date.now();
		};
		this.observer = /* @__PURE__ */ (() => {
			let _ro = null;
			const get = () => {
				if (_ro) return _ro;
				if (!this.targetWindow || !this.targetWindow.ResizeObserver) return null;
				return _ro = new this.targetWindow.ResizeObserver((entries) => {
					entries.forEach((entry) => {
						const run = () => {
							const node = entry.target;
							const index = this.indexFromElement(node);
							if (!node.isConnected) {
								this.observer.unobserve(node);
								for (const [cacheKey, cachedNode] of this.elementsCache) if (cachedNode === node) {
									this.elementsCache.delete(cacheKey);
									break;
								}
								return;
							}
							if (!this.isIndexInRange(index)) return;
							if (this.shouldMeasureDuringScroll(index)) this.resizeItem(index, this.options.measureElement(node, entry, this));
						};
						this.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(run) : run();
					});
				});
			};
			return {
				disconnect: () => {
					var _a;
					(_a = get()) == null || _a.disconnect();
					_ro = null;
				},
				observe: (target) => {
					var _a;
					return (_a = get()) == null ? void 0 : _a.observe(target, { box: "border-box" });
				},
				unobserve: (target) => {
					var _a;
					return (_a = get()) == null ? void 0 : _a.unobserve(target);
				}
			};
		})();
		this.range = null;
		this.setOptions = (opts2) => {
			var _a, _b;
			const merged = {
				debug: false,
				initialOffset: 0,
				overscan: 1,
				paddingStart: 0,
				paddingEnd: 0,
				scrollPaddingStart: 0,
				scrollPaddingEnd: 0,
				horizontal: false,
				getItemKey: defaultKeyExtractor,
				rangeExtractor: defaultRangeExtractor,
				onChange: () => {},
				measureElement,
				initialRect: {
					width: 0,
					height: 0
				},
				scrollMargin: 0,
				gap: 0,
				indexAttribute: "data-index",
				initialMeasurementsCache: [],
				lanes: 1,
				anchorTo: "start",
				followOnAppend: false,
				scrollEndThreshold: 1,
				isScrollingResetDelay: 150,
				enabled: true,
				isRtl: false,
				useScrollendEvent: false,
				useAnimationFrameWithResizeObserver: false,
				laneAssignmentMode: "estimate",
				useCachedMeasurements: false
			};
			for (const key in opts2) {
				const v = opts2[key];
				if (v !== void 0) merged[key] = v;
			}
			const prevOptions = this.options;
			let anchor = null;
			let followOnAppend = null;
			let edgeKeysChanged = false;
			if (prevOptions !== void 0 && prevOptions.enabled && merged.enabled && merged.anchorTo === "end" && this.scrollElement !== null) {
				const prevCount = prevOptions.count;
				const nextCount = merged.count;
				const measurements = this.getMeasurements();
				const prevFirstKey = prevCount > 0 ? ((_a = measurements[0]) == null ? void 0 : _a.key) ?? prevOptions.getItemKey(0) : null;
				const prevLastKey = prevCount > 0 ? ((_b = measurements[prevCount - 1]) == null ? void 0 : _b.key) ?? prevOptions.getItemKey(prevCount - 1) : null;
				if (nextCount !== prevCount || prevCount > 0 && nextCount > 0 && (merged.getItemKey(0) !== prevFirstKey || merged.getItemKey(nextCount - 1) !== prevLastKey)) {
					edgeKeysChanged = true;
					const item = prevCount > 0 ? this.getVirtualItemForOffset(this.getScrollOffset()) ?? measurements[0] : null;
					if (item) anchor = [item.key, this.getScrollOffset() - item.start];
					const behavior = merged.followOnAppend === true ? "auto" : merged.followOnAppend || null;
					if (behavior && nextCount > prevCount && this.isAtEnd(prevOptions.scrollEndThreshold) && (prevCount === 0 || merged.getItemKey(nextCount - 1) !== prevLastKey)) followOnAppend = behavior;
				}
			}
			this.options = merged;
			if (edgeKeysChanged) {
				this.pendingMin = 0;
				this.itemSizeCacheVersion++;
			}
			let anchorResolved = false;
			let anchorDelta = 0;
			if (anchor && this.scrollOffset !== null) {
				const [anchorKey, anchorOffset] = anchor;
				const newMeasurements = this.getMeasurements();
				const { count, getItemKey } = this.options;
				let idx = 0;
				while (idx < count && getItemKey(idx) !== anchorKey) idx++;
				if (idx < count) {
					const anchorItem = newMeasurements[idx];
					if (anchorItem) {
						const newOffset = Math.max(0, anchorItem.start + anchorOffset);
						if (newOffset !== this.scrollOffset) {
							anchorDelta = newOffset - this.scrollOffset;
							this.scrollOffset = newOffset;
							anchorResolved = true;
						}
					}
				}
			}
			if (anchorResolved || followOnAppend) this.pendingScrollAnchor = [
				anchorResolved ? anchor[0] : null,
				anchorResolved ? anchor[1] : 0,
				followOnAppend,
				anchorDelta
			];
		};
		this.notify = (sync) => {
			var _a, _b;
			(_b = (_a = this.options).onChange) == null || _b.call(_a, this, sync);
		};
		this.maybeNotify = memo(() => {
			this.calculateRange();
			return [
				this.isScrolling,
				this.range ? this.range.startIndex : null,
				this.range ? this.range.endIndex : null
			];
		}, (isScrolling) => {
			this.notify(isScrolling);
		}, {
			key: false,
			debug: () => this.options.debug,
			initialDeps: [
				this.isScrolling,
				this.range ? this.range.startIndex : null,
				this.range ? this.range.endIndex : null
			]
		});
		this.cleanup = () => {
			this.unsubs.filter(Boolean).forEach((d) => d());
			this.unsubs = [];
			this.observer.disconnect();
			if (this.rafId != null && this.targetWindow) {
				this.targetWindow.cancelAnimationFrame(this.rafId);
				this.rafId = null;
			}
			this.scrollState = null;
			this.isScrolling = false;
			this.scrollDirection = null;
			this._iosDeferredAdjustment = 0;
			this._iosTouching = false;
			this._iosJustTouchEnded = false;
			this._clampedAdjustment = null;
			this.scrollElement = null;
			this.targetWindow = null;
		};
		this._didMount = () => {
			return () => {
				this.cleanup();
			};
		};
		this._willUpdate = () => {
			var _a;
			const scrollElement = this.options.enabled ? this.options.getScrollElement() : null;
			if (this.scrollElement !== scrollElement) {
				this.cleanup();
				if (!scrollElement) {
					this.maybeNotify();
					return;
				}
				this.scrollElement = scrollElement;
				if (this.scrollElement && "ownerDocument" in this.scrollElement) this.targetWindow = this.scrollElement.ownerDocument.defaultView;
				else this.targetWindow = ((_a = this.scrollElement) == null ? void 0 : _a.window) ?? null;
				this.elementsCache.forEach((cached) => {
					this.observer.observe(cached);
				});
				this.unsubs.push(this.options.observeElementRect(this, (rect) => {
					this.scrollRect = rect;
					this.maybeNotify();
				}));
				this.unsubs.push(this.options.observeElementOffset(this, (offset, isScrolling) => {
					if (isScrolling && this._intendedScrollOffset === null && offset === this.scrollOffset) return;
					if (this._intendedScrollOffset !== null && Math.abs(offset - this._intendedScrollOffset) < 1.5) offset = this._intendedScrollOffset;
					this._intendedScrollOffset = null;
					if (this._clampedAdjustment !== null && Math.abs(offset - this._clampedAdjustment.maxAtWrite) >= 1.5) this._clampedAdjustment = null;
					this.scrollAdjustments = 0;
					const prevOffset = this.getScrollOffset();
					this.scrollDirection = isScrolling ? prevOffset === offset ? this.scrollDirection : prevOffset < offset ? "forward" : "backward" : null;
					this.scrollOffset = offset;
					this.isScrolling = isScrolling;
					this._flushIosDeferredIfReady();
					if (this.scrollState) this.scheduleScrollReconcile();
					this.maybeNotify();
				}));
				if ("addEventListener" in this.scrollElement) {
					const scrollEl = this.scrollElement;
					const onTouchStart = () => {
						this._iosTouching = true;
						this._iosJustTouchEnded = false;
						if (this._iosTouchEndTimerId !== null && this.targetWindow != null) {
							this.targetWindow.clearTimeout(this._iosTouchEndTimerId);
							this._iosTouchEndTimerId = null;
						}
					};
					const onTouchEnd = () => {
						this._iosTouching = false;
						if (!isIOSWebKit() || this.targetWindow == null) return;
						this._iosJustTouchEnded = true;
						this._iosTouchEndTimerId = this.targetWindow.setTimeout(() => {
							this._iosJustTouchEnded = false;
							this._iosTouchEndTimerId = null;
							this._flushIosDeferredIfReady();
						}, 150);
					};
					scrollEl.addEventListener("touchstart", onTouchStart, addEventListenerOptions);
					scrollEl.addEventListener("touchend", onTouchEnd, addEventListenerOptions);
					this.unsubs.push(() => {
						scrollEl.removeEventListener("touchstart", onTouchStart);
						scrollEl.removeEventListener("touchend", onTouchEnd);
						if (this._iosTouchEndTimerId !== null && this.targetWindow != null) {
							this.targetWindow.clearTimeout(this._iosTouchEndTimerId);
							this._iosTouchEndTimerId = null;
						}
					});
				}
				this._scrollToOffset(this.getScrollOffset(), {
					adjustments: void 0,
					behavior: void 0
				});
			}
			const anchor = this.pendingScrollAnchor;
			this.pendingScrollAnchor = null;
			if (anchor && this.scrollElement && this.options.enabled) {
				const [key, _offset, followOnAppend, anchorDelta] = anchor;
				if (key !== null && !followOnAppend) {
					if (isIOSWebKit() && (this.isScrolling || this._iosTouching || this._iosJustTouchEnded)) {
						if (anchorDelta !== 0) this._iosDeferredAdjustment += anchorDelta;
					} else this._scrollToOffset(this.getScrollOffset(), {
						adjustments: void 0,
						behavior: void 0
					});
				}
				if (followOnAppend) this.scrollToEnd({ behavior: followOnAppend });
			}
			this._retryClampedAdjustment();
		};
		this._retryClampedAdjustment = () => {
			if (this._clampedAdjustment === null || !this.scrollElement || !this.options.enabled) return;
			const { target, maxAtWrite } = this._clampedAdjustment;
			const max = this.getMaxScrollOffset();
			if (max > maxAtWrite + .5) {
				this._clampedAdjustment = target > max + .5 ? {
					target,
					maxAtWrite: max
				} : null;
				this._scrollToOffset(target, {
					adjustments: void 0,
					behavior: void 0
				});
			}
		};
		this._flushIosDeferredIfReady = () => {
			if (this._iosDeferredAdjustment === 0) return;
			if (this.isScrolling) return;
			if (this._iosTouching) return;
			if (this._iosJustTouchEnded) return;
			const cur = this.getScrollOffset();
			const max = this.getMaxScrollOffset();
			if (cur < 0 || cur > max) return;
			if (this._iosDeferredAdjustment < 0 && cur >= max - 1) {
				this._iosDeferredAdjustment = 0;
				return;
			}
			const delta = this._iosDeferredAdjustment;
			this._iosDeferredAdjustment = 0;
			this._scrollToOffset(cur, {
				adjustments: this.scrollAdjustments += delta,
				behavior: void 0
			});
		};
		this.rafId = null;
		this.getSize = () => {
			if (!this.options.enabled) {
				this.scrollRect = null;
				return 0;
			}
			this.scrollRect = this.scrollRect ?? this.options.initialRect;
			return this.scrollRect[this.options.horizontal ? "width" : "height"];
		};
		this.getScrollOffset = () => {
			if (!this.options.enabled) {
				this.scrollOffset = null;
				return 0;
			}
			this.scrollOffset = this.scrollOffset ?? (typeof this.options.initialOffset === "function" ? this.options.initialOffset() : this.options.initialOffset);
			return this.scrollOffset;
		};
		this.getMeasurementOptions = memo(() => [
			this.options.count,
			this.options.paddingStart,
			this.options.scrollMargin,
			this.options.getItemKey,
			this.options.enabled,
			this.options.lanes,
			this.options.laneAssignmentMode,
			this.options.gap
		], (count, paddingStart, scrollMargin, getItemKey, enabled, lanes, laneAssignmentMode, gap) => {
			if (this.prevLanes !== void 0 && this.prevLanes !== lanes) this.lanesChangedFlag = true;
			this.prevLanes = lanes;
			this.pendingMin = null;
			return {
				count,
				paddingStart,
				scrollMargin,
				getItemKey,
				enabled,
				lanes,
				laneAssignmentMode,
				gap
			};
		}, { key: false });
		this.isIndexInRange = (index) => index >= 0 && index < this.options.count;
		this.getMeasurements = memo(() => [this.getMeasurementOptions(), this.itemSizeCacheVersion], ({ count, paddingStart, scrollMargin, getItemKey, enabled, lanes, laneAssignmentMode, gap }, _itemSizeCacheVersion) => {
			const itemSizeCache = this.itemSizeCache;
			if (!enabled) {
				this.measurementsCache = [];
				this.itemSizeCache.clear();
				this.laneAssignments.clear();
				return [];
			}
			if (this.laneAssignments.size > count) {
				for (const index of this.laneAssignments.keys()) if (index >= count) this.laneAssignments.delete(index);
			}
			if (this.lanesChangedFlag) {
				this.lanesChangedFlag = false;
				this.lanesSettling = true;
				this.measurementsCache = [];
				this.itemSizeCache.clear();
				this.laneAssignments.clear();
				this.pendingMin = null;
			}
			if (this.measurementsCache.length === 0 && !this.lanesSettling) {
				this.measurementsCache = this.options.initialMeasurementsCache;
				this.measurementsCache.forEach((item) => {
					this.itemSizeCache.set(item.key, item.size);
				});
			}
			const min = this.lanesSettling ? 0 : this.pendingMin ?? 0;
			this.pendingMin = null;
			if (this.lanesSettling && this.measurementsCache.length === count) this.lanesSettling = false;
			if (lanes === 1) {
				const need = count * 2;
				let flat = this._flatMeasurements;
				if (!flat || flat.length < need) {
					const next = new Float64Array(need);
					if (flat && min > 0) next.set(flat.subarray(0, min * 2));
					flat = next;
					this._flatMeasurements = flat;
				}
				let runningStart;
				if (min === 0) runningStart = paddingStart + scrollMargin;
				else {
					const prevIdx = min - 1;
					runningStart = flat[prevIdx * 2] + flat[prevIdx * 2 + 1] + gap;
				}
				for (let i = min; i < count; i++) {
					const key = getItemKey(i);
					const measuredSize = itemSizeCache.get(key);
					const size = typeof measuredSize === "number" ? measuredSize : this.options.estimateSize(i);
					flat[i * 2] = runningStart;
					flat[i * 2 + 1] = size;
					runningStart += size + gap;
				}
				const view = createLazyMeasurementsView(count, flat, getItemKey);
				this.measurementsCache = view;
				return view;
			}
			const measurements = this.measurementsCache.slice(0, min);
			const laneLastIndex = new Array(lanes).fill(void 0);
			const laneEnds = new Float64Array(lanes);
			let filledLanes = 0;
			for (let m = 0; m < min; m++) {
				const item = measurements[m];
				if (item) {
					if (laneLastIndex[item.lane] === void 0) filledLanes++;
					laneLastIndex[item.lane] = m;
					laneEnds[item.lane] = item.end;
				}
			}
			for (let i = min; i < count; i++) {
				const key = getItemKey(i);
				const cachedLane = this.laneAssignments.get(i);
				let lane;
				let start;
				const shouldCacheLane = laneAssignmentMode === "estimate" || itemSizeCache.has(key);
				if (cachedLane !== void 0 && this.options.lanes > 1) {
					lane = cachedLane;
					const prevIndex = laneLastIndex[lane];
					const prevInLane = prevIndex !== void 0 ? measurements[prevIndex] : void 0;
					start = prevInLane ? prevInLane.end + gap : paddingStart + scrollMargin;
				} else if (filledLanes === lanes) {
					let bestLane = 0;
					let bestEnd = laneEnds[0];
					let bestIdx = laneLastIndex[0];
					for (let l = 1; l < lanes; l++) {
						const e = laneEnds[l];
						if (e < bestEnd || e === bestEnd && laneLastIndex[l] < bestIdx) {
							bestLane = l;
							bestEnd = e;
							bestIdx = laneLastIndex[l];
						}
					}
					lane = bestLane;
					start = bestEnd + gap;
					if (shouldCacheLane) this.laneAssignments.set(i, lane);
				} else {
					lane = i % this.options.lanes;
					start = paddingStart + scrollMargin;
					if (shouldCacheLane) this.laneAssignments.set(i, lane);
				}
				const measuredSize = itemSizeCache.get(key);
				const size = typeof measuredSize === "number" ? measuredSize : this.options.estimateSize(i);
				const end = start + size;
				measurements[i] = {
					index: i,
					start,
					size,
					end,
					key,
					lane
				};
				if (laneLastIndex[lane] === void 0) filledLanes++;
				laneLastIndex[lane] = i;
				laneEnds[lane] = end;
			}
			this.measurementsCache = measurements;
			return measurements;
		}, {
			key: false,
			debug: () => this.options.debug
		});
		this.calculateRange = memo(() => [
			this.getMeasurements(),
			this.getSize(),
			this.getScrollOffset(),
			this.options.lanes
		], (measurements, outerSize, scrollOffset, lanes) => {
			if (measurements.length === 0 || outerSize === 0) {
				this.range = null;
				return null;
			}
			this.range = calculateRangeImpl(measurements, outerSize, scrollOffset, lanes, lanes === 1 && this._flatMeasurements != null ? this._flatMeasurements : null);
			return this.range;
		}, {
			key: false,
			debug: () => this.options.debug
		});
		this.getVirtualIndexes = memo(() => {
			let startIndex = null;
			let endIndex = null;
			const range = this.calculateRange();
			if (range) {
				startIndex = range.startIndex;
				endIndex = range.endIndex;
			}
			this.maybeNotify.updateDeps([
				this.isScrolling,
				startIndex,
				endIndex
			]);
			return [
				this.options.rangeExtractor,
				this.options.overscan,
				this.options.count,
				startIndex,
				endIndex
			];
		}, (rangeExtractor, overscan, count, startIndex, endIndex) => {
			return startIndex === null || endIndex === null ? [] : rangeExtractor({
				startIndex,
				endIndex,
				overscan,
				count
			});
		}, {
			key: false,
			debug: () => this.options.debug
		});
		this.indexFromElement = (node) => {
			const attributeName = this.options.indexAttribute;
			const indexStr = node.getAttribute(attributeName);
			if (!indexStr) {
				console.warn(`Missing attribute name '${attributeName}={index}' on measured element.`);
				return -1;
			}
			return parseInt(indexStr, 10);
		};
		this.shouldMeasureDuringScroll = (index) => {
			var _a;
			if (!this.scrollState || this.scrollState.behavior !== "smooth") return true;
			const scrollIndex = this.scrollState.index ?? ((_a = this.getVirtualItemForOffset(this.scrollState.lastTargetOffset)) == null ? void 0 : _a.index);
			if (scrollIndex !== void 0 && this.range) {
				const bufferSize = Math.max(this.options.overscan, Math.ceil((this.range.endIndex - this.range.startIndex) / 2));
				const minIndex = Math.max(0, scrollIndex - bufferSize);
				const maxIndex = Math.min(this.options.count - 1, scrollIndex + bufferSize);
				return index >= minIndex && index <= maxIndex;
			}
			return true;
		};
		this.measureElement = (node) => {
			if (!node) {
				this.elementsCache.forEach((cached, key2) => {
					if (!cached.isConnected) {
						this.observer.unobserve(cached);
						this.elementsCache.delete(key2);
					}
				});
				return;
			}
			const index = this.indexFromElement(node);
			if (!this.isIndexInRange(index)) return;
			const key = this.options.getItemKey(index);
			const prevNode = this.elementsCache.get(key);
			if (prevNode !== node) {
				if (prevNode) this.observer.unobserve(prevNode);
				this.observer.observe(node);
				this.elementsCache.set(key, node);
			}
			if ((!this.isScrolling || this.scrollState) && this.shouldMeasureDuringScroll(index)) this.resizeItem(index, this.options.measureElement(node, void 0, this));
		};
		this.resizeItem = (index, size) => {
			var _a, _b;
			if (!this.isIndexInRange(index)) return;
			let cachedSize;
			let itemStart;
			let key;
			const flat = this._flatMeasurements;
			if (this.options.lanes === 1 && flat !== null) {
				key = this.options.getItemKey(index);
				itemStart = flat[index * 2];
				cachedSize = flat[index * 2 + 1];
			} else {
				const item = this.measurementsCache[index];
				if (!item) return;
				key = item.key;
				itemStart = item.start;
				cachedSize = item.size;
			}
			const itemSize = this.itemSizeCache.get(key) ?? cachedSize;
			const delta = size - itemSize;
			if (delta !== 0) {
				const wasAtEnd = this.options.anchorTo === "end" && ((_a = this.scrollState) == null ? void 0 : _a.behavior) !== "smooth" && this.getVirtualDistanceFromEnd() <= this.options.scrollEndThreshold;
				const prevTotalSize = wasAtEnd ? this.getTotalSize() : 0;
				const scrollOffsetWithAdj = this.getScrollOffset() + this.scrollAdjustments;
				const defaultShouldAdjust = !this.itemSizeCache.has(key) ? itemStart < scrollOffsetWithAdj : itemStart + itemSize <= scrollOffsetWithAdj && this.scrollDirection !== "backward";
				const shouldAdjustScroll = ((_b = this.scrollState) == null ? void 0 : _b.behavior) !== "smooth" && (this.shouldAdjustScrollPositionOnItemSizeChange !== void 0 ? this.shouldAdjustScrollPositionOnItemSizeChange(this.measurementsCache[index] ?? {
					index,
					key,
					start: itemStart,
					size: cachedSize,
					end: itemStart + cachedSize,
					lane: 0
				}, delta, this) : defaultShouldAdjust);
				if (this.pendingMin === null || index < this.pendingMin) this.pendingMin = index;
				this.itemSizeCache.set(key, size);
				this.itemSizeCacheVersion++;
				let adjustedSync = false;
				if (wasAtEnd) adjustedSync = this.applyScrollAdjustment(this.getTotalSize() - prevTotalSize);
				else if (shouldAdjustScroll) adjustedSync = this.applyScrollAdjustment(delta);
				this.notify(adjustedSync);
				this._retryClampedAdjustment();
			}
		};
		this.getVirtualItems = memo(() => [this.getVirtualIndexes(), this.getMeasurements()], (indexes, measurements) => {
			const virtualItems = [];
			for (let k = 0, len = indexes.length; k < len; k++) {
				const measurement = measurements[indexes[k]];
				virtualItems.push(measurement);
			}
			return virtualItems;
		}, {
			key: false,
			debug: () => this.options.debug
		});
		this.getVirtualItemForOffset = (offset) => {
			const measurements = this.getMeasurements();
			if (measurements.length === 0) return;
			const flat = this._flatMeasurements;
			const useFlat = this.options.lanes === 1 && flat != null;
			return notUndefined(measurements[findNearestBinarySearch(0, measurements.length - 1, useFlat ? (i) => flat[i * 2] : (i) => notUndefined(measurements[i]).start, offset)]);
		};
		this.getMaxScrollOffset = () => {
			if (!this.scrollElement) return 0;
			if ("scrollHeight" in this.scrollElement) return this.options.horizontal ? this.scrollElement.scrollWidth - this.scrollElement.clientWidth : this.scrollElement.scrollHeight - this.scrollElement.clientHeight;
			else {
				const doc = this.scrollElement.document.documentElement;
				return this.options.horizontal ? doc.scrollWidth - this.scrollElement.innerWidth : doc.scrollHeight - this.scrollElement.innerHeight;
			}
		};
		this.getVirtualDistanceFromEnd = () => {
			return Math.max(this.getTotalSize() - this.getSize() - this.getScrollOffset(), 0);
		};
		this.getDistanceFromEnd = () => {
			return Math.max(this.getMaxScrollOffset() - this.getScrollOffset(), 0);
		};
		this.isAtEnd = (threshold = this.options.scrollEndThreshold) => {
			return this.getDistanceFromEnd() <= threshold;
		};
		this.getOffsetForAlignment = (toOffset, align, itemSize = 0) => {
			if (!this.scrollElement) return 0;
			const size = this.getSize();
			const scrollOffset = this.getScrollOffset();
			if (align === "auto") align = toOffset >= scrollOffset + size ? "end" : "start";
			if (align === "center") toOffset += (itemSize - size) / 2;
			else if (align === "end") toOffset -= size;
			const maxOffset = this.getMaxScrollOffset();
			return Math.max(Math.min(maxOffset, toOffset), 0);
		};
		this.getOffsetForIndex = (index, align = "auto") => {
			index = Math.max(0, Math.min(index, this.options.count - 1));
			const size = this.getSize();
			const scrollOffset = this.getScrollOffset();
			const item = this.measurementsCache[index];
			if (!item) return;
			if (align === "auto") {
				if (item.end >= scrollOffset + size - this.options.scrollPaddingEnd) align = "end";
				else if (item.start <= scrollOffset + this.options.scrollPaddingStart) align = "start";
				else return [scrollOffset, align];
			}
			if (align === "end" && index === this.options.count - 1) return [this.getMaxScrollOffset(), align];
			const toOffset = align === "end" ? item.end + this.options.scrollPaddingEnd : item.start - this.options.scrollPaddingStart;
			return [this.getOffsetForAlignment(toOffset, align, item.size), align];
		};
		this.scrollToOffset = (toOffset, { align = "start", behavior = "auto" } = {}) => {
			this._iosDeferredAdjustment = 0;
			const offset = this.getOffsetForAlignment(toOffset, align);
			const now = this.now();
			this.scrollState = {
				index: null,
				align,
				behavior,
				startedAt: now,
				lastTargetOffset: offset,
				stableFrames: 0
			};
			this._scrollToOffset(offset, {
				adjustments: void 0,
				behavior
			});
			this.scheduleScrollReconcile();
		};
		this.scrollToIndex = (index, { align: initialAlign = "auto", behavior = "auto" } = {}) => {
			this._iosDeferredAdjustment = 0;
			index = Math.max(0, Math.min(index, this.options.count - 1));
			const offsetInfo = this.getOffsetForIndex(index, initialAlign);
			if (!offsetInfo) return;
			const [offset, align] = offsetInfo;
			const now = this.now();
			this.scrollState = {
				index,
				align,
				behavior,
				startedAt: now,
				lastTargetOffset: offset,
				stableFrames: 0
			};
			this._scrollToOffset(offset, {
				adjustments: void 0,
				behavior
			});
			this.scheduleScrollReconcile();
		};
		this.scrollBy = (delta, { behavior = "auto" } = {}) => {
			const offset = this.getScrollOffset() + delta;
			const now = this.now();
			this.scrollState = {
				index: null,
				align: "start",
				behavior,
				startedAt: now,
				lastTargetOffset: offset,
				stableFrames: 0
			};
			this._scrollToOffset(offset, {
				adjustments: void 0,
				behavior
			});
			this.scheduleScrollReconcile();
		};
		this.scrollToEnd = ({ behavior = "auto" } = {}) => {
			if (this.options.count > 0) {
				this.scrollToIndex(this.options.count - 1, {
					align: "end",
					behavior
				});
				return;
			}
			this.scrollToOffset(Math.max(this.getTotalSize() - this.getSize(), 0), { behavior });
		};
		this.getTotalSize = () => {
			var _a;
			const measurements = this.getMeasurements();
			let end;
			if (measurements.length === 0) end = this.options.paddingStart;
			else if (this.options.lanes === 1) {
				const lastIdx = measurements.length - 1;
				const flat = this._flatMeasurements;
				if (flat != null) end = flat[lastIdx * 2] + flat[lastIdx * 2 + 1];
				else end = ((_a = measurements[lastIdx]) == null ? void 0 : _a.end) ?? 0;
			} else {
				const endByLane = Array(this.options.lanes).fill(null);
				let endIndex = measurements.length - 1;
				while (endIndex >= 0 && endByLane.some((val) => val === null)) {
					const item = measurements[endIndex];
					if (endByLane[item.lane] === null) endByLane[item.lane] = item.end;
					endIndex--;
				}
				end = Math.max(...endByLane.filter((val) => val !== null));
			}
			return Math.max(end - this.options.scrollMargin + this.options.paddingEnd, 0);
		};
		this.takeSnapshot = () => {
			const snapshot = [];
			if (this.itemSizeCache.size === 0) return snapshot;
			const m = this.getMeasurements();
			for (const item of m) if (item && this.itemSizeCache.has(item.key)) snapshot.push({
				index: item.index,
				key: item.key,
				start: item.start,
				size: item.size,
				end: item.end,
				lane: item.lane
			});
			return snapshot;
		};
		this._scrollToOffset = (offset, { adjustments, behavior }) => {
			this._intendedScrollOffset = offset + (adjustments ?? 0);
			this.options.scrollToFn(offset, {
				behavior,
				adjustments
			}, this);
		};
		this.measure = () => {
			this.pendingMin = null;
			this.itemSizeCache.clear();
			this.laneAssignments.clear();
			this.itemSizeCacheVersion++;
			this.notify(false);
		};
		this.setOptions(opts);
	}
	applyScrollAdjustment(delta, behavior) {
		if (delta === 0) return false;
		if (isIOSWebKit() && (this.isScrolling || this._iosTouching || this._iosJustTouchEnded)) {
			this._iosDeferredAdjustment += delta;
			return false;
		} else {
			const target = this.getScrollOffset() + this.scrollAdjustments + delta;
			const el = this.scrollElement;
			const maxAtWrite = el !== null && ("scrollHeight" in el || "document" in el) ? this.getMaxScrollOffset() : null;
			this._clampedAdjustment = maxAtWrite !== null && target > maxAtWrite + .5 ? {
				target,
				maxAtWrite
			} : null;
			this._scrollToOffset(this.getScrollOffset(), {
				adjustments: this.scrollAdjustments += delta,
				behavior
			});
			if (this.scrollOffset !== null) {
				this.scrollOffset += this.scrollAdjustments;
				if (this.scrollOffset < 0) this.scrollOffset = 0;
				this.scrollAdjustments = 0;
			}
			return true;
		}
	}
	scheduleScrollReconcile() {
		if (!this.targetWindow) {
			this.scrollState = null;
			return;
		}
		if (this.rafId != null) return;
		this.rafId = this.targetWindow.requestAnimationFrame(() => {
			this.rafId = null;
			this.reconcileScroll();
		});
	}
	reconcileScroll() {
		if (!this.scrollState) return;
		if (!this.scrollElement) return;
		if (this.now() - this.scrollState.startedAt > 5e3) {
			this.scrollState = null;
			return;
		}
		const offsetInfo = this.scrollState.index != null ? this.getOffsetForIndex(this.scrollState.index, this.scrollState.align) : void 0;
		const targetOffset = offsetInfo ? offsetInfo[0] : this.scrollState.lastTargetOffset;
		const STABLE_FRAMES = 1;
		const targetChanged = targetOffset !== this.scrollState.lastTargetOffset;
		if (!targetChanged && approxEqual(targetOffset, this.getScrollOffset())) {
			this.scrollState.stableFrames++;
			if (this.scrollState.stableFrames >= STABLE_FRAMES) {
				if (this.getScrollOffset() !== targetOffset) this._scrollToOffset(targetOffset, {
					adjustments: void 0,
					behavior: "auto"
				});
				this.scrollState = null;
				return;
			}
		} else {
			this.scrollState.stableFrames = 0;
			if (targetChanged) {
				const viewport = this.getSize() || 600;
				const distance = Math.abs(targetOffset - this.getScrollOffset());
				const keepSmooth = this.scrollState.behavior === "smooth" && distance > viewport;
				this.scrollState.lastTargetOffset = targetOffset;
				if (!keepSmooth) this.scrollState.behavior = "auto";
				this._scrollToOffset(targetOffset, {
					adjustments: void 0,
					behavior: keepSmooth ? "smooth" : "auto"
				});
			}
		}
		this.scheduleScrollReconcile();
	}
};
var findNearestBinarySearch = (low, high, getCurrentValue, value) => {
	while (low <= high) {
		const middle = (low + high) / 2 | 0;
		const currentValue = getCurrentValue(middle);
		if (currentValue < value) low = middle + 1;
		else if (currentValue > value) high = middle - 1;
		else return middle;
	}
	if (low > 0) return low - 1;
	else return 0;
};
function findNearestBinarySearchFlat(flat, high, value) {
	let low = 0;
	while (low <= high) {
		const middle = (low + high) / 2 | 0;
		const currentValue = flat[middle * 2];
		if (currentValue < value) low = middle + 1;
		else if (currentValue > value) high = middle - 1;
		else return middle;
	}
	return low > 0 ? low - 1 : 0;
}
function calculateRangeImpl(measurements, outerSize, scrollOffset, lanes, flat) {
	const lastIndex = measurements.length - 1;
	if (measurements.length <= lanes) return {
		startIndex: 0,
		endIndex: lastIndex
	};
	if (lanes === 1 && flat !== null) {
		const startIndex2 = findNearestBinarySearchFlat(flat, lastIndex, scrollOffset);
		let endIndex2 = startIndex2;
		const limit = scrollOffset + outerSize;
		while (endIndex2 < lastIndex && flat[endIndex2 * 2] + flat[endIndex2 * 2 + 1] < limit) endIndex2++;
		return {
			startIndex: startIndex2,
			endIndex: endIndex2
		};
	}
	const getStart = (index) => measurements[index].start;
	let startIndex = findNearestBinarySearch(0, lastIndex, getStart, scrollOffset);
	let endIndex = startIndex;
	if (lanes === 1) while (endIndex < lastIndex && measurements[endIndex].end < scrollOffset + outerSize) endIndex++;
	else if (lanes > 1) {
		const endPerLane = Array(lanes).fill(0);
		while (endIndex < lastIndex && endPerLane.some((pos) => pos < scrollOffset + outerSize)) {
			const item = measurements[endIndex];
			endPerLane[item.lane] = item.end;
			endIndex++;
		}
		const startPerLane = Array(lanes).fill(scrollOffset + outerSize);
		while (startIndex >= 0 && startPerLane.some((pos) => pos >= scrollOffset)) {
			const item = measurements[startIndex];
			startPerLane[item.lane] = item.start;
			startIndex--;
		}
		startIndex = Math.max(0, startIndex - startIndex % lanes);
		endIndex = Math.min(lastIndex, endIndex + (lanes - 1 - endIndex % lanes));
	}
	return {
		startIndex,
		endIndex
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+vue-virtual@3.13.37_vue@3.5.42_typescript@6.0.3_/node_modules/@tanstack/vue-virtual/dist/esm/index.js
function useVirtualizerBase(options) {
	const virtualizer = new Virtualizer((0, vue_exports.unref)(options));
	const state = (0, vue_exports.shallowRef)(virtualizer);
	const cleanup = virtualizer._didMount();
	(0, vue_exports.watch)(() => (0, vue_exports.unref)(options).getScrollElement(), (el) => {
		if (el) virtualizer._willUpdate();
	}, { immediate: true });
	(0, vue_exports.watch)(() => (0, vue_exports.unref)(options), (options2) => {
		virtualizer.setOptions({
			...options2,
			onChange: (instance, sync) => {
				var _a;
				(0, vue_exports.triggerRef)(state);
				(_a = options2.onChange) == null || _a.call(options2, instance, sync);
			}
		});
		virtualizer._willUpdate();
		(0, vue_exports.triggerRef)(state);
	}, { immediate: true });
	(0, vue_exports.onScopeDispose)(cleanup);
	return state;
}
function useVirtualizer(options) {
	return useVirtualizerBase((0, vue_exports.computed)(() => ({
		observeElementRect,
		observeElementOffset,
		scrollToFn: elementScroll,
		...(0, vue_exports.unref)(options)
	})));
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Listbox/ListboxVirtualizer.js
var ListboxVirtualizer_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ListboxVirtualizer",
	props: {
		options: {
			type: Array,
			required: true
		},
		overscan: {
			type: Number,
			required: false
		},
		estimateSize: {
			type: [Number, Function],
			required: false
		},
		textContent: {
			type: Function,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const slots = (0, vue_exports.useSlots)();
		const rootContext = injectListboxRootContext();
		const parentEl = useParentElement();
		const { getItems } = useCollection();
		rootContext.isVirtual.value = true;
		const padding = (0, vue_exports.computed)(() => {
			const el = parentEl.value;
			if (!el) return {
				start: 0,
				end: 0
			};
			else {
				const styles = (void 0).getComputedStyle(el);
				return {
					start: Number.parseFloat(styles.paddingBlockStart || styles.paddingTop),
					end: Number.parseFloat(styles.paddingBlockEnd || styles.paddingBottom)
				};
			}
		});
		const virtualizer = useVirtualizer({
			get scrollPaddingStart() {
				return padding.value.start;
			},
			get scrollPaddingEnd() {
				return padding.value.end;
			},
			get count() {
				return props.options.length;
			},
			get horizontal() {
				return rootContext.orientation.value === "horizontal";
			},
			estimateSize(index) {
				if (typeof props.estimateSize === "function") return props.estimateSize(index);
				return props.estimateSize ?? 28;
			},
			getScrollElement() {
				return parentEl.value;
			},
			overscan: props.overscan ?? 12
		});
		const virtualizedItems = (0, vue_exports.computed)(() => virtualizer.value.getVirtualItems().map((item) => {
			const defaultNode = slots.default({
				option: props.options[item.index],
				virtualizer: virtualizer.value,
				virtualItem: item
			})[0];
			const targetNode = defaultNode.type === vue_exports.Fragment && Array.isArray(defaultNode.children) ? defaultNode.children.find((child) => typeof child.type !== "symbol") : defaultNode;
			return {
				item,
				is: (0, vue_exports.cloneVNode)(targetNode, {
					"key": `${item.key}`,
					"data-index": item.index,
					"aria-setsize": props.options.length,
					"aria-posinset": item.index + 1,
					"style": {
						position: "absolute",
						top: 0,
						left: 0,
						transform: `translateY(${item.start}px)`,
						overflowAnchor: "none"
					}
				})
			};
		}));
		rootContext.virtualFocusHook.on(({ event, scroll }) => {
			const index = props.options.findIndex((option) => {
				if (Array.isArray(rootContext.modelValue.value)) return compare(option, rootContext.modelValue.value[0], rootContext.by);
				else return compare(option, rootContext.modelValue.value, rootContext.by);
			});
			if (index !== -1) {
				event?.preventDefault();
				virtualizer.value.scrollToIndex(index, { align: "start" });
				requestAnimationFrame(() => {
					const item = queryCheckedElement(parentEl.value);
					if (item) {
						const focus = event ? true : scroll ? void 0 : false;
						rootContext.changeHighlight(item, scroll, focus);
					}
				});
			} else if (scroll) rootContext.highlightFirstItem();
			else requestAnimationFrame(() => {
				const item = getItems().find((i) => i.ref.dataset.disabled !== "")?.ref;
				if (item) rootContext.changeHighlight(item, false, false);
			});
		});
		rootContext.virtualHighlightHook.on((value) => {
			const index = props.options.findIndex((option) => {
				return compare(option, value, rootContext.by);
			});
			virtualizer.value.scrollToIndex(index, { align: "start" });
			requestAnimationFrame(() => {
				const item = queryCheckedElement(parentEl.value);
				if (item) rootContext.changeHighlight(item);
			});
		});
		const search = refAutoReset("", 1e3);
		const optionsWithMetadata = (0, vue_exports.computed)(() => {
			const parseTextContent = (option) => {
				if (props.textContent) return props.textContent(option);
				else return option?.toString().toLowerCase();
			};
			return props.options.map((option, index) => ({
				index,
				textContent: parseTextContent(option)
			}));
		});
		function handleMultipleReplace(event, intent) {
			if (!rootContext.firstValue?.value || !rootContext.multiple.value || !Array.isArray(rootContext.modelValue.value)) return;
			const lastValue = getItems().filter((i) => i.ref.dataset.disabled !== "").find((i) => i.ref === rootContext.highlightedElement.value)?.value;
			if (!lastValue) return;
			let value = null;
			switch (intent) {
				case "prev":
				case "next":
					value = findValuesBetween(props.options, rootContext.firstValue.value, lastValue);
					break;
				case "first":
					value = findValuesBetween(props.options, rootContext.firstValue.value, props.options?.[0]);
					break;
				case "last": value = findValuesBetween(props.options, rootContext.firstValue.value, props.options.at(-1));
			}
			rootContext.modelValue.value = value;
		}
		rootContext.virtualKeydownHook.on((event) => {
			const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
			if (event.key === "Tab" && !isMetaKey) return;
			let intent = MAP_KEY_TO_FOCUS_INTENT[event.key];
			if (isMetaKey && event.key === "a" && rootContext.multiple.value) {
				event.preventDefault();
				rootContext.modelValue.value = [...props.options];
				intent = "last";
			} else if (event.shiftKey && intent) handleMultipleReplace(event, intent);
			if (["first", "last"].includes(intent)) {
				event.preventDefault();
				const index = intent === "first" ? 0 : props.options.length - 1;
				virtualizer.value.scrollToIndex(index);
				requestAnimationFrame(() => {
					const items = getItems();
					const item = intent === "first" ? items[0] : items.at(-1);
					if (item) rootContext.changeHighlight(item.ref);
				});
			} else if (!intent && !isMetaKey) {
				search.value += event.key;
				const currentIndex = Number(getActiveElement()?.getAttribute("data-index"));
				const currentMatch = optionsWithMetadata.value[currentIndex].textContent;
				const next = getNextMatch(optionsWithMetadata.value.map((i) => i.textContent ?? ""), search.value, currentMatch);
				const nextMatch = optionsWithMetadata.value.find((option) => option.textContent === next);
				if (nextMatch) {
					virtualizer.value.scrollToIndex(nextMatch.index, { align: "start" });
					requestAnimationFrame(() => {
						const item = parentEl.value.querySelector(`[data-index="${nextMatch.index}"]`);
						if (item instanceof HTMLElement) rootContext.changeHighlight(item);
					});
				}
			}
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("div", {
				"data-reka-virtualizer": "",
				style: (0, vue_exports.normalizeStyle)({
					position: "relative",
					width: "100%",
					height: `${(0, vue_exports.unref)(virtualizer).getTotalSize()}px`
				})
			}, [((0, vue_exports.openBlock)(true), (0, vue_exports.createElementBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(virtualizedItems.value, ({ is, item }) => {
				return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.resolveDynamicComponent)(is), { key: item.index });
			}), 128))], 4);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Popper/PopperRoot.js
var [injectPopperRootContext, providePopperRootContext] = /*#__PURE__*/ createContext("PopperRoot");
var PopperRoot_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	inheritAttrs: false,
	__name: "PopperRoot",
	setup(__props) {
		const anchor = (0, vue_exports.ref)();
		providePopperRootContext({
			anchor,
			onAnchorChange: (element) => anchor.value = element
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.renderSlot)(_ctx.$slots, "default");
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Popper/PopperAnchor.js
var PopperAnchor_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "PopperAnchor",
	props: {
		reference: {
			type: null,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const { forwardRef, currentElement } = useForwardExpose();
		const rootContext = injectPopperRootContext();
		(0, vue_exports.watchPostEffect)(() => {
			rootContext.onAnchorChange(props.reference ?? currentElement.value);
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), {
				ref: (0, vue_exports.unref)(forwardRef),
				as: _ctx.as,
				"as-child": _ctx.asChild
			}, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 8, ["as", "as-child"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/component/Arrow.js
var _hoisted_1$1 = {
	key: 0,
	d: "M0 0L6 6L12 0"
};
var _hoisted_2 = {
	key: 1,
	d: "M0 0L4.58579 4.58579C5.36683 5.36683 6.63316 5.36684 7.41421 4.58579L12 0"
};
var Arrow_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "Arrow",
	props: {
		width: {
			type: Number,
			required: false,
			default: 10
		},
		height: {
			type: Number,
			required: false,
			default: 5
		},
		rounded: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "svg"
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)(props, {
				width: _ctx.width,
				height: _ctx.height,
				viewBox: _ctx.asChild ? void 0 : "0 0 12 6",
				preserveAspectRatio: _ctx.asChild ? void 0 : "none"
			}), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default", {}, () => [!_ctx.rounded ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("path", _hoisted_1$1)) : ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("path", _hoisted_2))])]),
				_: 3
			}, 16, [
				"width",
				"height",
				"viewBox",
				"preserveAspectRatio"
			]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Popper/utils.js
function isNotNull(value) {
	return value !== null;
}
function transformOrigin(options) {
	return {
		name: "transformOrigin",
		options,
		fn(data) {
			const { placement, rects, middlewareData } = data;
			const isArrowHidden = middlewareData.arrow?.centerOffset !== 0;
			const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
			const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
			const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
			const noArrowAlignX = {
				start: options.dir === "rtl" ? "100%" : "0%",
				center: "50%",
				end: options.dir === "rtl" ? "0%" : "100%"
			}[placedAlign];
			const noArrowAlignY = {
				start: "0%",
				center: "50%",
				end: "100%"
			}[placedAlign];
			const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
			const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;
			let x = "";
			let y = "";
			if (placedSide === "bottom") {
				x = isArrowHidden ? noArrowAlignX : `${arrowXCenter}px`;
				y = `${-arrowHeight}px`;
			} else if (placedSide === "top") {
				x = isArrowHidden ? noArrowAlignX : `${arrowXCenter}px`;
				y = `${rects.floating.height + arrowHeight}px`;
			} else if (placedSide === "right") {
				x = `${-arrowHeight}px`;
				y = isArrowHidden ? noArrowAlignY : `${arrowYCenter}px`;
			} else if (placedSide === "left") {
				x = `${rects.floating.width + arrowHeight}px`;
				y = isArrowHidden ? noArrowAlignY : `${arrowYCenter}px`;
			}
			return { data: {
				x,
				y
			} };
		}
	};
}
function getSideAndAlignFromPlacement(placement) {
	const [side, align = "center"] = placement.split("-");
	return [side, align];
}
//#endregion
//#region node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
/**
* Custom positioning reference element.
* @see https://floating-ui.com/docs/virtual-elements
*/
var sides = [
	"top",
	"right",
	"bottom",
	"left"
];
var min = Math.min;
var max = Math.max;
var round = Math.round;
var floor = Math.floor;
var createCoords = (v) => ({
	x: v,
	y: v
});
var oppositeSideMap = {
	left: "right",
	right: "left",
	bottom: "top",
	top: "bottom"
};
function clamp(start, value, end) {
	return max(start, min(value, end));
}
function evaluate(value, param) {
	return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
	return placement.split("-")[0];
}
function getAlignment(placement) {
	return placement.split("-")[1];
}
function getOppositeAxis(axis) {
	return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
	return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
	const firstChar = placement[0];
	return firstChar === "t" || firstChar === "b" ? "y" : "x";
}
function getAlignmentAxis(placement) {
	return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
	if (rtl === void 0) rtl = false;
	const alignment = getAlignment(placement);
	const alignmentAxis = getAlignmentAxis(placement);
	const length = getAxisLength(alignmentAxis);
	let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
	if (rects.reference[length] > rects.floating[length]) mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
	return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
	const oppositePlacement = getOppositePlacement(placement);
	return [
		getOppositeAlignmentPlacement(placement),
		oppositePlacement,
		getOppositeAlignmentPlacement(oppositePlacement)
	];
}
function getOppositeAlignmentPlacement(placement) {
	return placement.includes("start") ? placement.replace("start", "end") : placement.replace("end", "start");
}
var lrPlacement = ["left", "right"];
var rlPlacement = ["right", "left"];
var tbPlacement = ["top", "bottom"];
var btPlacement = ["bottom", "top"];
function getSideList(side, isStart, rtl) {
	switch (side) {
		case "top":
		case "bottom":
			if (rtl) return isStart ? rlPlacement : lrPlacement;
			return isStart ? lrPlacement : rlPlacement;
		case "left":
		case "right": return isStart ? tbPlacement : btPlacement;
		default: return [];
	}
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
	const alignment = getAlignment(placement);
	let list = getSideList(getSide(placement), direction === "start", rtl);
	if (alignment) {
		list = list.map((side) => side + "-" + alignment);
		if (flipAlignment) list = list.concat(list.map(getOppositeAlignmentPlacement));
	}
	return list;
}
function getOppositePlacement(placement) {
	const side = getSide(placement);
	return oppositeSideMap[side] + placement.slice(side.length);
}
function expandPaddingObject(padding) {
	var _padding$top, _padding$right, _padding$bottom, _padding$left;
	return {
		top: (_padding$top = padding.top) != null ? _padding$top : 0,
		right: (_padding$right = padding.right) != null ? _padding$right : 0,
		bottom: (_padding$bottom = padding.bottom) != null ? _padding$bottom : 0,
		left: (_padding$left = padding.left) != null ? _padding$left : 0
	};
}
function getPaddingObject(padding) {
	return typeof padding !== "number" ? expandPaddingObject(padding) : {
		top: padding,
		right: padding,
		bottom: padding,
		left: padding
	};
}
function rectToClientRect(rect) {
	const { x, y, width, height } = rect;
	return {
		width,
		height,
		top: y,
		left: x,
		right: x + width,
		bottom: y + height,
		x,
		y
	};
}
//#endregion
//#region node_modules/.pnpm/@floating-ui+core@1.8.0/node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function computeCoordsFromPlacement(_ref, placement, rtl) {
	let { reference, floating } = _ref;
	const sideAxis = getSideAxis(placement);
	const alignmentAxis = getAlignmentAxis(placement);
	const alignLength = getAxisLength(alignmentAxis);
	const side = getSide(placement);
	const isVertical = sideAxis === "y";
	const commonX = reference.x + reference.width / 2 - floating.width / 2;
	const commonY = reference.y + reference.height / 2 - floating.height / 2;
	const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
	let coords;
	switch (side) {
		case "top":
			coords = {
				x: commonX,
				y: reference.y - floating.height
			};
			break;
		case "bottom":
			coords = {
				x: commonX,
				y: reference.y + reference.height
			};
			break;
		case "right":
			coords = {
				x: reference.x + reference.width,
				y: commonY
			};
			break;
		case "left":
			coords = {
				x: reference.x - floating.width,
				y: commonY
			};
			break;
		default: coords = {
			x: reference.x,
			y: reference.y
		};
	}
	const alignment = getAlignment(placement);
	if (alignment) coords[alignmentAxis] += commonAlign * (alignment === "end" ? 1 : -1) * (rtl && isVertical ? -1 : 1);
	return coords;
}
/**
* Resolves with an object of overflow side offsets that determine how much the
* element is overflowing a given clipping boundary on each side.
* - positive = overflowing the boundary by that number of pixels
* - negative = how many pixels left before it will overflow
* - 0 = lies flush with the boundary
* @see https://floating-ui.com/docs/detectOverflow
*/
async function detectOverflow(state, options) {
	var _await$platform$isEle;
	if (options === void 0) options = {};
	const { x, y, platform, rects, elements, strategy } = state;
	const { boundary = "clippingAncestors", rootBoundary = "viewport", elementContext = "floating", altBoundary = false, padding = 0 } = evaluate(options, state);
	const paddingObject = getPaddingObject(padding);
	const element = elements[altBoundary ? elementContext === "floating" ? "reference" : "floating" : elementContext];
	const clippingClientRect = rectToClientRect(await platform.getClippingRect({
		element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating)),
		boundary,
		rootBoundary,
		strategy
	}));
	const rect = elementContext === "floating" ? {
		x,
		y,
		width: rects.floating.width,
		height: rects.floating.height
	} : rects.reference;
	const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
	const offsetScale = await (platform.isElement == null ? void 0 : platform.isElement(offsetParent)) && await (platform.getScale == null ? void 0 : platform.getScale(offsetParent)) || {
		x: 1,
		y: 1
	};
	const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
		elements,
		rect,
		offsetParent,
		strategy
	}) : rect);
	return {
		top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
		bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
		left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
		right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
	};
}
var MAX_RESET_COUNT = 50;
/**
* Computes the `x` and `y` coordinates that will place the floating element
* next to a given reference element.
*
* This export does not have any `platform` interface logic. You will need to
* write one for the platform you are using Floating UI with.
*/
var computePosition$1 = async (reference, floating, config) => {
	const { placement = "bottom", strategy = "absolute", middleware = [], platform } = config;
	const platformWithDetectOverflow = platform.detectOverflow ? platform : {
		...platform,
		detectOverflow
	};
	const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
	let rects = await platform.getElementRects({
		reference,
		floating,
		strategy
	});
	let { x, y } = computeCoordsFromPlacement(rects, placement, rtl);
	let statefulPlacement = placement;
	let resetCount = 0;
	const middlewareData = {};
	for (let i = 0; i < middleware.length; i++) {
		const currentMiddleware = middleware[i];
		if (!currentMiddleware) continue;
		const { name, fn } = currentMiddleware;
		const { x: nextX, y: nextY, data, reset } = await fn({
			x,
			y,
			initialPlacement: placement,
			placement: statefulPlacement,
			strategy,
			middlewareData,
			rects,
			platform: platformWithDetectOverflow,
			elements: {
				reference,
				floating
			}
		});
		x = nextX != null ? nextX : x;
		y = nextY != null ? nextY : y;
		middlewareData[name] = {
			...middlewareData[name],
			...data
		};
		if (reset && resetCount < MAX_RESET_COUNT) {
			resetCount++;
			if (typeof reset === "object") {
				if (reset.placement) statefulPlacement = reset.placement;
				if (reset.rects) rects = reset.rects === true ? await platform.getElementRects({
					reference,
					floating,
					strategy
				}) : reset.rects;
				({x, y} = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
			}
			i = -1;
		}
	}
	return {
		x,
		y,
		placement: statefulPlacement,
		strategy,
		middlewareData
	};
};
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* @see https://floating-ui.com/docs/arrow
*/
var arrow$2 = (options) => ({
	name: "arrow",
	options,
	async fn(state) {
		const { x, y, placement, rects, platform, elements, middlewareData } = state;
		const { element, padding = 0 } = evaluate(options, state) || {};
		if (element == null) return {};
		const paddingObject = getPaddingObject(padding);
		const coords = {
			x,
			y
		};
		const axis = getAlignmentAxis(placement);
		const length = getAxisLength(axis);
		const arrowDimensions = await platform.getDimensions(element);
		const isYAxis = axis === "y";
		const minProp = isYAxis ? "top" : "left";
		const maxProp = isYAxis ? "bottom" : "right";
		const clientProp = isYAxis ? "clientHeight" : "clientWidth";
		const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
		const startDiff = coords[axis] - rects.reference[axis];
		const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
		let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
		if (!clientSize || !await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent))) clientSize = elements.floating[clientProp] || rects.floating[length];
		const centerToReference = endDiff / 2 - startDiff / 2;
		const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
		const minPadding = min(paddingObject[minProp], largestPossiblePadding);
		const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
		const max = clientSize - arrowDimensions[length] - maxPadding;
		const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
		const offset = clamp(minPadding, center, max);
		const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset && rects.reference[length] / 2 - (center < minPadding ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
		const alignmentOffset = shouldAddOffset ? center < minPadding ? center - minPadding : center - max : 0;
		return {
			[axis]: coords[axis] + alignmentOffset,
			data: {
				[axis]: offset,
				centerOffset: center - offset - alignmentOffset,
				...shouldAddOffset && { alignmentOffset }
			},
			reset: shouldAddOffset
		};
	}
});
/**
* Optimizes the visibility of the floating element by flipping the `placement`
* in order to keep it in view when the preferred placement(s) will overflow the
* clipping boundary. Alternative to `autoPlacement`.
* @see https://floating-ui.com/docs/flip
*/
var flip$1 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "flip",
		options,
		async fn(state) {
			var _middlewareData$arrow, _middlewareData$flip;
			const { placement, middlewareData, rects, initialPlacement, platform, elements } = state;
			const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = true, fallbackPlacements: specifiedFallbackPlacements, fallbackStrategy = "bestFit", fallbackAxisSideDirection = "none", flipAlignment = true, ...detectOverflowOptions } = evaluate(options, state);
			if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) return {};
			const side = getSide(placement);
			const initialSideAxis = getSideAxis(initialPlacement);
			const isBasePlacement = getSide(initialPlacement) === initialPlacement;
			const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
			const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
			const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
			if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
			const placements = [initialPlacement, ...fallbackPlacements];
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const overflows = [];
			let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
			if (checkMainAxis) overflows.push(overflow[side]);
			if (checkCrossAxis) {
				const sides = getAlignmentSides(placement, rects, rtl);
				overflows.push(overflow[sides[0]], overflow[sides[1]]);
			}
			overflowsData = [...overflowsData, {
				placement,
				overflows
			}];
			if (!overflows.every((side) => side <= 0)) {
				var _middlewareData$flip2, _overflowsData$filter;
				const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
				const nextPlacement = placements[nextIndex];
				if (nextPlacement) {
					if (!(checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false) || overflowsData.every((d) => getSideAxis(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) return {
						data: {
							index: nextIndex,
							overflows: overflowsData
						},
						reset: { placement: nextPlacement }
					};
				}
				let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
				if (!resetPlacement) switch (fallbackStrategy) {
					case "bestFit": {
						var _overflowsData$filter2;
						const placement = (_overflowsData$filter2 = overflowsData.filter((d) => {
							if (hasFallbackAxisSideDirection) {
								const currentSideAxis = getSideAxis(d.placement);
								return currentSideAxis === initialSideAxis || currentSideAxis === "y";
							}
							return true;
						}).map((d) => [d.placement, d.overflows.filter((overflow) => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
						if (placement) resetPlacement = placement;
						break;
					}
					case "initialPlacement": resetPlacement = initialPlacement;
				}
				if (placement !== resetPlacement) return { reset: { placement: resetPlacement } };
			}
			return {};
		}
	};
};
function getSideOffsets(overflow, rect) {
	return {
		top: overflow.top - rect.height,
		right: overflow.right - rect.width,
		bottom: overflow.bottom - rect.height,
		left: overflow.left - rect.width
	};
}
function isAnySideFullyClipped(overflow) {
	return sides.some((side) => overflow[side] >= 0);
}
/**
* Provides data to hide the floating element in applicable situations, such as
* when it is not in the same clipping context as the reference element.
* @see https://floating-ui.com/docs/hide
*/
var hide$1 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "hide",
		options,
		async fn(state) {
			const { rects, platform } = state;
			const { strategy = "referenceHidden", ...detectOverflowOptions } = evaluate(options, state);
			switch (strategy) {
				case "referenceHidden": {
					const offsets = getSideOffsets(await platform.detectOverflow(state, {
						...detectOverflowOptions,
						elementContext: "reference"
					}), rects.reference);
					return { data: {
						referenceHiddenOffsets: offsets,
						referenceHidden: isAnySideFullyClipped(offsets)
					} };
				}
				case "escaped": {
					const offsets = getSideOffsets(await platform.detectOverflow(state, {
						...detectOverflowOptions,
						altBoundary: true
					}), rects.floating);
					return { data: {
						escapedOffsets: offsets,
						escaped: isAnySideFullyClipped(offsets)
					} };
				}
				default: return {};
			}
		}
	};
};
var originSides = /*#__PURE__*/ new Set(["left", "top"]);
async function convertValueToCoords(state, options) {
	const { placement, platform, elements } = state;
	const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
	const side = getSide(placement);
	const alignment = getAlignment(placement);
	const isVertical = getSideAxis(placement) === "y";
	const mainAxisMulti = originSides.has(side) ? -1 : 1;
	const crossAxisMulti = rtl && isVertical ? -1 : 1;
	const rawValue = evaluate(options, state);
	let { mainAxis, crossAxis, alignmentAxis } = typeof rawValue === "number" ? {
		mainAxis: rawValue,
		crossAxis: 0,
		alignmentAxis: null
	} : {
		mainAxis: rawValue.mainAxis || 0,
		crossAxis: rawValue.crossAxis || 0,
		alignmentAxis: rawValue.alignmentAxis
	};
	if (alignment && typeof alignmentAxis === "number") crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
	return isVertical ? {
		x: crossAxis * crossAxisMulti,
		y: mainAxis * mainAxisMulti
	} : {
		x: mainAxis * mainAxisMulti,
		y: crossAxis * crossAxisMulti
	};
}
/**
* Modifies the placement by translating the floating element along the
* specified axes.
* A number (shorthand for `mainAxis` or distance), or an axes configuration
* object may be passed.
* @see https://floating-ui.com/docs/offset
*/
var offset$1 = function(options) {
	if (options === void 0) options = 0;
	return {
		name: "offset",
		options,
		async fn(state) {
			var _middlewareData$offse, _middlewareData$arrow;
			const { x, y, placement, middlewareData } = state;
			const diffCoords = await convertValueToCoords(state, options);
			if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) return {};
			return {
				x: x + diffCoords.x,
				y: y + diffCoords.y,
				data: {
					...diffCoords,
					placement
				}
			};
		}
	};
};
/**
* Optimizes the visibility of the floating element by shifting it in order to
* keep it in view when it will overflow the clipping boundary.
* @see https://floating-ui.com/docs/shift
*/
var shift$1 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "shift",
		options,
		async fn(state) {
			const { x, y, placement, platform } = state;
			const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = false, limiter = { fn: (_ref) => {
				let { x, y } = _ref;
				return {
					x,
					y
				};
			} }, ...detectOverflowOptions } = evaluate(options, state);
			const coords = {
				x,
				y
			};
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const crossAxis = getSideAxis(placement);
			const mainAxis = getOppositeAxis(crossAxis);
			let mainAxisCoord = coords[mainAxis];
			let crossAxisCoord = coords[crossAxis];
			const clampCoord = (axis, coord) => clamp(coord + overflow[axis === "y" ? "top" : "left"], coord, coord - overflow[axis === "y" ? "bottom" : "right"]);
			if (checkMainAxis) mainAxisCoord = clampCoord(mainAxis, mainAxisCoord);
			if (checkCrossAxis) crossAxisCoord = clampCoord(crossAxis, crossAxisCoord);
			const limitedCoords = limiter.fn({
				...state,
				[mainAxis]: mainAxisCoord,
				[crossAxis]: crossAxisCoord
			});
			return {
				...limitedCoords,
				data: {
					x: limitedCoords.x - x,
					y: limitedCoords.y - y,
					enabled: {
						[mainAxis]: checkMainAxis,
						[crossAxis]: checkCrossAxis
					}
				}
			};
		}
	};
};
/**
* Built-in `limiter` that will stop `shift()` at a certain point.
*/
var limitShift$1 = function(options) {
	if (options === void 0) options = {};
	return {
		options,
		fn(state) {
			var _rawOffset$mainAxis, _rawOffset$crossAxis;
			const { x, y, placement, rects, middlewareData } = state;
			const { offset = 0, mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = true } = evaluate(options, state);
			const coords = {
				x,
				y
			};
			const crossAxis = getSideAxis(placement);
			const mainAxis = getOppositeAxis(crossAxis);
			let mainAxisCoord = coords[mainAxis];
			let crossAxisCoord = coords[crossAxis];
			const rawOffset = evaluate(offset, state);
			const computedOffset = typeof rawOffset === "number" ? {
				mainAxis: rawOffset,
				crossAxis: 0
			} : {
				mainAxis: (_rawOffset$mainAxis = rawOffset.mainAxis) != null ? _rawOffset$mainAxis : 0,
				crossAxis: (_rawOffset$crossAxis = rawOffset.crossAxis) != null ? _rawOffset$crossAxis : 0
			};
			if (checkMainAxis) {
				const len = mainAxis === "y" ? "height" : "width";
				const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
				const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
				if (mainAxisCoord < limitMin) mainAxisCoord = limitMin;
				else if (mainAxisCoord > limitMax) mainAxisCoord = limitMax;
			}
			if (checkCrossAxis) {
				var _middlewareData$offse, _middlewareData$offse2;
				const len = mainAxis === "y" ? "width" : "height";
				const isOriginSide = originSides.has(getSide(placement));
				const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
				const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
				if (crossAxisCoord < limitMin) crossAxisCoord = limitMin;
				else if (crossAxisCoord > limitMax) crossAxisCoord = limitMax;
			}
			return {
				[mainAxis]: mainAxisCoord,
				[crossAxis]: crossAxisCoord
			};
		}
	};
};
/**
* Provides data that allows you to change the size of the floating element —
* for instance, prevent it from overflowing the clipping boundary or match the
* width of the reference element.
* @see https://floating-ui.com/docs/size
*/
var size$1 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "size",
		options,
		async fn(state) {
			const { placement, rects, platform, elements } = state;
			const { apply = () => {}, ...detectOverflowOptions } = evaluate(options, state);
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const side = getSide(placement);
			const alignment = getAlignment(placement);
			const isYAxis = getSideAxis(placement) === "y";
			const { width, height } = rects.floating;
			let heightSide;
			let widthSide;
			if (side === "top" || side === "bottom") {
				heightSide = side;
				widthSide = alignment === (await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
			} else {
				widthSide = side;
				heightSide = alignment === "end" ? "top" : "bottom";
			}
			const maximumClippingHeight = height - overflow.top - overflow.bottom;
			const maximumClippingWidth = width - overflow.left - overflow.right;
			const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
			const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
			const shiftData = state.middlewareData.shift;
			const noShift = !shiftData;
			let availableHeight = overflowAvailableHeight;
			let availableWidth = overflowAvailableWidth;
			if (shiftData != null && shiftData.enabled.x) availableWidth = maximumClippingWidth;
			if (shiftData != null && shiftData.enabled.y) availableHeight = maximumClippingHeight;
			if (noShift && !alignment) {
				if (isYAxis) availableWidth = width - 2 * max(overflow.left, overflow.right);
				else availableHeight = height - 2 * max(overflow.top, overflow.bottom);
			}
			await apply({
				...state,
				availableWidth,
				availableHeight
			});
			const nextDimensions = await platform.getDimensions(elements.floating);
			if (width !== nextDimensions.width || height !== nextDimensions.height) return { reset: { rects: true } };
			return {};
		}
	};
};
function getNodeName(node) {
	if (isNode()) return (node.nodeName || "").toLowerCase();
	return "#document";
}
function getWindow(node) {
	var _node$ownerDocument;
	return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || void 0;
}
function getDocumentElement(node) {
	var _ref;
	return (_ref = (isNode() ? node.ownerDocument : node.document) || (void 0).document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
	return false;
}
function isElement(value) {
	return false;
}
function isHTMLElement(value) {
	return false;
}
function isShadowRoot(value) {
	return false;
}
function isOverflowElement(element) {
	const { overflow, overflowX, overflowY, display } = getComputedStyle$1(element);
	return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== "inline" && display !== "contents";
}
function isTableElement(element) {
	return /^(table|td|th)$/.test(getNodeName(element));
}
function isTopLayer(element) {
	try {
		if (element.matches(":popover-open")) return true;
	} catch (_e) {}
	try {
		return element.matches(":modal");
	} catch (_e) {
		return false;
	}
}
var willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
var containRe = /paint|layout|strict|content/;
var isNotNone = (value) => !!value && value !== "none";
var isWebKitValue;
function isContainingBlock(elementOrCss) {
	const css = isElement() ? getComputedStyle$1(elementOrCss) : elementOrCss;
	return isNotNone(css.transform) || isNotNone(css.translate) || isNotNone(css.scale) || isNotNone(css.rotate) || isNotNone(css.perspective) || !isWebKit() && (isNotNone(css.backdropFilter) || isNotNone(css.filter)) || willChangeRe.test(css.willChange || "") || containRe.test(css.contain || "");
}
function getContainingBlock(element) {
	let currentNode = getParentNode(element);
	while (isHTMLElement() && !isLastTraversableNode(currentNode)) {
		if (isContainingBlock(currentNode)) return currentNode;
		else if (isTopLayer(currentNode)) return null;
		currentNode = getParentNode(currentNode);
	}
	return null;
}
function isWebKit() {
	if (isWebKitValue == null) isWebKitValue = typeof CSS !== "undefined" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none");
	return isWebKitValue;
}
function isLastTraversableNode(node) {
	return /^(html|body|#document)$/.test(getNodeName(node));
}
function getComputedStyle$1(element) {
	return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
	if (isElement()) return {
		scrollLeft: element.scrollLeft,
		scrollTop: element.scrollTop
	};
	return {
		scrollLeft: element.scrollX,
		scrollTop: element.scrollY
	};
}
function getParentNode(node) {
	if (getNodeName(node) === "html") return node;
	const result = node.assignedSlot || node.parentNode || isShadowRoot() && node.host || getDocumentElement(node);
	return isShadowRoot() ? result.host : result;
}
function getNearestOverflowAncestor(node) {
	const parentNode = getParentNode(node);
	if (isLastTraversableNode(parentNode)) return (node.ownerDocument || node).body;
	if (isHTMLElement() && isOverflowElement(parentNode)) return parentNode;
	return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
	var _node$ownerDocument2;
	if (list === void 0) list = [];
	if (traverseIframes === void 0) traverseIframes = true;
	const scrollableAncestor = getNearestOverflowAncestor(node);
	const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
	const win = getWindow(scrollableAncestor);
	if (isBody) {
		const frameElement = getFrameElement(win);
		return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
	} else return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
	return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}
//#endregion
//#region node_modules/.pnpm/@floating-ui+dom@1.8.0/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function getCssDimensions(element) {
	const css = getComputedStyle$1(element);
	let width = parseFloat(css.width) || 0;
	let height = parseFloat(css.height) || 0;
	const hasOffset = isHTMLElement();
	const offsetWidth = hasOffset ? element.offsetWidth : width;
	const offsetHeight = hasOffset ? element.offsetHeight : height;
	const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
	if (shouldFallback) {
		width = offsetWidth;
		height = offsetHeight;
	}
	return {
		width,
		height,
		$: shouldFallback
	};
}
function unwrapElement$1(element) {
	return !isElement() ? element.contextElement : element;
}
function getScale(element) {
	const domElement = unwrapElement$1(element);
	if (!isHTMLElement()) return createCoords(1);
	const rect = domElement.getBoundingClientRect();
	const { width, height, $ } = getCssDimensions(domElement);
	let x = ($ ? round(rect.width) : rect.width) / width;
	let y = ($ ? round(rect.height) : rect.height) / height;
	if (!x || !Number.isFinite(x)) x = 1;
	if (!y || !Number.isFinite(y)) y = 1;
	return {
		x,
		y
	};
}
var noOffsets = /*#__PURE__*/ createCoords(0);
function getVisualOffsets(element) {
	const win = getWindow(element);
	if (!isWebKit() || !win.visualViewport) return noOffsets;
	return {
		x: win.visualViewport.offsetLeft,
		y: win.visualViewport.offsetTop
	};
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
	if (isFixed === void 0) isFixed = false;
	return !!floatingOffsetParent && isFixed && floatingOffsetParent === getWindow(element);
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
	if (includeScale === void 0) includeScale = false;
	if (isFixedStrategy === void 0) isFixedStrategy = false;
	const clientRect = element.getBoundingClientRect();
	const domElement = unwrapElement$1(element);
	let scale = createCoords(1);
	if (includeScale) {
		if (offsetParent) {
			if (isElement()) scale = getScale(offsetParent);
		} else scale = getScale(element);
	}
	const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
	let x = (clientRect.left + visualOffsets.x) / scale.x;
	let y = (clientRect.top + visualOffsets.y) / scale.y;
	let width = clientRect.width / scale.x;
	let height = clientRect.height / scale.y;
	if (domElement && offsetParent) {
		const win = getWindow(domElement);
		const offsetWin = isElement() ? getWindow(offsetParent) : offsetParent;
		let currentWin = win;
		let currentIFrame = getFrameElement(currentWin);
		while (currentIFrame && offsetWin !== currentWin) {
			const iframeScale = getScale(currentIFrame);
			const iframeRect = currentIFrame.getBoundingClientRect();
			const css = getComputedStyle$1(currentIFrame);
			const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
			const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
			x *= iframeScale.x;
			y *= iframeScale.y;
			width *= iframeScale.x;
			height *= iframeScale.y;
			x += left;
			y += top;
			currentWin = getWindow(currentIFrame);
			currentIFrame = getFrameElement(currentWin);
		}
	}
	return rectToClientRect({
		width,
		height,
		x,
		y
	});
}
function getWindowScrollBarX(element, rect) {
	const leftScroll = getNodeScroll(element).scrollLeft;
	if (!rect) return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
	return rect.left + leftScroll;
}
function getHTMLOffset(documentElement, scroll) {
	const htmlRect = documentElement.getBoundingClientRect();
	return {
		x: htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect),
		y: htmlRect.top + scroll.scrollTop
	};
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
	let { elements, rect, offsetParent, strategy } = _ref;
	const isFixed = strategy === "fixed";
	const documentElement = getDocumentElement(offsetParent);
	const topLayer = elements ? isTopLayer(elements.floating) : false;
	if (offsetParent === documentElement || topLayer && isFixed) return rect;
	let scroll = {
		scrollLeft: 0,
		scrollTop: 0
	};
	let scale = createCoords(1);
	const offsets = createCoords(0);
	const isOffsetParentAnElement = isHTMLElement();
	if (isOffsetParentAnElement || !isFixed) {
		if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) scroll = getNodeScroll(offsetParent);
		if (isOffsetParentAnElement) {
			const offsetRect = getBoundingClientRect(offsetParent);
			scale = getScale(offsetParent);
			offsets.x = offsetRect.x + offsetParent.clientLeft;
			offsets.y = offsetRect.y + offsetParent.clientTop;
		}
	}
	const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
	return {
		width: rect.width * scale.x,
		height: rect.height * scale.y,
		x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
		y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
	};
}
function getClientRects(element) {
	return element.getClientRects ? Array.from(element.getClientRects()) : [];
}
function getDocumentRect(html) {
	const scroll = getNodeScroll(html);
	const body = html.ownerDocument.body;
	const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
	const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
	let x = -scroll.scrollLeft + getWindowScrollBarX(html);
	const y = -scroll.scrollTop;
	if (getComputedStyle$1(body).direction === "rtl") x += max(html.clientWidth, body.clientWidth) - width;
	return {
		width,
		height,
		x,
		y
	};
}
var SCROLLBAR_MAX = 25;
function getViewportRect(element, strategy, rootBoundary) {
	if (rootBoundary === void 0) rootBoundary = "viewport";
	const isLayoutViewport = rootBoundary === "layoutViewport";
	const win = getWindow(element);
	const html = getDocumentElement(element);
	const visualViewport = win.visualViewport;
	let width = html.clientWidth;
	let height = html.clientHeight;
	let x = 0;
	let y = 0;
	if (visualViewport) {
		const layoutRelativeClientCoords = !isWebKit() || strategy === "fixed";
		if (isLayoutViewport) {
			if (!layoutRelativeClientCoords) {
				x = -visualViewport.offsetLeft;
				y = -visualViewport.offsetTop;
			}
		} else {
			width = visualViewport.width;
			height = visualViewport.height;
			if (layoutRelativeClientCoords) {
				x = visualViewport.offsetLeft;
				y = visualViewport.offsetTop;
			}
		}
	}
	if (getWindowScrollBarX(html) <= 0) {
		const doc = html.ownerDocument;
		const body = doc.body;
		const bodyStyles = getComputedStyle(body);
		const bodyMarginInline = doc.compatMode === "CSS1Compat" ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
		const reservedWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
		const gutter = getComputedStyle(html).scrollbarGutter === "stable both-edges" ? reservedWidth / 2 : reservedWidth;
		if (gutter <= SCROLLBAR_MAX) width -= gutter;
	}
	return {
		width,
		height,
		x,
		y
	};
}
function getInnerBoundingClientRect(element, strategy) {
	const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
	const top = clientRect.top + element.clientTop;
	const left = clientRect.left + element.clientLeft;
	const scale = getScale(element);
	return {
		width: element.clientWidth * scale.x,
		height: element.clientHeight * scale.y,
		x: left * scale.x,
		y: top * scale.y
	};
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
	let rect;
	if (clippingAncestor === "viewport" || clippingAncestor === "layoutViewport") rect = getViewportRect(element, strategy, clippingAncestor);
	else if (clippingAncestor === "document") rect = getDocumentRect(getDocumentElement(element));
	else if (isElement()) rect = getInnerBoundingClientRect(clippingAncestor, strategy);
	else {
		const visualOffsets = getVisualOffsets(element);
		rect = {
			x: clippingAncestor.x - visualOffsets.x,
			y: clippingAncestor.y - visualOffsets.y,
			width: clippingAncestor.width,
			height: clippingAncestor.height
		};
	}
	return rectToClientRect(rect);
}
function getClippingElementAncestors(element, cache) {
	const cachedResult = cache.get(element);
	if (cachedResult) return cachedResult;
	let result = getOverflowAncestors(element, [], false).filter((el) => isElement() && getNodeName(el) !== "body");
	let lastKeptComputedStyle = null;
	const elementIsFixed = getComputedStyle$1(element).position === "fixed";
	let currentNode = elementIsFixed ? getParentNode(element) : element;
	while (isElement() && !isLastTraversableNode(currentNode)) {
		const computedStyle = getComputedStyle$1(currentNode);
		const currentNodeIsContaining = isContainingBlock(currentNode);
		const lastPosition = lastKeptComputedStyle ? lastKeptComputedStyle.position : elementIsFixed ? "fixed" : "";
		if (!currentNodeIsContaining && (lastPosition === "fixed" || lastPosition === "absolute" && computedStyle.position === "static")) result = result.filter((ancestor) => ancestor !== currentNode);
		else lastKeptComputedStyle = computedStyle;
		currentNode = getParentNode(currentNode);
	}
	cache.set(element, result);
	return result;
}
function getClippingRect(_ref) {
	let { element, boundary, rootBoundary, strategy } = _ref;
	const clippingAncestors = [...boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary), rootBoundary];
	const firstRect = getClientRectFromClippingAncestor(element, clippingAncestors[0], strategy);
	let top = firstRect.top;
	let right = firstRect.right;
	let bottom = firstRect.bottom;
	let left = firstRect.left;
	for (let i = 1; i < clippingAncestors.length; i++) {
		const rect = getClientRectFromClippingAncestor(element, clippingAncestors[i], strategy);
		top = max(rect.top, top);
		right = min(rect.right, right);
		bottom = min(rect.bottom, bottom);
		left = max(rect.left, left);
	}
	return {
		width: right - left,
		height: bottom - top,
		x: left,
		y: top
	};
}
function getDimensions(element) {
	const { width, height } = getCssDimensions(element);
	return {
		width,
		height
	};
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
	const isOffsetParentAnElement = isHTMLElement();
	const documentElement = getDocumentElement(offsetParent);
	const isFixed = strategy === "fixed";
	const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
	let scroll = {
		scrollLeft: 0,
		scrollTop: 0
	};
	const offsets = createCoords(0);
	if (isOffsetParentAnElement || !isFixed) {
		if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) scroll = getNodeScroll(offsetParent);
		if (isOffsetParentAnElement) {
			const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
			offsets.x = offsetRect.x + offsetParent.clientLeft;
			offsets.y = offsetRect.y + offsetParent.clientTop;
		}
	}
	if (!isOffsetParentAnElement && documentElement) offsets.x = getWindowScrollBarX(documentElement);
	const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
	return {
		x: rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x,
		y: rect.top + scroll.scrollTop - offsets.y - htmlOffset.y,
		width: rect.width,
		height: rect.height
	};
}
function isStaticPositioned(element) {
	return getComputedStyle$1(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
	if (!isHTMLElement() || getComputedStyle$1(element).position === "fixed") return null;
	if (polyfill) return polyfill(element);
	let rawOffsetParent = element.offsetParent;
	if (getDocumentElement(element) === rawOffsetParent) rawOffsetParent = rawOffsetParent.ownerDocument.body;
	return rawOffsetParent;
}
function getOffsetParent(element, polyfill) {
	const win = getWindow(element);
	if (isTopLayer(element)) return win;
	if (!isHTMLElement()) {
		let svgOffsetParent = getParentNode(element);
		while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
			if (isElement() && !isStaticPositioned(svgOffsetParent)) return svgOffsetParent;
			svgOffsetParent = getParentNode(svgOffsetParent);
		}
		return win;
	}
	let offsetParent = getTrueOffsetParent(element, polyfill);
	while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) offsetParent = getTrueOffsetParent(offsetParent, polyfill);
	if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) return win;
	return offsetParent || getContainingBlock(element) || win;
}
var getElementRects = async function(data) {
	const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
	const getDimensionsFn = this.getDimensions;
	const floatingDimensions = await getDimensionsFn(data.floating);
	return {
		reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
		floating: {
			x: 0,
			y: 0,
			width: floatingDimensions.width,
			height: floatingDimensions.height
		}
	};
};
function isRTL(element) {
	return getComputedStyle$1(element).direction === "rtl";
}
var platform = {
	convertOffsetParentRelativeRectToViewportRelativeRect,
	getDocumentElement,
	getClippingRect,
	getOffsetParent,
	getElementRects,
	getClientRects,
	getDimensions,
	getScale,
	isElement,
	isRTL
};
function rectsAreEqual(a, b) {
	return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}
function observeMove(element, onMove, ancestorResize) {
	let io = null;
	let timeoutId;
	const root = getDocumentElement(element);
	function cleanup() {
		var _io;
		clearTimeout(timeoutId);
		(_io = io) == null || _io.disconnect();
		io = null;
	}
	function refresh(skip, threshold) {
		if (skip === void 0) skip = false;
		if (threshold === void 0) threshold = 1;
		cleanup();
		const elementRectForRootMargin = element.getBoundingClientRect();
		const { left, top, width, height } = elementRectForRootMargin;
		if (!skip) onMove();
		if (!width || !height) return;
		const insetTop = floor(top);
		const insetRight = floor(root.clientWidth - (left + width));
		const insetBottom = floor(root.clientHeight - (top + height));
		const insetLeft = floor(left);
		const options = {
			rootMargin: -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px",
			threshold: max(0, min(1, threshold)) || 1
		};
		let isFirstUpdate = true;
		function handleObserve(entries) {
			const ratio = entries[0].intersectionRatio;
			if (!rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) return refresh();
			if (ratio !== threshold) {
				if (!isFirstUpdate) return refresh();
				if (!ratio) timeoutId = setTimeout(() => {
					refresh(false, 1e-7);
				}, 1e3);
				else refresh(false, ratio);
			}
			isFirstUpdate = false;
		}
		try {
			io = new IntersectionObserver(handleObserve, {
				...options,
				root: root.ownerDocument
			});
		} catch (_e) {
			io = new IntersectionObserver(handleObserve, options);
		}
		io.observe(element);
	}
	const win = getWindow(element);
	const handleResize = () => refresh(ancestorResize);
	win.addEventListener("resize", handleResize);
	refresh(true);
	return () => {
		win.removeEventListener("resize", handleResize);
		cleanup();
	};
}
/**
* Automatically updates the position of the floating element when necessary.
* Should only be called when the floating element is mounted on the DOM or
* visible on the screen.
* @returns cleanup function that should be invoked when the floating element is
* removed from the DOM or hidden from the screen.
* @see https://floating-ui.com/docs/autoUpdate
*/
function autoUpdate(reference, floating, update, options) {
	if (options === void 0) options = {};
	const { ancestorScroll = true, ancestorResize = true, elementResize = typeof ResizeObserver === "function", layoutShift = typeof IntersectionObserver === "function", animationFrame = false } = options;
	const referenceEl = unwrapElement$1(reference);
	const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...floating ? getOverflowAncestors(floating) : []] : [];
	ancestors.forEach((ancestor) => {
		ancestorScroll && ancestor.addEventListener("scroll", update);
		ancestorResize && ancestor.addEventListener("resize", update);
	});
	const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update, ancestorResize) : null;
	let reobserveFrame = -1;
	let resizeObserver = null;
	if (elementResize) {
		resizeObserver = new ResizeObserver((_ref) => {
			let [firstEntry] = _ref;
			if (firstEntry && firstEntry.target === referenceEl && resizeObserver && floating) {
				resizeObserver.unobserve(floating);
				cancelAnimationFrame(reobserveFrame);
				reobserveFrame = requestAnimationFrame(() => {
					var _resizeObserver;
					(_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
				});
			}
			update();
		});
		if (referenceEl && !animationFrame) resizeObserver.observe(referenceEl);
		if (floating) resizeObserver.observe(floating);
	}
	let frameId;
	let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
	if (animationFrame) frameLoop();
	function frameLoop() {
		const nextRefRect = getBoundingClientRect(reference);
		if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) update();
		prevRefRect = nextRefRect;
		frameId = requestAnimationFrame(frameLoop);
	}
	update();
	return () => {
		var _resizeObserver2;
		ancestors.forEach((ancestor) => {
			ancestorScroll && ancestor.removeEventListener("scroll", update);
			ancestorResize && ancestor.removeEventListener("resize", update);
		});
		cleanupIo?.();
		(_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
		resizeObserver = null;
		if (animationFrame) cancelAnimationFrame(frameId);
	};
}
/**
* Modifies the placement by translating the floating element along the
* specified axes.
* A number (shorthand for `mainAxis` or distance), or an axes configuration
* object may be passed.
* @see https://floating-ui.com/docs/offset
*/
var offset = offset$1;
/**
* Optimizes the visibility of the floating element by shifting it in order to
* keep it in view when it will overflow the clipping boundary.
* @see https://floating-ui.com/docs/shift
*/
var shift = shift$1;
/**
* Optimizes the visibility of the floating element by flipping the `placement`
* in order to keep it in view when the preferred placement(s) will overflow the
* clipping boundary. Alternative to `autoPlacement`.
* @see https://floating-ui.com/docs/flip
*/
var flip = flip$1;
/**
* Provides data that allows you to change the size of the floating element —
* for instance, prevent it from overflowing the clipping boundary or match the
* width of the reference element.
* @see https://floating-ui.com/docs/size
*/
var size = size$1;
/**
* Provides data to hide the floating element in applicable situations, such as
* when it is not in the same clipping context as the reference element.
* @see https://floating-ui.com/docs/hide
*/
var hide = hide$1;
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* @see https://floating-ui.com/docs/arrow
*/
var arrow$1 = arrow$2;
/**
* Built-in `limiter` that will stop `shift()` at a certain point.
*/
var limitShift = limitShift$1;
/**
* Computes the `x` and `y` coordinates that will place the floating element
* next to a given reference element.
*/
var computePosition = (reference, floating, options) => {
	const cache = /* @__PURE__ */ new Map();
	const mergedOptions = options != null ? options : {};
	const platformWithCache = {
		...platform,
		...mergedOptions.platform,
		_c: cache
	};
	return computePosition$1(reference, floating, {
		...mergedOptions,
		platform: platformWithCache
	});
};
__reExport(/* @__PURE__ */ __exportAll({
	del: () => del,
	install: () => install,
	set: () => set
}), vue_exports);
var install = () => {};
function set(target, key, val) {
	if (Array.isArray(target)) {
		target.length = Math.max(target.length, key);
		target.splice(key, 1, val);
		return val;
	}
	target[key] = val;
	return val;
}
function del(target, key) {
	if (Array.isArray(target)) {
		target.splice(key, 1);
		return;
	}
	delete target[key];
}
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-sy_2642c4b94b748e7cd728207476161789/node_modules/nuxt/dist/app/compat/vue-demi.js
var vue_demi_exports = /* @__PURE__ */ __exportAll({
	Vue2: () => void 0,
	del: () => del,
	install: () => install,
	isVue2: () => false,
	isVue3: () => true,
	set: () => set
});
__reExport(vue_demi_exports, vue_exports);
//#endregion
//#region node_modules/.pnpm/@floating-ui+vue@1.1.11_vue@3.5.42_typescript@6.0.3_/node_modules/@floating-ui/vue/dist/floating-ui.vue.mjs
function isComponentPublicInstance(target) {
	return target != null && typeof target === "object" && "$el" in target;
}
function unwrapElement(target) {
	if (isComponentPublicInstance(target)) {
		const element = target.$el;
		return isNode() && getNodeName(element) === "#comment" ? null : element;
	}
	return target;
}
function toValue$1(source) {
	return typeof source === "function" ? source() : (0, vue_demi_exports.unref)(source);
}
/**
* Positions an inner element of the floating element such that it is centered to the reference element.
* @param options The arrow options.
* @see https://floating-ui.com/docs/arrow
*/
function arrow(options) {
	return {
		name: "arrow",
		options,
		fn(args) {
			const element = unwrapElement(toValue$1(options.element));
			if (element == null) return {};
			return arrow$1({
				element,
				padding: options.padding
			}).fn(args);
		}
	};
}
function getDPR(element) {
	return 1;
}
function roundByDPR(element, value) {
	const dpr = getDPR();
	return Math.round(value * dpr) / dpr;
}
/**
* Computes the `x` and `y` coordinates that will place the floating element next to a reference element when it is given a certain CSS positioning strategy.
* @param reference The reference template ref.
* @param floating The floating template ref.
* @param options The floating options.
* @see https://floating-ui.com/docs/vue
*/
function useFloating(reference, floating, options) {
	if (options === void 0) options = {};
	const whileElementsMountedOption = options.whileElementsMounted;
	const openOption = (0, vue_demi_exports.computed)(() => {
		var _toValue;
		return (_toValue = toValue$1(options.open)) != null ? _toValue : true;
	});
	const middlewareOption = (0, vue_demi_exports.computed)(() => toValue$1(options.middleware));
	const placementOption = (0, vue_demi_exports.computed)(() => {
		var _toValue2;
		return (_toValue2 = toValue$1(options.placement)) != null ? _toValue2 : "bottom";
	});
	const strategyOption = (0, vue_demi_exports.computed)(() => {
		var _toValue3;
		return (_toValue3 = toValue$1(options.strategy)) != null ? _toValue3 : "absolute";
	});
	const transformOption = (0, vue_demi_exports.computed)(() => {
		var _toValue4;
		return (_toValue4 = toValue$1(options.transform)) != null ? _toValue4 : true;
	});
	const referenceElement = (0, vue_demi_exports.computed)(() => unwrapElement(reference.value));
	const floatingElement = (0, vue_demi_exports.computed)(() => unwrapElement(floating.value));
	const x = (0, vue_demi_exports.ref)(0);
	const y = (0, vue_demi_exports.ref)(0);
	const strategy = (0, vue_demi_exports.ref)(strategyOption.value);
	const placement = (0, vue_demi_exports.ref)(placementOption.value);
	const middlewareData = (0, vue_demi_exports.shallowRef)({});
	const isPositioned = (0, vue_demi_exports.ref)(false);
	const floatingStyles = (0, vue_demi_exports.computed)(() => {
		const initialStyles = {
			position: strategy.value,
			left: "0",
			top: "0"
		};
		if (!floatingElement.value) return initialStyles;
		const xVal = roundByDPR(floatingElement.value, x.value);
		const yVal = roundByDPR(floatingElement.value, y.value);
		if (transformOption.value) return {
			...initialStyles,
			transform: "translate(" + xVal + "px, " + yVal + "px)",
			...getDPR(floatingElement.value) >= 1.5
		};
		return {
			position: strategy.value,
			left: xVal + "px",
			top: yVal + "px"
		};
	});
	let whileElementsMountedCleanup;
	function update() {
		if (referenceElement.value == null || floatingElement.value == null) return;
		const open = openOption.value;
		computePosition(referenceElement.value, floatingElement.value, {
			middleware: middlewareOption.value,
			placement: placementOption.value,
			strategy: strategyOption.value
		}).then((position) => {
			x.value = position.x;
			y.value = position.y;
			strategy.value = position.strategy;
			placement.value = position.placement;
			middlewareData.value = position.middlewareData;
			/**
			* The floating element's position may be recomputed while it's closed
			* but still mounted (such as when transitioning out). To ensure
			* `isPositioned` will be `false` initially on the next open, avoid
			* setting it to `true` when `open === false` (must be specified).
			*/
			isPositioned.value = open !== false;
		});
	}
	function cleanup() {
		if (typeof whileElementsMountedCleanup === "function") {
			whileElementsMountedCleanup();
			whileElementsMountedCleanup = void 0;
		}
	}
	function attach() {
		cleanup();
		if (whileElementsMountedOption === void 0) {
			update();
			return;
		}
		if (referenceElement.value != null && floatingElement.value != null) {
			whileElementsMountedCleanup = whileElementsMountedOption(referenceElement.value, floatingElement.value, update);
			return;
		}
	}
	function reset() {
		if (!openOption.value) isPositioned.value = false;
	}
	(0, vue_demi_exports.watch)([
		middlewareOption,
		placementOption,
		strategyOption,
		openOption
	], update, { flush: "sync" });
	(0, vue_demi_exports.watch)([referenceElement, floatingElement], attach, { flush: "sync" });
	(0, vue_demi_exports.watch)(openOption, reset, { flush: "sync" });
	if ((0, vue_demi_exports.getCurrentScope)()) (0, vue_demi_exports.onScopeDispose)(cleanup);
	return {
		x: (0, vue_demi_exports.shallowReadonly)(x),
		y: (0, vue_demi_exports.shallowReadonly)(y),
		strategy: (0, vue_demi_exports.shallowReadonly)(strategy),
		placement: (0, vue_demi_exports.shallowReadonly)(placement),
		middlewareData: (0, vue_demi_exports.shallowReadonly)(middlewareData),
		isPositioned: (0, vue_demi_exports.shallowReadonly)(isPositioned),
		floatingStyles,
		update
	};
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Popper/PopperContent.js
var _hoisted_1 = ["dir"];
var PopperContentPropsDefaultValue = {
	side: "bottom",
	sideOffset: 0,
	sideFlip: true,
	align: "center",
	alignOffset: 0,
	alignFlip: true,
	arrowPadding: 0,
	hideShiftedArrow: true,
	avoidCollisions: true,
	collisionBoundary: () => [],
	collisionPadding: 0,
	sticky: "partial",
	hideWhenDetached: false,
	positionStrategy: "fixed",
	updatePositionStrategy: "optimized",
	prioritizePosition: false
};
var [injectPopperContentContext, providePopperContentContext] = /*#__PURE__*/ createContext("PopperContent");
var PopperContent_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	inheritAttrs: false,
	__name: "PopperContent",
	props: /* @__PURE__ */ (0, vue_exports.mergeDefaults)({
		memoDependencies: {
			type: Array,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		sideFlip: {
			type: Boolean,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		alignFlip: {
			type: Boolean,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		hideShiftedArrow: {
			type: Boolean,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: false
		},
		prioritizePosition: {
			type: Boolean,
			required: false
		},
		reference: {
			type: null,
			required: false
		},
		dir: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	}, { ...PopperContentPropsDefaultValue }),
	emits: ["placed"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const rootContext = injectPopperRootContext();
		const { forwardRef, currentElement: contentElement } = useForwardExpose();
		const dir = useDirection((0, vue_exports.computed)(() => props.dir));
		const floatingRef = (0, vue_exports.ref)();
		const arrow$1 = (0, vue_exports.ref)();
		const { width: arrowWidth, height: arrowHeight } = useSize();
		const desiredPlacement = (0, vue_exports.computed)(() => props.side + (props.align !== "center" ? `-${props.align}` : ""));
		const collisionPadding = (0, vue_exports.computed)(() => {
			return typeof props.collisionPadding === "number" ? props.collisionPadding : {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				...props.collisionPadding
			};
		});
		const boundary = (0, vue_exports.computed)(() => {
			return Array.isArray(props.collisionBoundary) ? props.collisionBoundary : [props.collisionBoundary];
		});
		const detectOverflowOptions = (0, vue_exports.computed)(() => {
			return {
				padding: collisionPadding.value,
				boundary: boundary.value.filter(isNotNull),
				altBoundary: boundary.value.length > 0
			};
		});
		const flipOptions = (0, vue_exports.computed)(() => {
			return {
				mainAxis: props.sideFlip,
				crossAxis: props.alignFlip
			};
		});
		const computedMiddleware = (0, vue_exports.computed)(() => {
			return [
				offset({
					mainAxis: props.sideOffset + arrowHeight.value,
					alignmentAxis: props.alignOffset
				}),
				props.prioritizePosition && props.avoidCollisions && flip({
					...detectOverflowOptions.value,
					...flipOptions.value
				}),
				props.avoidCollisions && shift({
					mainAxis: true,
					crossAxis: !!props.prioritizePosition,
					limiter: props.sticky === "partial" ? limitShift() : void 0,
					...detectOverflowOptions.value
				}),
				!props.prioritizePosition && props.avoidCollisions && flip({
					...detectOverflowOptions.value,
					...flipOptions.value
				}),
				size({
					...detectOverflowOptions.value,
					apply: ({ elements, rects, availableWidth, availableHeight }) => {
						const { width: anchorWidth, height: anchorHeight } = rects.reference;
						const contentStyle = elements.floating.style;
						contentStyle.setProperty("--reka-popper-available-width", `${availableWidth}px`);
						contentStyle.setProperty("--reka-popper-available-height", `${availableHeight}px`);
						contentStyle.setProperty("--reka-popper-anchor-width", `${anchorWidth}px`);
						contentStyle.setProperty("--reka-popper-anchor-height", `${anchorHeight}px`);
					}
				}),
				arrow$1.value && arrow({
					element: arrow$1.value,
					padding: props.arrowPadding
				}),
				transformOrigin({
					arrowWidth: arrowWidth.value,
					arrowHeight: arrowHeight.value,
					dir: dir.value
				}),
				props.hideWhenDetached && hide({
					strategy: "referenceHidden",
					...detectOverflowOptions.value
				})
			];
		});
		const { floatingStyles, placement, isPositioned, middlewareData} = useFloating((0, vue_exports.computed)(() => props.reference ?? rootContext.anchor.value), floatingRef, {
			strategy: props.positionStrategy,
			placement: desiredPlacement,
			whileElementsMounted: (...args) => {
				return autoUpdate(...args, {
					layoutShift: !props.disableUpdateOnLayoutShift,
					animationFrame: props.updatePositionStrategy === "always"
				});
			},
			middleware: computedMiddleware
		});
		const placedSide = (0, vue_exports.computed)(() => getSideAndAlignFromPlacement(placement.value)[0]);
		const placedAlign = (0, vue_exports.computed)(() => getSideAndAlignFromPlacement(placement.value)[1]);
		(0, vue_exports.watchPostEffect)(() => {
			if (isPositioned.value) emits("placed");
		});
		const shouldHideArrow = (0, vue_exports.computed)(() => {
			const cannotCenterArrow = middlewareData.value.arrow?.centerOffset !== 0;
			return props.hideShiftedArrow && cannotCenterArrow;
		});
		const contentZIndex = (0, vue_exports.ref)("");
		(0, vue_exports.watchEffect)(() => {
			if (contentElement.value) contentZIndex.value = (void 0).getComputedStyle(contentElement.value).zIndex;
		});
		providePopperContentContext({
			placedSide,
			onArrowChange: (element) => arrow$1.value = element,
			arrowX: (0, vue_exports.computed)(() => middlewareData.value.arrow?.x ?? 0),
			arrowY: (0, vue_exports.computed)(() => middlewareData.value.arrow?.y ?? 0),
			shouldHideArrow
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("div", {
				ref_key: "floatingRef",
				ref: floatingRef,
				"data-reka-popper-content-wrapper": "",
				dir: (0, vue_exports.unref)(dir),
				style: (0, vue_exports.normalizeStyle)({
					...(0, vue_exports.unref)(floatingStyles),
					transform: (0, vue_exports.unref)(isPositioned) ? (0, vue_exports.unref)(floatingStyles).transform : "translate(0, -200%)",
					minWidth: "max-content",
					zIndex: contentZIndex.value,
					["--reka-popper-transform-origin"]: [(0, vue_exports.unref)(middlewareData).transformOrigin?.x, (0, vue_exports.unref)(middlewareData).transformOrigin?.y].join(" "),
					...(0, vue_exports.unref)(middlewareData).hide?.referenceHidden && {
						visibility: "hidden",
						pointerEvents: "none"
					}
				})
			}, [props.memoDependencies ? (0, vue_exports.withMemo)([
				props.asChild,
				props.as,
				placedSide.value,
				placedAlign.value,
				(0, vue_exports.unref)(isPositioned),
				...Object.values(_ctx.$attrs),
				...props.memoDependencies
			], () => ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)({
				key: 0,
				ref: (0, vue_exports.unref)(forwardRef)
			}, _ctx.$attrs, {
				"as-child": props.asChild,
				as: props.as,
				"data-side": placedSide.value,
				"data-align": placedAlign.value,
				style: { animation: !(0, vue_exports.unref)(isPositioned) ? "none" : void 0 }
			}), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"as-child",
				"as",
				"data-side",
				"data-align",
				"style"
			])), _cache, 0) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)({
				key: 1,
				ref: (0, vue_exports.unref)(forwardRef)
			}, _ctx.$attrs, {
				"as-child": props.asChild,
				as: props.as,
				"data-side": placedSide.value,
				"data-align": placedAlign.value,
				dir: (0, vue_exports.unref)(dir),
				style: { animation: !(0, vue_exports.unref)(isPositioned) ? "none" : void 0 }
			}), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"as-child",
				"as",
				"data-side",
				"data-align",
				"dir",
				"style"
			]))], 12, _hoisted_1);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Popper/PopperArrow.js
var OPPOSITE_SIDE = {
	top: "bottom",
	right: "left",
	bottom: "top",
	left: "right"
};
var PopperArrow_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	inheritAttrs: false,
	__name: "PopperArrow",
	props: {
		width: {
			type: Number,
			required: false
		},
		height: {
			type: Number,
			required: false
		},
		rounded: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "svg"
		}
	},
	setup(__props) {
		const { forwardRef } = useForwardExpose();
		const contentContext = injectPopperContentContext();
		const baseSide = (0, vue_exports.computed)(() => OPPOSITE_SIDE[contentContext.placedSide.value]);
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("span", {
				ref: (el) => {
					(0, vue_exports.unref)(contentContext).onArrowChange(el ?? void 0);
				},
				style: (0, vue_exports.normalizeStyle)({
					position: "absolute",
					left: (0, vue_exports.unref)(contentContext).arrowX?.value ? `${(0, vue_exports.unref)(contentContext).arrowX?.value}px` : void 0,
					top: (0, vue_exports.unref)(contentContext).arrowY?.value ? `${(0, vue_exports.unref)(contentContext).arrowY?.value}px` : void 0,
					[baseSide.value]: 0,
					transformOrigin: {
						top: "",
						right: "0 0",
						bottom: "center 0",
						left: "100% 0"
					}[(0, vue_exports.unref)(contentContext).placedSide.value],
					transform: {
						top: "translateY(100%)",
						right: "translateY(50%) rotate(90deg) translateX(-50%)",
						bottom: `rotate(180deg)`,
						left: "translateY(50%) rotate(-90deg) translateX(50%)"
					}[(0, vue_exports.unref)(contentContext).placedSide.value],
					visibility: (0, vue_exports.unref)(contentContext).shouldHideArrow.value ? "hidden" : void 0
				})
			}, [(0, vue_exports.createVNode)(Arrow_default, (0, vue_exports.mergeProps)(_ctx.$attrs, {
				ref: (0, vue_exports.unref)(forwardRef),
				style: { display: "block" },
				as: _ctx.as,
				"as-child": _ctx.asChild,
				rounded: _ctx.rounded,
				width: _ctx.width,
				height: _ctx.height
			}), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"as",
				"as-child",
				"rounded",
				"width",
				"height"
			])], 4);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/useComboboxContentPositioning.js
function useComboboxContentPositioning(open) {
	const contentPosition = (0, vue_exports.ref)("inline");
	const contentPlaced = (0, vue_exports.ref)(false);
	const currentContent = (0, vue_exports.ref)();
	const suppressHighlightScroll = (0, vue_exports.computed)(() => contentPosition.value === "popper" && !contentPlaced.value);
	let pendingHighlightScroll;
	provideListboxHighlightScrollContext({
		suppressHighlightScroll,
		onHighlightScrollRequest(scroll) {
			pendingHighlightScroll = scroll;
		}
	});
	function onContentPositionChange(content, position) {
		if (currentContent.value !== content || contentPosition.value !== position) {
			contentPlaced.value = false;
			pendingHighlightScroll = void 0;
		}
		currentContent.value = content;
		contentPosition.value = position;
	}
	function onContentPlaced(content) {
		if (currentContent.value !== content || contentPosition.value !== "popper" || contentPlaced.value) return;
		contentPlaced.value = true;
		const scroll = pendingHighlightScroll;
		pendingHighlightScroll = void 0;
		if (open.value) scroll?.();
	}
	function onContentUnmount(content) {
		if (currentContent.value !== content) return;
		currentContent.value = void 0;
		contentPosition.value = "inline";
		contentPlaced.value = false;
		pendingHighlightScroll = void 0;
	}
	return {
		onContentPositionChange,
		onContentPlaced,
		onContentUnmount
	};
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxRoot.js
var [injectComboboxRootContext, provideComboboxRootContext] = /*#__PURE__*/ createContext("ComboboxRoot");
var ComboboxRoot_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxRoot",
	props: {
		open: {
			type: Boolean,
			required: false,
			default: void 0
		},
		defaultOpen: {
			type: Boolean,
			required: false
		},
		resetSearchTermOnBlur: {
			type: Boolean,
			required: false,
			default: true
		},
		resetSearchTermOnSelect: {
			type: Boolean,
			required: false,
			default: true
		},
		openOnFocus: {
			type: Boolean,
			required: false,
			default: false
		},
		openOnClick: {
			type: Boolean,
			required: false,
			default: false
		},
		ignoreFilter: {
			type: Boolean,
			required: false
		},
		resetModelValueOnClear: {
			type: Boolean,
			required: false,
			default: false
		},
		modelValue: {
			type: null,
			required: false
		},
		defaultValue: {
			type: null,
			required: false
		},
		multiple: {
			type: Boolean,
			required: false
		},
		dir: {
			type: String,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		highlightOnHover: {
			type: Boolean,
			required: false,
			default: true
		},
		by: {
			type: [String, Function],
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		},
		name: {
			type: String,
			required: false
		},
		required: {
			type: Boolean,
			required: false
		}
	},
	emits: [
		"update:modelValue",
		"highlight",
		"update:open"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const { primitiveElement, currentElement: parentElement } = usePrimitiveElement();
		const { multiple, disabled, ignoreFilter, resetSearchTermOnSelect, openOnFocus, openOnClick, dir: propDir, resetModelValueOnClear, highlightOnHover } = (0, vue_exports.toRefs)(props);
		const dir = useDirection(propDir);
		const modelValue = useVModel(props, "modelValue", emits, {
			defaultValue: props.defaultValue ?? (multiple.value ? [] : void 0),
			passive: props.modelValue === void 0,
			deep: true
		});
		const open = useVModel(props, "open", emits, {
			defaultValue: props.defaultOpen,
			passive: props.open === void 0
		});
		async function onOpenChange(val) {
			open.value = val;
			filterSearch.value = "";
			if (val) {
				await (0, vue_exports.nextTick)();
				primitiveElement.value?.highlightSelected();
				isUserInputted.value = true;
				inputElement.value?.focus();
			} else {
				isUserInputted.value = false;
				setTimeout(() => {
					if (!val && props.resetSearchTermOnBlur) resetSearchTerm.trigger();
				}, 1);
			}
		}
		const resetSearchTerm = createEventHook();
		const isUserInputted = (0, vue_exports.ref)(false);
		const isVirtual = (0, vue_exports.ref)(false);
		const inputElement = (0, vue_exports.ref)();
		const triggerElement = (0, vue_exports.ref)();
		const highlightedElement = (0, vue_exports.computed)(() => primitiveElement.value?.highlightedElement ?? void 0);
		const contentPositioning = useComboboxContentPositioning(open);
		const allItems = (0, vue_exports.ref)(/* @__PURE__ */ new Map());
		const allGroups = (0, vue_exports.ref)(/* @__PURE__ */ new Map());
		const { contains } = useFilter$1({ sensitivity: "base" });
		const filterSearch = (0, vue_exports.ref)("");
		const filterState = (0, vue_exports.computed)((oldValue) => {
			if (!filterSearch.value || props.ignoreFilter || isVirtual.value) return {
				count: allItems.value.size,
				items: oldValue?.items ?? /* @__PURE__ */ new Map(),
				groups: oldValue?.groups ?? new Set(allGroups.value.keys())
			};
			let itemCount = 0;
			const filteredItems = /* @__PURE__ */ new Map();
			const filteredGroups = /* @__PURE__ */ new Set();
			for (const [id, value] of allItems.value) {
				const score = contains(value, filterSearch.value);
				filteredItems.set(id, score ? 1 : 0);
				if (score) itemCount++;
			}
			for (const [groupId, group] of allGroups.value) for (const itemId of group) if (filteredItems.get(itemId) > 0) {
				filteredGroups.add(groupId);
				break;
			}
			return {
				count: itemCount,
				items: filteredItems,
				groups: filteredGroups
			};
		});
		(0, vue_exports.getCurrentInstance)();
		__expose({
			filtered: filterState,
			highlightedElement,
			highlightItem: primitiveElement.value?.highlightItem,
			highlightFirstItem: primitiveElement.value?.highlightFirstItem,
			highlightSelected: primitiveElement.value?.highlightSelected
		});
		provideComboboxRootContext({
			modelValue,
			multiple,
			disabled,
			open,
			onOpenChange,
			...contentPositioning,
			contentId: "",
			isUserInputted,
			isVirtual,
			inputElement,
			highlightedElement,
			onInputElementChange: (val) => inputElement.value = val,
			triggerElement,
			onTriggerElementChange: (val) => triggerElement.value = val,
			parentElement,
			resetSearchTermOnSelect,
			onResetSearchTerm: resetSearchTerm.on,
			allItems,
			allGroups,
			filterSearch,
			filterState,
			ignoreFilter,
			openOnFocus,
			openOnClick,
			resetModelValueOnClear
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(PopperRoot_default), null, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ListboxRoot_default), (0, vue_exports.mergeProps)({
					ref_key: "primitiveElement",
					ref: primitiveElement
				}, _ctx.$attrs, {
					modelValue: (0, vue_exports.unref)(modelValue),
					"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => (0, vue_exports.isRef)(modelValue) ? modelValue.value = $event : null),
					style: { pointerEvents: (0, vue_exports.unref)(open) ? "auto" : void 0 },
					as: _ctx.as,
					"as-child": _ctx.asChild,
					dir: (0, vue_exports.unref)(dir),
					multiple: (0, vue_exports.unref)(multiple),
					name: _ctx.name,
					required: _ctx.required,
					disabled: (0, vue_exports.unref)(disabled),
					"highlight-on-hover": (0, vue_exports.unref)(highlightOnHover),
					by: props.by,
					onHighlight: _cache[1] || (_cache[1] = ($event) => emits("highlight", $event))
				}), {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default", {
						open: (0, vue_exports.unref)(open),
						modelValue: (0, vue_exports.unref)(modelValue)
					})]),
					_: 3
				}, 16, [
					"modelValue",
					"style",
					"as",
					"as-child",
					"dir",
					"multiple",
					"name",
					"required",
					"disabled",
					"highlight-on-hover",
					"by"
				])]),
				_: 3
			});
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxAnchor.js
var ComboboxAnchor_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxAnchor",
	props: {
		reference: {
			type: null,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const { forwardRef } = useForwardExpose();
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(PopperAnchor_default), {
				"as-child": "",
				reference: _ctx.reference
			}, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)({
					ref: (0, vue_exports.unref)(forwardRef),
					"as-child": _ctx.asChild,
					as: _ctx.as
				}, _ctx.$attrs), {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
					_: 3
				}, 16, ["as-child", "as"])]),
				_: 3
			}, 8, ["reference"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxContentImpl.js
var [injectComboboxContentContext, provideComboboxContentContext] = /*#__PURE__*/ createContext("ComboboxContent");
var ComboboxContentImpl_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxContentImpl",
	props: {
		position: {
			type: String,
			required: false,
			default: "inline"
		},
		bodyLock: {
			type: Boolean,
			required: false
		},
		hideWhenEmpty: {
			type: Boolean,
			required: false
		},
		memoDependencies: {
			type: Array,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		sideFlip: {
			type: Boolean,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		alignFlip: {
			type: Boolean,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		hideShiftedArrow: {
			type: Boolean,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: false
		},
		prioritizePosition: {
			type: Boolean,
			required: false
		},
		reference: {
			type: null,
			required: false
		},
		dir: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		},
		disableOutsidePointerEvents: {
			type: Boolean,
			required: false
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const { position } = (0, vue_exports.toRefs)(props);
		const rootContext = injectComboboxRootContext();
		const contentId = Symbol("ComboboxContent");
		(0, vue_exports.watch)(position, (value) => rootContext.onContentPositionChange(contentId, value), { immediate: true });
		const isEmpty = (0, vue_exports.computed)(() => rootContext.ignoreFilter.value ? rootContext.allItems.value.size === 0 : rootContext.filterState.value.count === 0);
		const { forwardRef} = useForwardExpose();
		useBodyScrollLock(props.bodyLock);
		useFocusGuards();
		useHideOthers(rootContext.parentElement);
		const pickedProps = (0, vue_exports.computed)(() => {
			if (props.position === "popper") return props;
			else return {};
		});
		const forwardedProps = useForwardProps$1(pickedProps.value);
		const popperStyle = {
			"boxSizing": "border-box",
			"--reka-combobox-content-transform-origin": "var(--reka-popper-transform-origin)",
			"--reka-combobox-content-available-width": "var(--reka-popper-available-width)",
			"--reka-combobox-content-available-height": "var(--reka-popper-available-height)",
			"--reka-combobox-trigger-width": "var(--reka-popper-anchor-width)",
			"--reka-combobox-trigger-height": "var(--reka-popper-anchor-height)"
		};
		provideComboboxContentContext({ position });
		(0, vue_exports.ref)(false);
		function isEventTargetWithinCombobox(target) {
			if (rootContext.parentElement.value?.contains(target)) return true;
			const control = (target instanceof Element ? target.closest("label") : null)?.control;
			return !!control && !!rootContext.parentElement.value?.contains(control);
		}
		const popperContentEvents = { placed: () => rootContext.onContentPlaced(contentId) };
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ListboxContent_default), { "as-child": "" }, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(FocusScope_default), {
					"as-child": "",
					onMountAutoFocus: _cache[5] || (_cache[5] = (0, vue_exports.withModifiers)(() => {}, ["prevent"])),
					onUnmountAutoFocus: _cache[6] || (_cache[6] = (0, vue_exports.withModifiers)(() => {}, ["prevent"]))
				}, {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(DismissableLayer_default), {
						"as-child": "",
						"disable-outside-pointer-events": _ctx.disableOutsidePointerEvents,
						onDismiss: _cache[0] || (_cache[0] = ($event) => (0, vue_exports.unref)(rootContext).onOpenChange(false)),
						onFocusOutside: _cache[1] || (_cache[1] = (ev) => {
							if (isEventTargetWithinCombobox(ev.target)) ev.preventDefault();
							emits("focusOutside", ev);
						}),
						onInteractOutside: _cache[2] || (_cache[2] = ($event) => emits("interactOutside", $event)),
						onEscapeKeyDown: _cache[3] || (_cache[3] = ($event) => emits("escapeKeyDown", $event)),
						onPointerDownOutside: _cache[4] || (_cache[4] = (ev) => {
							if (isEventTargetWithinCombobox(ev.target)) ev.preventDefault();
							emits("pointerDownOutside", ev);
						})
					}, {
						default: (0, vue_exports.withCtx)(() => [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.resolveDynamicComponent)((0, vue_exports.unref)(position) === "popper" ? (0, vue_exports.unref)(PopperContent_default) : (0, vue_exports.unref)(Primitive)), (0, vue_exports.mergeProps)({
							..._ctx.$attrs,
							...(0, vue_exports.unref)(forwardedProps)
						}, {
							id: (0, vue_exports.unref)(rootContext).contentId,
							ref: (0, vue_exports.unref)(forwardRef),
							"memo-dependencies": (0, vue_exports.unref)(position) === "popper" ? [(0, vue_exports.unref)(rootContext).filterSearch.value, (0, vue_exports.unref)(rootContext).filterState.value] : void 0,
							"data-state": (0, vue_exports.unref)(rootContext).open.value ? "open" : "closed",
							"data-empty": isEmpty.value ? "" : void 0,
							style: {
								display: props.hideWhenEmpty && isEmpty.value ? "none" : "flex",
								flexDirection: "column",
								outline: "none",
								...(0, vue_exports.unref)(position) === "popper" ? popperStyle : {}
							}
						}, (0, vue_exports.toHandlers)((0, vue_exports.unref)(position) === "popper" ? popperContentEvents : {})), {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
							_: 3
						}, 16, [
							"id",
							"memo-dependencies",
							"data-state",
							"data-empty",
							"style"
						]))]),
						_: 3
					}, 8, ["disable-outside-pointer-events"])]),
					_: 3
				})]),
				_: 3
			});
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxArrow.js
var ComboboxArrow_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxArrow",
	props: {
		width: {
			type: Number,
			required: false,
			default: 10
		},
		height: {
			type: Number,
			required: false,
			default: 5
		},
		rounded: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "svg"
		}
	},
	setup(__props) {
		const props = __props;
		const rootContext = injectComboboxRootContext();
		const contentContext = injectComboboxContentContext();
		useForwardExpose();
		return (_ctx, _cache) => {
			return (0, vue_exports.unref)(rootContext).open.value && (0, vue_exports.unref)(contentContext).position.value === "popper" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(PopperArrow_default), (0, vue_exports.normalizeProps)((0, vue_exports.mergeProps)({ key: 0 }, props)), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16)) : (0, vue_exports.createCommentVNode)("v-if", true);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxCancel.js
var ComboboxCancel_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxCancel",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "button"
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		const rootContext = injectComboboxRootContext();
		function handleClick() {
			rootContext.filterSearch.value = "";
			if (rootContext.inputElement.value) {
				rootContext.inputElement.value.value = "";
				rootContext.inputElement.value.focus();
			}
			if (rootContext.resetModelValueOnClear?.value) rootContext.modelValue.value = rootContext.multiple.value ? [] : null;
		}
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)({ type: _ctx.as === "button" ? "button" : void 0 }, props, {
				tabindex: "-1",
				onClick: handleClick
			}), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["type"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxContent.js
var ComboboxContent_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxContent",
	props: {
		forceMount: {
			type: Boolean,
			required: false
		},
		position: {
			type: String,
			required: false
		},
		bodyLock: {
			type: Boolean,
			required: false
		},
		hideWhenEmpty: {
			type: Boolean,
			required: false
		},
		memoDependencies: {
			type: Array,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		sideFlip: {
			type: Boolean,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		alignFlip: {
			type: Boolean,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		hideShiftedArrow: {
			type: Boolean,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: false
		},
		prioritizePosition: {
			type: Boolean,
			required: false
		},
		reference: {
			type: null,
			required: false
		},
		dir: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		},
		disableOutsidePointerEvents: {
			type: Boolean,
			required: false
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside"
	],
	setup(__props, { emit: __emit }) {
		const forwarded = useForwardPropsEmits(__props, __emit);
		const { forwardRef } = useForwardExpose();
		const rootContext = injectComboboxRootContext();
		rootContext.contentId ||= useId(void 0, "reka-combobox-content");
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Presence_default), { present: _ctx.forceMount || (0, vue_exports.unref)(rootContext).open.value }, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(ComboboxContentImpl_default, (0, vue_exports.mergeProps)({
					...(0, vue_exports.unref)(forwarded),
					..._ctx.$attrs
				}, { ref: (0, vue_exports.unref)(forwardRef) }), {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
					_: 3
				}, 16)]),
				_: 3
			}, 8, ["present"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxEmpty.js
var ComboboxEmpty_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxEmpty",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const rootContext = injectComboboxRootContext();
		const isRender = (0, vue_exports.computed)(() => rootContext.ignoreFilter.value ? rootContext.allItems.value.size === 0 : rootContext.filterState.value.count === 0);
		return (_ctx, _cache) => {
			return isRender.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.normalizeProps)((0, vue_exports.mergeProps)({ key: 0 }, props)), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default", {}, () => [_cache[0] || (_cache[0] = (0, vue_exports.createTextVNode)("No options"))])]),
				_: 3
			}, 16)) : (0, vue_exports.createCommentVNode)("v-if", true);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxGroup.js
var [injectComboboxGroupContext, provideComboboxGroupContext] = /*#__PURE__*/ createContext("ComboboxGroup");
var ComboboxGroup_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxGroup",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const id = useId(void 0, "reka-combobox-group");
		const rootContext = injectComboboxRootContext();
		const isRender = (0, vue_exports.computed)(() => rootContext.ignoreFilter.value ? true : !rootContext.filterSearch.value ? true : rootContext.filterState.value.groups.has(id));
		const context = provideComboboxGroupContext({
			id,
			labelId: ""
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ListboxGroup_default), (0, vue_exports.mergeProps)({
				id: (0, vue_exports.unref)(id),
				"aria-labelledby": (0, vue_exports.unref)(context).labelId
			}, props, { hidden: isRender.value ? void 0 : true }), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"id",
				"aria-labelledby",
				"hidden"
			]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxInput.js
var ComboboxInput_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxInput",
	props: {
		displayValue: {
			type: Function,
			required: false
		},
		modelValue: {
			type: String,
			required: false
		},
		autoFocus: {
			type: Boolean,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "input"
		}
	},
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const rootContext = injectComboboxRootContext();
		const listboxContext = injectListboxRootContext();
		const { primitiveElement} = usePrimitiveElement();
		const modelValue = useVModel(props, "modelValue", emits, { passive: props.modelValue === void 0 });
		const { isComposing, shouldDeferInput, handleCompositionStart, handleCompositionUpdate, handleCompositionEnd } = useComposing((event) => {
			const el = event.target;
			if (el) processInputValue(el.value);
		});
		function handleKeyDown(ev) {
			if (isComposing.value) return;
			ev.preventDefault();
			if (!rootContext.open.value) rootContext.onOpenChange(true);
		}
		function processInputValue(value) {
			if (!rootContext.open.value) {
				rootContext.onOpenChange(true);
				(0, vue_exports.nextTick)(() => {
					if (value) {
						rootContext.filterSearch.value = value;
						listboxContext.highlightFirstItem();
					}
				});
			} else rootContext.filterSearch.value = value;
		}
		function handleInput(event) {
			if (shouldDeferInput.value) return;
			processInputValue(event.target.value);
		}
		function handleFocus() {
			if (rootContext.openOnFocus.value && !rootContext.open.value) rootContext.onOpenChange(true);
		}
		function handleBlur(ev) {
			if (!rootContext.open.value) return;
			const nextFocus = ev.relatedTarget;
			if (!nextFocus) return;
			const isInsideRoot = rootContext.parentElement.value?.contains(nextFocus);
			const isInsideContent = (void 0).getElementById(rootContext.contentId)?.contains(nextFocus);
			if (!isInsideRoot && !isInsideContent) requestAnimationFrame(() => {
				if (!rootContext.open.value) return;
				const active = (void 0).activeElement;
				if (!rootContext.parentElement.value?.contains(active) && !(void 0).getElementById(rootContext.contentId)?.contains(active)) rootContext.onOpenChange(false);
			});
		}
		function handleClick() {
			if (rootContext.openOnClick.value && !rootContext.open.value) rootContext.onOpenChange(true);
		}
		function resetSearchTerm() {
			const rootModelValue = rootContext.modelValue.value;
			if (props.displayValue) modelValue.value = props.displayValue(rootModelValue);
			else if (!rootContext.multiple.value && rootModelValue && !Array.isArray(rootModelValue)) if (typeof rootModelValue !== "object") modelValue.value = rootModelValue.toString();
			else modelValue.value = "";
			else modelValue.value = "";
			(0, vue_exports.nextTick)(() => {
				modelValue.value = modelValue.value;
			});
		}
		rootContext.onResetSearchTerm(() => {
			resetSearchTerm();
		});
		(0, vue_exports.watch)(rootContext.modelValue, async () => {
			if (!rootContext.isUserInputted.value && rootContext.resetSearchTermOnSelect.value) resetSearchTerm();
		}, {
			immediate: true,
			deep: true
		});
		(0, vue_exports.watch)(rootContext.filterState, (_newValue, oldValue) => {
			if (!rootContext.isVirtual.value && oldValue.count === 0) listboxContext.highlightFirstItem();
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ListboxFilter_default), {
				ref_key: "primitiveElement",
				ref: primitiveElement,
				modelValue: (0, vue_exports.unref)(modelValue),
				"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => (0, vue_exports.isRef)(modelValue) ? modelValue.value = $event : null),
				as: _ctx.as,
				"as-child": _ctx.asChild,
				"auto-focus": _ctx.autoFocus,
				disabled: _ctx.disabled,
				"aria-expanded": (0, vue_exports.unref)(rootContext).open.value,
				"aria-controls": (0, vue_exports.unref)(rootContext).contentId,
				"aria-autocomplete": "list",
				role: "combobox",
				autocomplete: "off",
				onClick: handleClick,
				onInput: handleInput,
				onKeydown: (0, vue_exports.withKeys)(handleKeyDown, ["down", "up"]),
				onFocus: handleFocus,
				onBlur: handleBlur,
				onCompositionstart: (0, vue_exports.unref)(handleCompositionStart),
				onCompositionupdate: (0, vue_exports.unref)(handleCompositionUpdate),
				onCompositionend: (0, vue_exports.unref)(handleCompositionEnd)
			}, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 8, [
				"modelValue",
				"as",
				"as-child",
				"auto-focus",
				"disabled",
				"aria-expanded",
				"aria-controls",
				"onCompositionstart",
				"onCompositionupdate",
				"onCompositionend"
			]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxItem.js
var ComboboxItem_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxItem",
	props: {
		textValue: {
			type: String,
			required: false
		},
		value: {
			type: null,
			required: true
		},
		disabled: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	emits: ["select"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const id = useId(void 0, "reka-combobox-item");
		const rootContext = injectComboboxRootContext();
		injectComboboxGroupContext(null);
		const { primitiveElement} = usePrimitiveElement();
		if (props.value === "") throw new Error("A <ComboboxItem /> must have a value prop that is not an empty string. This is because the Combobox value can be set to an empty string to clear the selection and show the placeholder.");
		const isRender = (0, vue_exports.computed)(() => {
			if (rootContext.isVirtual.value || rootContext.ignoreFilter.value || !rootContext.filterSearch.value) return true;
			else {
				const filteredCurrentItem = rootContext.filterState.value.items.get(id);
				if (filteredCurrentItem === void 0) return true;
				return filteredCurrentItem > 0;
			}
		});
		return (_ctx, _cache) => {
			return isRender.value ? (0, vue_exports.withMemo)([
				isRender.value,
				(0, vue_exports.unref)(rootContext).filterSearch.value,
				(0, vue_exports.unref)(rootContext).disabled.value,
				_ctx.disabled,
				props.value,
				props.as,
				props.asChild,
				...Object.values(_ctx.$attrs)
			], () => ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ListboxItem_default), (0, vue_exports.mergeProps)({ key: 0 }, props, {
				id: (0, vue_exports.unref)(id),
				ref_key: "primitiveElement",
				ref: primitiveElement,
				disabled: (0, vue_exports.unref)(rootContext).disabled.value || _ctx.disabled,
				onSelect: _cache[0] || (_cache[0] = (event) => {
					emits("select", event);
					if (event.defaultPrevented) return;
					if (!(0, vue_exports.unref)(rootContext).multiple.value && !_ctx.disabled && !(0, vue_exports.unref)(rootContext).disabled.value) {
						event.preventDefault();
						(0, vue_exports.unref)(rootContext).onOpenChange(false);
						(0, vue_exports.unref)(rootContext).modelValue.value = props.value;
					} else if ((0, vue_exports.unref)(rootContext).multiple.value) (0, vue_exports.unref)(rootContext).inputElement.value?.focus();
				})
			}), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(_ctx.value), 1)])]),
				_: 3
			}, 16, ["id", "disabled"])), _cache, 1) : (0, vue_exports.createCommentVNode)("v-if", true);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxItemIndicator.js
var ComboboxItemIndicator_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxItemIndicator",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "span"
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ListboxItemIndicator_default), (0, vue_exports.normalizeProps)((0, vue_exports.guardReactiveProps)(props)), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxLabel.js
var ComboboxLabel_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxLabel",
	props: {
		for: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "div"
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		const groupContext = injectComboboxGroupContext({
			id: "",
			labelId: ""
		});
		groupContext.labelId ||= useId(void 0, "reka-combobox-group-label");
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)(props, { id: (0, vue_exports.unref)(groupContext).labelId }), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["id"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxPortal.js
var ComboboxPortal_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxPortal",
	props: {
		to: {
			type: null,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		defer: {
			type: Boolean,
			required: false
		},
		forceMount: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Teleport_default), (0, vue_exports.normalizeProps)((0, vue_exports.guardReactiveProps)(props)), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxSeparator.js
var ComboboxSeparator_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxSeparator",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)(props, { "aria-hidden": "true" }), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxTrigger.js
var ComboboxTrigger_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxTrigger",
	props: {
		disabled: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "button"
		}
	},
	setup(__props) {
		const props = __props;
		const { forwardRef} = useForwardExpose();
		const rootContext = injectComboboxRootContext();
		const disabled = (0, vue_exports.computed)(() => props.disabled || rootContext.disabled.value || false);
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)(props, {
				ref: (0, vue_exports.unref)(forwardRef),
				type: _ctx.as === "button" ? "button" : void 0,
				tabindex: "-1",
				"aria-label": "Show popup",
				"aria-haspopup": "listbox",
				"aria-expanded": (0, vue_exports.unref)(rootContext).open.value,
				"aria-controls": (0, vue_exports.unref)(rootContext).contentId,
				"data-state": (0, vue_exports.unref)(rootContext).open.value ? "open" : "closed",
				disabled: disabled.value,
				"data-disabled": disabled.value ? "" : void 0,
				"aria-disabled": disabled.value ?? void 0,
				onClick: _cache[0] || (_cache[0] = ($event) => (0, vue_exports.unref)(rootContext).onOpenChange(!(0, vue_exports.unref)(rootContext).open.value))
			}), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"type",
				"aria-expanded",
				"aria-controls",
				"data-state",
				"disabled",
				"data-disabled",
				"aria-disabled"
			]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.4_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxVirtualizer.js
var ComboboxVirtualizer_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxVirtualizer",
	props: {
		options: {
			type: Array,
			required: true
		},
		overscan: {
			type: Number,
			required: false
		},
		estimateSize: {
			type: [Number, Function],
			required: false
		},
		textContent: {
			type: Function,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const rootContext = injectComboboxRootContext();
		rootContext.isVirtual.value = true;
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(ListboxVirtualizer_default, (0, vue_exports.normalizeProps)((0, vue_exports.guardReactiveProps)(props)), {
				default: (0, vue_exports.withCtx)((slotProps) => [(0, vue_exports.renderSlot)(_ctx.$slots, "default", (0, vue_exports.normalizeProps)((0, vue_exports.guardReactiveProps)(slotProps)))]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-sy_2642c4b94b748e7cd728207476161789/node_modules/nuxt/dist/app/utils/hash.js
/**
* Hash an arbitrary value into a short, stable string key.
*
* Values are serialized to a canonical, locale-independent representation
* (equal structures hash equally regardless of key order or runtime locale),
* then digested with a fast non-cryptographic hash. This is what `useFetch` and
* `useAsyncData` use internally to derive their cache keys, so it is safe to use
* for the same purpose in your own code.
*
* The digest is non-cryptographic and must not be used for integrity checks.
*
* @since 4.5.0
*/
function hashKey(value) {
	return fnv1a64Base36(identify(value));
}
//#endregion
//#region app/components/AppNavbar.vue?vue&type=script&setup=true&lang.ts
var AppNavbar_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ (0, vue_exports.defineComponent)({
	__name: "AppNavbar",
	__ssrInlineRender: true,
	setup(__props) {
		const route = useRoute();
		const navItems = [
			{
				label: "Anomali",
				to: "/anomali"
			},
			{
				label: "Rekap Anomali",
				to: "/rekap-anomali"
			},
			{
				label: "KBLI",
				to: "/kbli"
			},
			{
				label: "Rekap KBLI",
				to: "/rekap-kbli"
			}
		];
		function isActive(path) {
			return route.path === path;
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			const _component_UButton = _sfc_main$6;
			_push(`<header${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "app-navbar" }, _attrs))} data-v-73461caf><div class="app-navbar__inner" data-v-73461caf>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_NuxtLink, {
				to: "/",
				class: "app-navbar__brand",
				"aria-label": "Sensus Ekonomi 2026, beranda"
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Sensus Ekonomi 2026 `);
					else return [(0, vue_exports.createTextVNode)(" Sensus Ekonomi 2026 ")];
				}),
				_: 1
			}, _parent));
			_push(`<nav class="app-navbar__links" aria-label="Navigasi utama" data-v-73461caf><!--[-->`);
			(0, server_renderer_exports.ssrRenderList)(navItems, (item) => {
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
					key: item.to,
					to: item.to,
					label: item.label,
					color: isActive(item.to) ? "primary" : "neutral",
					variant: "solid",
					size: "sm",
					class: ["app-navbar__link", { "app-navbar__link--active": isActive(item.to) }],
					"aria-current": isActive(item.to) ? "page" : void 0
				}, null, _parent));
			});
			_push(`<!--]--></nav><div class="app-navbar__actions" data-v-73461caf>`);
			(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "actions", {}, null, _push, _parent);
			_push(`</div></div></header>`);
		};
	}
});
//#endregion
//#region app/components/AppNavbar.vue
var _sfc_setup$3 = AppNavbar_vue_vue_type_script_setup_true_lang_default.setup;
AppNavbar_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppNavbar.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var AppNavbar_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(AppNavbar_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-73461caf"]]), { __name: "AppNavbar" });
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Fskeleton.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fskeleton_default = { "base": "animate-pulse rounded-md bg-elevated" };
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.1_20f0f97e47fbe0f2c628c90cb9c9b79b/node_modules/@nuxt/ui/dist/runtime/components/Skeleton.vue
var _sfc_main$2 = {
	__name: "USkeleton",
	__ssrInlineRender: true,
	props: {
		as: {
			type: null,
			required: false
		},
		class: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		}
	},
	setup(__props) {
		const props = useComponentProps("skeleton", __props);
		const appConfig = useAppConfig();
		const ui = (0, vue_exports.computed)(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fskeleton_default,
			...appConfig.ui?.skeleton || {}
		}));
		return (_ctx, _push, _parent, _attrs) => {
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)({
				as: (0, vue_exports.unref)(props).as,
				"aria-busy": "true",
				"aria-label": "loading",
				"aria-live": "polite",
				role: "alert",
				class: ui.value({ class: [(0, vue_exports.unref)(props).ui?.base, (0, vue_exports.unref)(props).class] })
			}, _attrs), {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) (0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
					else return [(0, vue_exports.renderSlot)(_ctx.$slots, "default")];
				}),
				_: 3
			}, _parent));
		};
	}
};
var _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.11.1_20f0f97e47fbe0f2c628c90cb9c9b79b/node_modules/@nuxt/ui/dist/runtime/components/Skeleton.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Finput.ts
var import_shared_cjs_prod = require_shared_cjs_prod();
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Finput_default = {
	"slots": {
		"root": "relative inline-flex items-center",
		"base": ["w-full rounded-md border-0 appearance-none placeholder:text-dimmed disabled:cursor-not-allowed disabled:opacity-75", "transition-colors"],
		"leading": "absolute inset-y-0 start-0 flex items-center",
		"leadingIcon": "shrink-0 text-dimmed",
		"leadingAvatar": "shrink-0",
		"leadingAvatarSize": "",
		"trailing": "absolute inset-y-0 end-0 flex items-center",
		"trailingIcon": "shrink-0 text-dimmed"
	},
	"variants": {
		"fieldGroup": {
			"horizontal": {
				"root": "group has-focus-visible:z-[1]",
				"base": "group-not-only:group-first:rounded-e-none group-not-only:group-last:rounded-s-none group-not-last:group-not-first:rounded-none"
			},
			"vertical": {
				"root": "group has-focus-visible:z-[1]",
				"base": "group-not-only:group-first:rounded-b-none group-not-only:group-last:rounded-t-none group-not-last:group-not-first:rounded-none"
			}
		},
		"size": {
			"xs": {
				"base": "px-2 py-1 text-sm/4 gap-1",
				"leading": "ps-2",
				"trailing": "pe-2",
				"leadingIcon": "size-4",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-4"
			},
			"sm": {
				"base": "px-2.5 py-1.5 text-sm/4 gap-1.5",
				"leading": "ps-2.5",
				"trailing": "pe-2.5",
				"leadingIcon": "size-4",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-4"
			},
			"md": {
				"base": "px-2.5 py-1.5 text-base/5 gap-1.5",
				"leading": "ps-2.5",
				"trailing": "pe-2.5",
				"leadingIcon": "size-5",
				"leadingAvatarSize": "2xs",
				"trailingIcon": "size-5"
			},
			"lg": {
				"base": "px-3 py-2 text-base/5 gap-2",
				"leading": "ps-3",
				"trailing": "pe-3",
				"leadingIcon": "size-5",
				"leadingAvatarSize": "2xs",
				"trailingIcon": "size-5"
			},
			"xl": {
				"base": "px-3 py-2 text-base gap-2",
				"leading": "ps-3",
				"trailing": "pe-3",
				"leadingIcon": "size-6",
				"leadingAvatarSize": "xs",
				"trailingIcon": "size-6"
			}
		},
		"variant": {
			"outline": "text-highlighted bg-default ring ring-inset ring-accented",
			"soft": "text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50",
			"subtle": "text-highlighted bg-elevated ring ring-inset ring-accented",
			"ghost": "text-highlighted bg-transparent hover:bg-elevated focus:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent",
			"none": "text-highlighted bg-transparent focus:outline-none"
		},
		"color": {
			"primary": "",
			"secondary": "",
			"success": "",
			"info": "",
			"warning": "",
			"error": "",
			"neutral": ""
		},
		"leading": { "true": "" },
		"trailing": { "true": "" },
		"loading": { "true": "" },
		"highlight": { "true": "" },
		"fixed": { "false": "" },
		"type": { "file": "file:me-1.5 file:font-medium file:text-muted file:outline-none" }
	},
	"compoundVariants": [
		{
			"color": "primary",
			"variant": ["outline", "subtle"],
			"class": "outline-primary/25 focus-visible:outline-3 focus-visible:ring-primary"
		},
		{
			"color": "secondary",
			"variant": ["outline", "subtle"],
			"class": "outline-secondary/25 focus-visible:outline-3 focus-visible:ring-secondary"
		},
		{
			"color": "success",
			"variant": ["outline", "subtle"],
			"class": "outline-success/25 focus-visible:outline-3 focus-visible:ring-success"
		},
		{
			"color": "info",
			"variant": ["outline", "subtle"],
			"class": "outline-info/25 focus-visible:outline-3 focus-visible:ring-info"
		},
		{
			"color": "warning",
			"variant": ["outline", "subtle"],
			"class": "outline-warning/25 focus-visible:outline-3 focus-visible:ring-warning"
		},
		{
			"color": "error",
			"variant": ["outline", "subtle"],
			"class": "outline-error/25 focus-visible:outline-3 focus-visible:ring-error"
		},
		{
			"color": "primary",
			"variant": ["soft", "ghost"],
			"class": "outline-primary/25 focus-visible:outline-3"
		},
		{
			"color": "secondary",
			"variant": ["soft", "ghost"],
			"class": "outline-secondary/25 focus-visible:outline-3"
		},
		{
			"color": "success",
			"variant": ["soft", "ghost"],
			"class": "outline-success/25 focus-visible:outline-3"
		},
		{
			"color": "info",
			"variant": ["soft", "ghost"],
			"class": "outline-info/25 focus-visible:outline-3"
		},
		{
			"color": "warning",
			"variant": ["soft", "ghost"],
			"class": "outline-warning/25 focus-visible:outline-3"
		},
		{
			"color": "error",
			"variant": ["soft", "ghost"],
			"class": "outline-error/25 focus-visible:outline-3"
		},
		{
			"color": "primary",
			"highlight": true,
			"class": "ring ring-inset ring-primary"
		},
		{
			"color": "secondary",
			"highlight": true,
			"class": "ring ring-inset ring-secondary"
		},
		{
			"color": "success",
			"highlight": true,
			"class": "ring ring-inset ring-success"
		},
		{
			"color": "info",
			"highlight": true,
			"class": "ring ring-inset ring-info"
		},
		{
			"color": "warning",
			"highlight": true,
			"class": "ring ring-inset ring-warning"
		},
		{
			"color": "error",
			"highlight": true,
			"class": "ring ring-inset ring-error"
		},
		{
			"color": "neutral",
			"variant": ["outline", "subtle"],
			"class": "outline-inverted/25 focus-visible:outline-3 focus-visible:ring-inverted"
		},
		{
			"color": "neutral",
			"variant": ["soft", "ghost"],
			"class": "outline-inverted/25 focus-visible:outline-3"
		},
		{
			"color": "neutral",
			"highlight": true,
			"class": "ring ring-inset ring-inverted"
		},
		{
			"leading": true,
			"size": "xs",
			"class": "ps-7"
		},
		{
			"leading": true,
			"size": "sm",
			"class": "ps-8"
		},
		{
			"leading": true,
			"size": "md",
			"class": "ps-9"
		},
		{
			"leading": true,
			"size": "lg",
			"class": "ps-10"
		},
		{
			"leading": true,
			"size": "xl",
			"class": "ps-11"
		},
		{
			"trailing": true,
			"size": "xs",
			"class": "pe-7"
		},
		{
			"trailing": true,
			"size": "sm",
			"class": "pe-8"
		},
		{
			"trailing": true,
			"size": "md",
			"class": "pe-9"
		},
		{
			"trailing": true,
			"size": "lg",
			"class": "pe-10"
		},
		{
			"trailing": true,
			"size": "xl",
			"class": "pe-11"
		},
		{
			"loading": true,
			"leading": true,
			"class": { "leadingIcon": "animate-spin" }
		},
		{
			"loading": true,
			"leading": false,
			"trailing": true,
			"class": { "trailingIcon": "animate-spin" }
		},
		{
			"fixed": false,
			"size": "xs",
			"class": "md:text-xs"
		},
		{
			"fixed": false,
			"size": "sm",
			"class": "md:text-xs"
		},
		{
			"fixed": false,
			"size": "md",
			"class": "md:text-sm"
		},
		{
			"fixed": false,
			"size": "lg",
			"class": "md:text-sm"
		}
	],
	"defaultVariants": {
		"size": "md",
		"color": "primary",
		"variant": "outline"
	}
};
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.1_20f0f97e47fbe0f2c628c90cb9c9b79b/node_modules/@nuxt/ui/dist/runtime/components/Input.vue
var _sfc_main$1 = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "UInput",
	__ssrInlineRender: true,
	props: {
		as: {
			type: null,
			required: false
		},
		id: {
			type: String,
			required: false
		},
		name: {
			type: String,
			required: false
		},
		type: {
			type: null,
			required: false,
			default: "text"
		},
		placeholder: {
			type: String,
			required: false
		},
		color: {
			type: null,
			required: false
		},
		variant: {
			type: null,
			required: false
		},
		size: {
			type: null,
			required: false
		},
		required: {
			type: Boolean,
			required: false
		},
		autocomplete: {
			type: [String, Object],
			required: false,
			default: "off"
		},
		autofocus: {
			type: Boolean,
			required: false
		},
		autofocusDelay: {
			type: Number,
			required: false,
			default: 0
		},
		disabled: {
			type: Boolean,
			required: false
		},
		highlight: {
			type: Boolean,
			required: false
		},
		fixed: {
			type: Boolean,
			required: false
		},
		modelValue: {
			type: null,
			required: false
		},
		defaultValue: {
			type: null,
			required: false
		},
		modelModifiers: {
			type: null,
			required: false
		},
		class: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		},
		icon: {
			type: null,
			required: false
		},
		avatar: {
			type: Object,
			required: false
		},
		leading: {
			type: Boolean,
			required: false
		},
		leadingIcon: {
			type: null,
			required: false
		},
		trailing: {
			type: Boolean,
			required: false
		},
		trailingIcon: {
			type: null,
			required: false
		},
		loading: {
			type: Boolean,
			required: false
		},
		loadingIcon: {
			type: null,
			required: false
		}
	},
	emits: [
		"update:modelValue",
		"blur",
		"change"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		const _props = __props;
		const emits = __emit;
		const slots = (0, vue_exports.useSlots)();
		const props = useComponentProps("input", _props);
		const modelValue = useVModel(props, "modelValue", emits, { defaultValue: props.defaultValue });
		const appConfig = useAppConfig();
		const { emitFormBlur, emitFormInput, emitFormChange, size: formFieldSize, color: formFieldColor, id, name, highlight: formFieldHighlight, disabled: formFieldDisabled, emitFormFocus, ariaAttrs } = useFormField(_props, { deferInputValidation: true });
		const { orientation, size: fieldGroupSize } = useFieldGroup(_props);
		const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props);
		const color = (0, vue_exports.computed)(() => formFieldColor.value ?? props.color);
		const highlight = (0, vue_exports.computed)(() => formFieldHighlight.value ?? props.highlight);
		const size = (0, vue_exports.computed)(() => fieldGroupSize.value ?? formFieldSize.value ?? props.size);
		const disabled = (0, vue_exports.computed)(() => formFieldDisabled.value ?? props.disabled);
		const ui = (0, vue_exports.computed)(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Finput_default,
			...appConfig.ui?.input || {}
		})({
			type: props.type,
			color: color.value,
			variant: props.variant,
			size: size.value,
			loading: props.loading,
			highlight: highlight.value,
			fixed: props.fixed,
			leading: isLeading.value || !!props.avatar || !!slots.leading,
			trailing: isTrailing.value || !!slots.trailing,
			fieldGroup: orientation.value
		}));
		const inputRef = (0, vue_exports.useTemplateRef)("inputRef");
		function updateInput(value) {
			if (props.modelModifiers?.trim && (typeof value === "string" || value === null || value === void 0)) value = value?.trim() ?? null;
			if (props.modelModifiers?.number || props.type === "number") value = looseToNumber(value);
			if (props.modelModifiers?.nullable) value ||= null;
			if (props.modelModifiers?.optional && !props.modelModifiers?.nullable && value !== null) value ||= void 0;
			modelValue.value = value;
			emitFormInput();
		}
		function onInput(event) {
			if (!props.modelModifiers?.lazy) updateInput(event.target.value);
		}
		function onChange(event) {
			const value = event.target.value;
			if (props.modelModifiers?.lazy) updateInput(value);
			if (props.modelModifiers?.trim) event.target.value = value.trim();
			emitFormChange();
			emits("change", event);
		}
		function onBlur(event) {
			emitFormBlur();
			emits("blur", event);
		}
		let autofocusTimeoutId;
		(0, vue_exports.onScopeDispose)(() => clearTimeout(autofocusTimeoutId));
		__expose({ inputRef });
		return (_ctx, _push, _parent, _attrs) => {
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)({
				as: (0, vue_exports.unref)(props).as,
				"data-slot": _ctx.$attrs["data-slot"] ?? "root",
				class: ui.value.root({ class: [(0, vue_exports.unref)(props).ui?.root, (0, vue_exports.unref)(props).class] })
			}, _attrs), {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<input${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({
							id: (0, vue_exports.unref)(id),
							ref_key: "inputRef",
							ref: inputRef,
							type: (0, vue_exports.unref)(props).type,
							value: (0, vue_exports.unref)(modelValue),
							name: (0, vue_exports.unref)(name),
							placeholder: (0, vue_exports.unref)(props).placeholder,
							class: ui.value.base({ class: (0, vue_exports.unref)(props).ui?.base }),
							disabled: disabled.value,
							required: (0, vue_exports.unref)(props).required,
							autocomplete: (0, vue_exports.unref)(props).autocomplete
						}, {
							..._ctx.$attrs,
							...(0, vue_exports.unref)(ariaAttrs)
						}, { "data-slot": "base" }))}${_scopeId}>`);
						(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "default", { ui: ui.value }, null, _push, _parent, _scopeId);
						if ((0, vue_exports.unref)(isLeading) || !!(0, vue_exports.unref)(props).avatar || !!slots.leading) {
							_push(`<span data-slot="leading" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.leading({ class: (0, vue_exports.unref)(props).ui?.leading }))}"${_scopeId}>`);
							(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "leading", { ui: ui.value }, () => {
								if ((0, vue_exports.unref)(isLeading) && (0, vue_exports.unref)(leadingIconName)) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$5, {
									name: (0, vue_exports.unref)(leadingIconName),
									"data-slot": "leadingIcon",
									class: ui.value.leadingIcon({ class: (0, vue_exports.unref)(props).ui?.leadingIcon })
								}, null, _parent, _scopeId));
								else if (!!(0, vue_exports.unref)(props).avatar) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$3, (0, vue_exports.mergeProps)({ size: (0, vue_exports.unref)(props).ui?.leadingAvatarSize || ui.value.leadingAvatarSize() }, (0, vue_exports.unref)(props).avatar, {
									"data-slot": "leadingAvatar",
									class: ui.value.leadingAvatar({ class: (0, vue_exports.unref)(props).ui?.leadingAvatar })
								}), null, _parent, _scopeId));
								else _push(`<!---->`);
							}, _push, _parent, _scopeId);
							_push(`</span>`);
						} else _push(`<!---->`);
						if ((0, vue_exports.unref)(isTrailing) || !!slots.trailing) {
							_push(`<span data-slot="trailing" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.trailing({ class: (0, vue_exports.unref)(props).ui?.trailing }))}"${_scopeId}>`);
							(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "trailing", { ui: ui.value }, () => {
								if ((0, vue_exports.unref)(trailingIconName)) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$5, {
									name: (0, vue_exports.unref)(trailingIconName),
									"data-slot": "trailingIcon",
									class: ui.value.trailingIcon({ class: (0, vue_exports.unref)(props).ui?.trailingIcon })
								}, null, _parent, _scopeId));
								else _push(`<!---->`);
							}, _push, _parent, _scopeId);
							_push(`</span>`);
						} else _push(`<!---->`);
					} else return [
						(0, vue_exports.createVNode)("input", (0, vue_exports.mergeProps)({
							id: (0, vue_exports.unref)(id),
							ref_key: "inputRef",
							ref: inputRef,
							type: (0, vue_exports.unref)(props).type,
							value: (0, vue_exports.unref)(modelValue),
							name: (0, vue_exports.unref)(name),
							placeholder: (0, vue_exports.unref)(props).placeholder,
							class: ui.value.base({ class: (0, vue_exports.unref)(props).ui?.base }),
							disabled: disabled.value,
							required: (0, vue_exports.unref)(props).required,
							autocomplete: (0, vue_exports.unref)(props).autocomplete
						}, {
							..._ctx.$attrs,
							...(0, vue_exports.unref)(ariaAttrs)
						}, {
							"data-slot": "base",
							onInput,
							onBlur,
							onChange,
							onFocus: (0, vue_exports.unref)(emitFormFocus)
						}), null, 16, [
							"id",
							"type",
							"value",
							"name",
							"placeholder",
							"disabled",
							"required",
							"autocomplete",
							"onFocus"
						]),
						(0, vue_exports.renderSlot)(_ctx.$slots, "default", { ui: ui.value }),
						(0, vue_exports.unref)(isLeading) || !!(0, vue_exports.unref)(props).avatar || !!slots.leading ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
							key: 0,
							"data-slot": "leading",
							class: ui.value.leading({ class: (0, vue_exports.unref)(props).ui?.leading })
						}, [(0, vue_exports.renderSlot)(_ctx.$slots, "leading", { ui: ui.value }, () => [(0, vue_exports.unref)(isLeading) && (0, vue_exports.unref)(leadingIconName) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$5, {
							key: 0,
							name: (0, vue_exports.unref)(leadingIconName),
							"data-slot": "leadingIcon",
							class: ui.value.leadingIcon({ class: (0, vue_exports.unref)(props).ui?.leadingIcon })
						}, null, 8, ["name", "class"])) : !!(0, vue_exports.unref)(props).avatar ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$3, (0, vue_exports.mergeProps)({
							key: 1,
							size: (0, vue_exports.unref)(props).ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
						}, (0, vue_exports.unref)(props).avatar, {
							"data-slot": "leadingAvatar",
							class: ui.value.leadingAvatar({ class: (0, vue_exports.unref)(props).ui?.leadingAvatar })
						}), null, 16, ["size", "class"])) : (0, vue_exports.createCommentVNode)("", true)])], 2)) : (0, vue_exports.createCommentVNode)("", true),
						(0, vue_exports.unref)(isTrailing) || !!slots.trailing ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
							key: 1,
							"data-slot": "trailing",
							class: ui.value.trailing({ class: (0, vue_exports.unref)(props).ui?.trailing })
						}, [(0, vue_exports.renderSlot)(_ctx.$slots, "trailing", { ui: ui.value }, () => [(0, vue_exports.unref)(trailingIconName) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$5, {
							key: 0,
							name: (0, vue_exports.unref)(trailingIconName),
							"data-slot": "trailingIcon",
							class: ui.value.trailingIcon({ class: (0, vue_exports.unref)(props).ui?.trailingIcon })
						}, null, 8, ["name", "class"])) : (0, vue_exports.createCommentVNode)("", true)])], 2)) : (0, vue_exports.createCommentVNode)("", true)
					];
				}),
				_: 3
			}, _parent));
		};
	}
});
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.11.1_20f0f97e47fbe0f2c628c90cb9c9b79b/node_modules/@nuxt/ui/dist/runtime/components/Input.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
//#endregion
//#region node_modules/.pnpm/nuxt@4.5.2_@babel+plugin-sy_2642c4b94b748e7cd728207476161789/node_modules/nuxt/dist/app/composables/fetch.js
var $fetch$1 = $fetch$2;
var MAYBE_REF_OR_GETTER_OPTION_KEYS = [
	"method",
	"baseURL",
	"query",
	"params",
	"body",
	"headers"
];
function generateOptionSegments(opts) {
	const segments = [(0, vue_exports.toValue)(opts.method)?.toUpperCase() || "GET", (0, vue_exports.toValue)(opts.baseURL)];
	for (const _obj of [opts.query || opts.params]) {
		const obj = (0, vue_exports.toValue)(_obj);
		if (!obj) continue;
		const unwrapped = {};
		for (const [key, value] of Object.entries(obj)) unwrapped[(0, vue_exports.toValue)(key)] = (0, vue_exports.toValue)(value);
		segments.push(unwrapped);
	}
	if (opts.body) {
		const value = (0, vue_exports.toValue)(opts.body);
		if (!value) segments.push(hashKey(value));
		else if (value instanceof ArrayBuffer) segments.push(hashKey(Object.fromEntries([...new Uint8Array(value).entries()].map(([k, v]) => [k, v.toString()]))));
		else if (value instanceof FormData) {
			const entries = [];
			for (const entry of value.entries()) {
				const [key, val] = entry;
				entries.push([key, val instanceof File ? `${val.name}:${val.size}:${val.lastModified}` : val]);
			}
			segments.push(hashKey(entries));
		} else if ((0, import_shared_cjs_prod.isPlainObject)(value)) segments.push(hashKey((0, vue_exports.reactive)(value)));
		else try {
			segments.push(hashKey(value));
		} catch {
			dataDiagnostics.NUXT_E3002({ cause: value });
		}
	}
	return segments;
}
/**
* A factory function to create a custom `useFetch` composable with pre-defined default options.
* @since 4.2.0
*/
var createUseFetch = defineKeyedFunctionFactory({
	name: "createUseFetch",
	factory(options = {}) {
		function useFetch(request, arg1, arg2) {
			const [opts = {}, autoKey] = typeof arg1 === "string" ? [{}, arg1] : [arg1, arg2];
			const factoryOptions = typeof options === "function" ? options(opts) : options;
			const { server, lazy, default: defaultFn, transform, pick, watch: watchSources, immediate, getCachedData, deep, dedupe, timeout, enabled, ...fetchOptions } = {
				...typeof options === "function" ? {} : factoryOptions,
				...opts,
				...typeof options === "function" ? factoryOptions : {}
			};
			const _request = (0, vue_exports.computed)(() => (0, vue_exports.toValue)(request));
			const key = (0, vue_exports.computed)(() => (0, vue_exports.toValue)(fetchOptions.key) || "$f" + hashKey([
				autoKey,
				typeof _request.value === "string" ? _request.value : "",
				...generateOptionSegments(fetchOptions)
			]));
			if (!fetchOptions.baseURL && typeof _request.value === "string" && _request.value[0] === "/" && _request.value[1] === "/") throw dataDiagnostics.NUXT_E3001({ url: _request.value });
			const _fetchOptions = (0, vue_exports.reactive)({
				...fetchDefaults,
				...fetchOptions,
				cache: typeof fetchOptions.cache === "boolean" ? void 0 : fetchOptions.cache
			});
			const _asyncDataOptions = {
				server,
				lazy,
				default: defaultFn,
				transform,
				pick,
				immediate,
				getCachedData,
				deep,
				dedupe,
				timeout,
				enabled,
				watch: watchSources === false ? [] : [...watchSources || [], _fetchOptions]
			};
			if (watchSources === false) _asyncDataOptions._keyTriggersExecute = false;
			return useAsyncData(key, (_, { signal }) => {
				let _$fetch = fetchOptions.$fetch || $fetch$1;
				if (!fetchOptions.$fetch) {
					if (typeof _request.value === "string" && _request.value[0] === "/" && (!(0, vue_exports.toValue)(fetchOptions.baseURL) || (0, vue_exports.toValue)(fetchOptions.baseURL)[0] === "/")) _$fetch = useRequestFetch();
				}
				const resolvedOptions = {
					signal,
					..._fetchOptions
				};
				for (const key of MAYBE_REF_OR_GETTER_OPTION_KEYS) if (typeof resolvedOptions[key] === "function") resolvedOptions[key] = (0, vue_exports.toValue)(resolvedOptions[key]);
				return _$fetch(_request.value, resolvedOptions);
			}, _asyncDataOptions);
		}
		return useFetch;
	}
});
var useFetch = createUseFetch.__nuxt_factory();
createUseFetch.__nuxt_factory({
	lazy: true,
	_functionName: "useLazyFetch"
});
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.1_20f0f97e47fbe0f2c628c90cb9c9b79b/node_modules/@nuxt/ui/dist/runtime/composables/useFilter.js
function useFilter() {
	const { contains, startsWith } = useFilter$1({ sensitivity: "base" });
	function score(value, searchTerm) {
		if (!contains(value, searchTerm)) return null;
		if (contains(searchTerm, value)) return 0;
		if (startsWith(value, searchTerm)) return 1;
		return 2;
	}
	function scoreItem(item, searchTerm, fields) {
		if (typeof item !== "object" || item === null) return score(String(item), searchTerm);
		let bestScore = null;
		for (const field of fields) {
			const value = get(item, field);
			if (value == null) continue;
			const values = Array.isArray(value) ? value.map(String) : [String(value)];
			for (const v of values) {
				const s = score(v, searchTerm);
				if (s !== null && (bestScore === null || s < bestScore)) bestScore = s;
				if (bestScore === 0) return 0;
			}
		}
		return bestScore;
	}
	function filter(items, searchTerm, fields) {
		if (!searchTerm) return items;
		const scored = [];
		for (const item of items) {
			const s = scoreItem(item, searchTerm, fields);
			if (s !== null) scored.push({
				item,
				score: s
			});
		}
		scored.sort((a, b) => a.score - b.score);
		return scored.map(({ item }) => item);
	}
	function filterGroups(groups, searchTerm, options) {
		if (!searchTerm) return groups;
		return groups.map((group) => {
			const result = [];
			for (const item of group) {
				if (item === void 0 || item === null) continue;
				if (options.isStructural?.(item)) {
					result.push({
						item,
						score: -1
					});
					continue;
				}
				const s = scoreItem(item, searchTerm, options.fields);
				if (s !== null) result.push({
					item,
					score: s
				});
			}
			result.sort((a, b) => a.score - b.score);
			return result.map(({ item }) => item);
		}).filter((group) => group.some((item) => !options.isStructural?.(item)));
	}
	return {
		score,
		scoreItem,
		filter,
		filterGroups
	};
}
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.1_20f0f97e47fbe0f2c628c90cb9c9b79b/node_modules/@nuxt/ui/dist/runtime/utils/virtualizer.js
function itemHasDescription(item, descriptionKey) {
	if (typeof item !== "object" || item === null) return false;
	const value = get(item, descriptionKey);
	return value !== void 0 && value !== null && value !== "";
}
function getSize(size, hasDescription) {
	if (hasDescription) return {
		xs: 44,
		sm: 48,
		md: 52,
		lg: 56,
		xl: 60
	}[size];
	return {
		xs: 24,
		sm: 28,
		md: 32,
		lg: 36,
		xl: 40
	}[size];
}
function getEstimateSize(items, size, descriptionKey, hasDescriptionSlot) {
	const sizeWithDescription = getSize(size, true);
	const sizeWithoutDescription = getSize(size, false);
	if (hasDescriptionSlot) return () => sizeWithDescription;
	if (!descriptionKey) return () => sizeWithoutDescription;
	return (index) => {
		return itemHasDescription(items[index], descriptionKey) ? sizeWithDescription : sizeWithoutDescription;
	};
}
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Fselect-menu.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fselect_menu_default = {
	"slots": {
		"base": ["relative group rounded-md inline-flex items-center disabled:cursor-not-allowed disabled:opacity-75", "transition-colors"],
		"leading": "absolute inset-y-0 start-0 flex items-center",
		"leadingIcon": "shrink-0 text-dimmed",
		"leadingAvatar": "shrink-0",
		"leadingAvatarSize": "",
		"trailing": "absolute inset-y-0 end-0 flex items-center",
		"trailingIcon": "shrink-0 text-dimmed",
		"value": "truncate pointer-events-none",
		"placeholder": "truncate text-dimmed",
		"arrow": "fill-bg stroke-default",
		"content": ["max-h-[min(15rem,var(--reka-select-content-available-height,15rem))] w-(--reka-select-trigger-width) bg-default shadow-lg rounded-md ring ring-default overflow-hidden origin-(--reka-select-content-transform-origin) pointer-events-auto flex flex-col", "max-h-[min(15rem,var(--reka-combobox-content-available-height,15rem))] origin-(--reka-combobox-content-transform-origin) w-(--reka-combobox-trigger-width)"],
		"viewport": "relative scroll-py-1 overflow-y-auto flex-1",
		"group": "p-1 isolate",
		"empty": "text-center text-muted",
		"label": "font-semibold text-highlighted",
		"separator": "-mx-1 my-1 h-px bg-border",
		"item": ["group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75 text-default data-highlighted:not-data-disabled:text-highlighted data-highlighted:not-data-disabled:before:bg-elevated/50", "transition-colors before:transition-colors"],
		"itemLeadingIcon": ["shrink-0 text-dimmed group-data-highlighted:not-group-data-disabled:text-default", "transition-colors"],
		"itemLeadingAvatar": "shrink-0",
		"itemLeadingAvatarSize": "",
		"itemLeadingChip": "shrink-0",
		"itemLeadingChipSize": "",
		"itemTrailing": "ms-auto inline-flex gap-1.5 items-center",
		"itemTrailingIcon": "shrink-0",
		"itemWrapper": "flex-1 flex flex-col min-w-0",
		"itemLabel": "truncate",
		"itemDescription": "truncate text-muted",
		"input": "border-b border-default",
		"focusScope": "flex flex-col min-h-0",
		"trailingClear": "p-0"
	},
	"variants": {
		"fieldGroup": {
			"horizontal": "not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]",
			"vertical": "not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]"
		},
		"size": {
			"xs": {
				"base": "px-2 py-1 text-sm/4 gap-1",
				"leading": "ps-2",
				"trailing": "pe-2",
				"leadingIcon": "size-4",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-4",
				"label": "p-1 text-[10px]/3 gap-1",
				"item": "p-1 text-xs gap-1",
				"itemLeadingIcon": "size-4",
				"itemLeadingAvatarSize": "3xs",
				"itemLeadingChip": "size-4",
				"itemLeadingChipSize": "sm",
				"itemTrailingIcon": "size-4",
				"empty": "p-2 text-xs"
			},
			"sm": {
				"base": "px-2.5 py-1.5 text-sm/4 gap-1.5",
				"leading": "ps-2.5",
				"trailing": "pe-2.5",
				"leadingIcon": "size-4",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-4",
				"label": "p-1.5 text-[10px]/3 gap-1.5",
				"item": "p-1.5 text-xs gap-1.5",
				"itemLeadingIcon": "size-4",
				"itemLeadingAvatarSize": "3xs",
				"itemLeadingChip": "size-4",
				"itemLeadingChipSize": "sm",
				"itemTrailingIcon": "size-4",
				"empty": "p-2.5 text-xs"
			},
			"md": {
				"base": "px-2.5 py-1.5 text-base/5 gap-1.5",
				"leading": "ps-2.5",
				"trailing": "pe-2.5",
				"leadingIcon": "size-5",
				"leadingAvatarSize": "2xs",
				"trailingIcon": "size-5",
				"label": "p-1.5 text-xs gap-1.5",
				"item": "p-1.5 text-sm gap-1.5",
				"itemLeadingIcon": "size-5",
				"itemLeadingAvatarSize": "2xs",
				"itemLeadingChip": "size-5",
				"itemLeadingChipSize": "md",
				"itemTrailingIcon": "size-5",
				"empty": "p-2.5 text-sm"
			},
			"lg": {
				"base": "px-3 py-2 text-base/5 gap-2",
				"leading": "ps-3",
				"trailing": "pe-3",
				"leadingIcon": "size-5",
				"leadingAvatarSize": "2xs",
				"trailingIcon": "size-5",
				"label": "p-2 text-xs gap-2",
				"item": "p-2 text-sm gap-2",
				"itemLeadingIcon": "size-5",
				"itemLeadingAvatarSize": "2xs",
				"itemLeadingChip": "size-5",
				"itemLeadingChipSize": "md",
				"itemTrailingIcon": "size-5",
				"empty": "p-3 text-sm"
			},
			"xl": {
				"base": "px-3 py-2 text-base gap-2",
				"leading": "ps-3",
				"trailing": "pe-3",
				"leadingIcon": "size-6",
				"leadingAvatarSize": "xs",
				"trailingIcon": "size-6",
				"label": "p-2 text-sm gap-2",
				"item": "p-2 text-base gap-2",
				"itemLeadingIcon": "size-6",
				"itemLeadingAvatarSize": "xs",
				"itemLeadingChip": "size-6",
				"itemLeadingChipSize": "lg",
				"itemTrailingIcon": "size-6",
				"empty": "p-3 text-base"
			}
		},
		"variant": {
			"outline": "text-highlighted bg-default ring ring-inset ring-accented hover:bg-elevated disabled:bg-default",
			"soft": "text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50",
			"subtle": "text-highlighted bg-elevated ring ring-inset ring-accented hover:bg-accented/75 disabled:bg-elevated",
			"ghost": "text-highlighted bg-transparent hover:bg-elevated focus:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent",
			"none": "text-highlighted bg-transparent focus:outline-none"
		},
		"color": {
			"primary": "",
			"secondary": "",
			"success": "",
			"info": "",
			"warning": "",
			"error": "",
			"neutral": ""
		},
		"leading": { "true": "" },
		"trailing": { "true": "" },
		"loading": { "true": "" },
		"highlight": { "true": "" },
		"fixed": { "false": "" },
		"type": { "file": "file:me-1.5 file:font-medium file:text-muted file:outline-none" },
		"position": {
			"popper": { "content": "data-[state=open]:animate-[scale-in_100ms_var(--ease-out)] data-[state=closed]:animate-[scale-out_100ms_var(--ease-out)]" },
			"item-aligned": { "content": "" }
		},
		"multiple": { "true": "" },
		"virtualize": {
			"true": { "viewport": "p-1 isolate" },
			"false": { "viewport": "divide-y divide-default" }
		}
	},
	"compoundVariants": [
		{
			"color": "primary",
			"variant": ["outline", "subtle"],
			"class": "outline-primary/25 focus-visible:outline-3 focus-visible:ring-primary"
		},
		{
			"color": "secondary",
			"variant": ["outline", "subtle"],
			"class": "outline-secondary/25 focus-visible:outline-3 focus-visible:ring-secondary"
		},
		{
			"color": "success",
			"variant": ["outline", "subtle"],
			"class": "outline-success/25 focus-visible:outline-3 focus-visible:ring-success"
		},
		{
			"color": "info",
			"variant": ["outline", "subtle"],
			"class": "outline-info/25 focus-visible:outline-3 focus-visible:ring-info"
		},
		{
			"color": "warning",
			"variant": ["outline", "subtle"],
			"class": "outline-warning/25 focus-visible:outline-3 focus-visible:ring-warning"
		},
		{
			"color": "error",
			"variant": ["outline", "subtle"],
			"class": "outline-error/25 focus-visible:outline-3 focus-visible:ring-error"
		},
		{
			"color": "primary",
			"variant": ["soft", "ghost"],
			"class": "outline-primary/25 focus-visible:outline-3"
		},
		{
			"color": "secondary",
			"variant": ["soft", "ghost"],
			"class": "outline-secondary/25 focus-visible:outline-3"
		},
		{
			"color": "success",
			"variant": ["soft", "ghost"],
			"class": "outline-success/25 focus-visible:outline-3"
		},
		{
			"color": "info",
			"variant": ["soft", "ghost"],
			"class": "outline-info/25 focus-visible:outline-3"
		},
		{
			"color": "warning",
			"variant": ["soft", "ghost"],
			"class": "outline-warning/25 focus-visible:outline-3"
		},
		{
			"color": "error",
			"variant": ["soft", "ghost"],
			"class": "outline-error/25 focus-visible:outline-3"
		},
		{
			"color": "primary",
			"highlight": true,
			"class": "ring ring-inset ring-primary"
		},
		{
			"color": "secondary",
			"highlight": true,
			"class": "ring ring-inset ring-secondary"
		},
		{
			"color": "success",
			"highlight": true,
			"class": "ring ring-inset ring-success"
		},
		{
			"color": "info",
			"highlight": true,
			"class": "ring ring-inset ring-info"
		},
		{
			"color": "warning",
			"highlight": true,
			"class": "ring ring-inset ring-warning"
		},
		{
			"color": "error",
			"highlight": true,
			"class": "ring ring-inset ring-error"
		},
		{
			"color": "neutral",
			"variant": ["outline", "subtle"],
			"class": "outline-inverted/25 focus-visible:outline-3 focus-visible:ring-inverted"
		},
		{
			"color": "neutral",
			"variant": ["soft", "ghost"],
			"class": "outline-inverted/25 focus-visible:outline-3"
		},
		{
			"color": "neutral",
			"highlight": true,
			"class": "ring ring-inset ring-inverted"
		},
		{
			"leading": true,
			"size": "xs",
			"class": "ps-7"
		},
		{
			"leading": true,
			"size": "sm",
			"class": "ps-8"
		},
		{
			"leading": true,
			"size": "md",
			"class": "ps-9"
		},
		{
			"leading": true,
			"size": "lg",
			"class": "ps-10"
		},
		{
			"leading": true,
			"size": "xl",
			"class": "ps-11"
		},
		{
			"trailing": true,
			"size": "xs",
			"class": "pe-7"
		},
		{
			"trailing": true,
			"size": "sm",
			"class": "pe-8"
		},
		{
			"trailing": true,
			"size": "md",
			"class": "pe-9"
		},
		{
			"trailing": true,
			"size": "lg",
			"class": "pe-10"
		},
		{
			"trailing": true,
			"size": "xl",
			"class": "pe-11"
		},
		{
			"loading": true,
			"leading": true,
			"class": { "leadingIcon": "animate-spin" }
		},
		{
			"loading": true,
			"leading": false,
			"trailing": true,
			"class": { "trailingIcon": "animate-spin" }
		},
		{
			"fixed": false,
			"size": "xs",
			"class": "md:text-xs"
		},
		{
			"fixed": false,
			"size": "sm",
			"class": "md:text-xs"
		},
		{
			"fixed": false,
			"size": "md",
			"class": "md:text-sm"
		},
		{
			"fixed": false,
			"size": "lg",
			"class": "md:text-sm"
		}
	],
	"defaultVariants": {
		"size": "md",
		"color": "primary",
		"variant": "outline",
		"position": "popper"
	}
};
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.1_20f0f97e47fbe0f2c628c90cb9c9b79b/node_modules/@nuxt/ui/dist/runtime/components/SelectMenu.vue
var _sfc_main = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "USelectMenu",
	__ssrInlineRender: true,
	props: /*@__PURE__*/ (0, vue_exports.mergeModels)({
		id: {
			type: String,
			required: false
		},
		placeholder: {
			type: String,
			required: false
		},
		searchInput: {
			type: [Boolean, Object],
			required: false,
			default: true
		},
		color: {
			type: null,
			required: false
		},
		variant: {
			type: null,
			required: false
		},
		size: {
			type: null,
			required: false
		},
		required: {
			type: Boolean,
			required: false
		},
		trailingIcon: {
			type: null,
			required: false
		},
		selectedIcon: {
			type: null,
			required: false
		},
		clear: {
			type: [Boolean, Object],
			required: false
		},
		clearIcon: {
			type: null,
			required: false
		},
		content: {
			type: Object,
			required: false
		},
		arrow: {
			type: [Boolean, Object],
			required: false
		},
		portal: {
			type: [Boolean, String],
			required: false,
			skipCheck: true,
			default: true
		},
		virtualize: {
			type: [Boolean, Object],
			required: false,
			default: false
		},
		valueKey: {
			type: null,
			required: false
		},
		labelKey: {
			type: null,
			required: false,
			default: "label"
		},
		descriptionKey: {
			type: null,
			required: false,
			default: "description"
		},
		items: {
			type: null,
			required: false
		},
		defaultValue: {
			type: null,
			required: false
		},
		modelValue: {
			type: null,
			required: false
		},
		modelModifiers: {
			type: null,
			required: false
		},
		multiple: {
			type: Boolean,
			required: false
		},
		highlight: {
			type: Boolean,
			required: false
		},
		fixed: {
			type: Boolean,
			required: false
		},
		createItem: {
			type: [
				Boolean,
				String,
				Object
			],
			required: false
		},
		filterFields: {
			type: Array,
			required: false
		},
		ignoreFilter: {
			type: Boolean,
			required: false
		},
		autofocus: {
			type: Boolean,
			required: false
		},
		autofocusDelay: {
			type: Number,
			required: false,
			default: 0
		},
		class: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		},
		open: {
			type: Boolean,
			required: false
		},
		defaultOpen: {
			type: Boolean,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		name: {
			type: String,
			required: false
		},
		resetSearchTermOnBlur: {
			type: Boolean,
			required: false,
			default: true
		},
		resetSearchTermOnSelect: {
			type: Boolean,
			required: false,
			default: true
		},
		resetModelValueOnClear: {
			type: Boolean,
			required: false,
			default: true
		},
		highlightOnHover: {
			type: Boolean,
			required: false
		},
		by: {
			type: [String, Function],
			required: false
		},
		icon: {
			type: null,
			required: false
		},
		avatar: {
			type: Object,
			required: false
		},
		leading: {
			type: Boolean,
			required: false
		},
		leadingIcon: {
			type: null,
			required: false
		},
		trailing: {
			type: Boolean,
			required: false
		},
		loading: {
			type: Boolean,
			required: false
		},
		loadingIcon: {
			type: null,
			required: false
		}
	}, {
		"searchTerm": {
			type: String,
			default: ""
		},
		"searchTermModifiers": {}
	}),
	emits: /*@__PURE__*/ (0, vue_exports.mergeModels)([
		"change",
		"blur",
		"focus",
		"create",
		"clear",
		"highlight",
		"update:modelValue",
		"update:open"
	], ["update:searchTerm"]),
	setup(__props, { expose: __expose, emit: __emit }) {
		const _props = __props;
		const emits = __emit;
		const slots = (0, vue_exports.useSlots)();
		const props = useComponentProps("selectMenu", _props);
		const searchTerm = (0, vue_exports.useModel)(__props, "searchTerm", {
			type: String,
			default: ""
		});
		const { t } = useLocale();
		const appConfig = useAppConfig();
		const { filterGroups } = useFilter();
		const rootProps = useForwardProps(reactivePick(props, "modelValue", "defaultValue", "open", "defaultOpen", "required", "multiple", "resetSearchTermOnBlur", "resetSearchTermOnSelect", "resetModelValueOnClear", "highlightOnHover", "by"), emits);
		const portalProps = usePortal((0, vue_exports.toRef)(() => props.portal));
		const contentProps = (0, vue_exports.toRef)(() => defu(props.content, {
			side: "bottom",
			sideOffset: 8,
			collisionPadding: 8,
			position: "popper"
		}));
		const arrowProps = (0, vue_exports.toRef)(() => defu(props.arrow, { rounded: true }));
		const clearProps = (0, vue_exports.computed)(() => typeof props.clear === "object" ? props.clear : {});
		const virtualizerProps = (0, vue_exports.toRef)(() => {
			if (!props.virtualize) return false;
			return defu(typeof props.virtualize === "boolean" ? {} : props.virtualize, { estimateSize: getEstimateSize(filteredItems.value, size.value ?? "md", props.descriptionKey, !!slots["item-description"]) });
		});
		const searchInputProps = (0, vue_exports.toRef)(() => defu(props.searchInput, {
			placeholder: t("selectMenu.search"),
			variant: "none",
			fixed: props.fixed
		}));
		const { emitFormBlur, emitFormFocus, emitFormInput, emitFormChange, size: formFieldSize, color: formFieldColor, id, name, highlight: formFieldHighlight, disabled: formFieldDisabled, ariaAttrs } = useFormField(_props);
		const { orientation, size: fieldGroupSize } = useFieldGroup(_props);
		const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons((0, vue_exports.computed)(() => ({
			icon: props.icon,
			leading: props.leading,
			leadingIcon: props.leadingIcon,
			trailing: props.trailing,
			trailingIcon: props.trailingIcon ?? appConfig.ui.icons.chevronDown,
			loading: props.loading,
			loadingIcon: props.loadingIcon
		})));
		const color = (0, vue_exports.computed)(() => formFieldColor.value ?? props.color);
		const highlight = (0, vue_exports.computed)(() => formFieldHighlight.value ?? props.highlight);
		const size = (0, vue_exports.computed)(() => fieldGroupSize.value ?? formFieldSize.value ?? props.size);
		const disabled = (0, vue_exports.computed)(() => formFieldDisabled.value ?? props.disabled);
		const [DefineCreateItemTemplate, ReuseCreateItemTemplate] = createReusableTemplate();
		const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate({ props: {
			item: {
				type: [
					Object,
					String,
					Number,
					Boolean
				],
				required: true
			},
			index: {
				type: Number,
				required: false
			}
		} });
		const ui = (0, vue_exports.computed)(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fselect_menu_default,
			...appConfig.ui?.selectMenu || {}
		})({
			color: color.value,
			variant: props.variant,
			size: size.value,
			loading: props.loading,
			highlight: highlight.value,
			fixed: props.fixed,
			leading: isLeading.value || !!props.avatar || !!slots.leading,
			trailing: isTrailing.value || !!slots.trailing,
			fieldGroup: orientation.value,
			virtualize: !!props.virtualize,
			multiple: props.multiple
		}));
		function displayValue(value) {
			if (props.multiple && Array.isArray(value)) {
				const displayedValues = value.map((item) => getDisplayValue(items.value, item, {
					labelKey: props.labelKey,
					valueKey: props.valueKey,
					by: props.by
				})).filter((v) => v != null && v !== "");
				return displayedValues.length > 0 ? displayedValues.join(", ") : void 0;
			}
			return getDisplayValue(items.value, value, {
				labelKey: props.labelKey,
				valueKey: props.valueKey,
				by: props.by
			});
		}
		const groups = (0, vue_exports.computed)(() => props.items?.length ? isArrayOfArray(props.items) ? props.items : [props.items] : []);
		const items = (0, vue_exports.computed)(() => groups.value.flatMap((group) => group));
		const filteredGroups = (0, vue_exports.computed)(() => {
			if (props.ignoreFilter || !searchTerm.value) return groups.value;
			const fields = Array.isArray(props.filterFields) ? props.filterFields : [props.labelKey];
			return filterGroups(groups.value, searchTerm.value, {
				fields,
				isStructural: (item) => isSelectItem(item) && !!item.type && ["label", "separator"].includes(item.type)
			});
		});
		const filteredItems = (0, vue_exports.computed)(() => filteredGroups.value.flatMap((group) => group));
		const createItem = (0, vue_exports.computed)(() => {
			if (!props.createItem || !searchTerm.value) return false;
			const newItem = props.valueKey ? { [props.valueKey]: searchTerm.value } : searchTerm.value;
			if (typeof props.createItem === "object" && props.createItem.when === "always" || props.createItem === "always") return !filteredItems.value.find((item) => compare$1(item, newItem, props.by ?? props.valueKey));
			return !filteredItems.value.length;
		});
		const createItemPosition = (0, vue_exports.computed)(() => typeof props.createItem === "object" ? props.createItem.position : "bottom");
		const triggerRef = (0, vue_exports.useTemplateRef)("triggerRef");
		let autofocusTimeoutId;
		(0, vue_exports.onScopeDispose)(() => clearTimeout(autofocusTimeoutId));
		function onUpdate(value) {
			if ((0, vue_exports.toRaw)(props.modelValue) === value) return;
			if (props.modelModifiers?.trim && (typeof value === "string" || value === null || value === void 0)) value = value?.trim() ?? null;
			if (props.modelModifiers?.number) value = looseToNumber(value);
			if (props.modelModifiers?.nullable) value ??= null;
			if (props.modelModifiers?.optional && !props.modelModifiers?.nullable && value !== null) value ??= void 0;
			const event = new Event("change", { target: { value } });
			emits("change", event);
			emitFormChange();
			emitFormInput();
			if (props.resetSearchTermOnSelect) searchTerm.value = "";
		}
		const isOpen = (0, vue_exports.ref)(false);
		let timeoutId;
		(0, vue_exports.onScopeDispose)(() => clearTimeout(timeoutId));
		function onUpdateOpen(value) {
			isOpen.value = value;
			if (!value) {
				const event = new FocusEvent("blur");
				emits("blur", event);
				emitFormBlur();
				if (props.resetSearchTermOnBlur) timeoutId = setTimeout(() => {
					searchTerm.value = "";
				}, 100);
			} else {
				const event = new FocusEvent("focus");
				emits("focus", event);
				emitFormFocus();
				clearTimeout(timeoutId);
			}
		}
		function onCreate(e) {
			e.preventDefault();
			e.stopPropagation();
			emits("create", searchTerm.value);
		}
		function onSelect(e, item) {
			if (!isSelectItem(item)) return;
			if (item.disabled) {
				e.preventDefault();
				return;
			}
			item.onSelect?.(e);
		}
		function isSelectItem(item) {
			return typeof item === "object" && item !== null;
		}
		function isModelValueEmpty(modelValue) {
			if (props.multiple && Array.isArray(modelValue)) return modelValue.length === 0;
			return modelValue === void 0 || modelValue === null || modelValue === "";
		}
		function onClear() {
			emits("clear");
		}
		function onMountAutoFocus(event) {
			if (searchInputProps.value.autofocus === false) event.preventDefault();
		}
		const viewportRef = (0, vue_exports.useTemplateRef)("viewportRef");
		const comboboxRootRef = (0, vue_exports.useTemplateRef)("comboboxRootRef");
		(0, vue_exports.watch)(() => props.items, async () => {
			if (!isOpen.value || !props.createItem) return;
			await (0, vue_exports.nextTick)();
			comboboxRootRef.value?.highlightFirstItem?.();
		}, { flush: "post" });
		__expose({
			triggerRef: (0, vue_exports.toRef)(() => triggerRef.value?.$el),
			viewportRef: (0, vue_exports.toRef)(() => viewportRef.value)
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DefineCreateItemTemplate), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxItem_default), {
						"data-slot": "item",
						class: ui.value.item({ class: (0, vue_exports.unref)(props).ui?.item }),
						value: searchTerm.value,
						onSelect: onCreate
					}, {
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<span data-slot="itemLabel" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.itemLabel({ class: (0, vue_exports.unref)(props).ui?.itemLabel }))}"${_scopeId}>`);
								(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "create-item-label", { item: searchTerm.value }, () => {
									_push(`${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(t)("selectMenu.create", { label: searchTerm.value }))}`);
								}, _push, _parent, _scopeId);
								_push(`</span>`);
							} else return [(0, vue_exports.createVNode)("span", {
								"data-slot": "itemLabel",
								class: ui.value.itemLabel({ class: (0, vue_exports.unref)(props).ui?.itemLabel })
							}, [(0, vue_exports.renderSlot)(_ctx.$slots, "create-item-label", { item: searchTerm.value }, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(t)("selectMenu.create", { label: searchTerm.value })), 1)])], 2)];
						}),
						_: 3
					}, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxItem_default), {
						"data-slot": "item",
						class: ui.value.item({ class: (0, vue_exports.unref)(props).ui?.item }),
						value: searchTerm.value,
						onSelect: onCreate
					}, {
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("span", {
							"data-slot": "itemLabel",
							class: ui.value.itemLabel({ class: (0, vue_exports.unref)(props).ui?.itemLabel })
						}, [(0, vue_exports.renderSlot)(_ctx.$slots, "create-item-label", { item: searchTerm.value }, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(t)("selectMenu.create", { label: searchTerm.value })), 1)])], 2)]),
						_: 3
					}, 8, ["class", "value"])];
				}),
				_: 3
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DefineItemTemplate), null, {
				default: (0, vue_exports.withCtx)(({ item, index }, _push, _parent, _scopeId) => {
					if (_push) {
						if (isSelectItem(item) && item.type === "label") _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxLabel_default), {
							"data-slot": "label",
							class: ui.value.label({ class: [
								(0, vue_exports.unref)(props).ui?.label,
								item.ui?.label,
								item.class
							] })
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).labelKey))}`);
								else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).labelKey)), 1)];
							}),
							_: 2
						}, _parent, _scopeId));
						else if (isSelectItem(item) && item.type === "separator") _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxSeparator_default), {
							"data-slot": "separator",
							class: ui.value.separator({ class: [
								(0, vue_exports.unref)(props).ui?.separator,
								item.ui?.separator,
								item.class
							] })
						}, null, _parent, _scopeId));
						else _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxItem_default), {
							"data-slot": "item",
							class: ui.value.item({ class: [
								(0, vue_exports.unref)(props).ui?.item,
								isSelectItem(item) && item.ui?.item,
								isSelectItem(item) && item.class
							] }),
							disabled: isSelectItem(item) && item.disabled,
							value: (0, vue_exports.unref)(props).valueKey && isSelectItem(item) ? (0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).valueKey) : item,
							onSelect: ($event) => onSelect($event, item)
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) (0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "item", {
									item,
									index,
									ui: ui.value
								}, () => {
									(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "item-leading", {
										item,
										index,
										ui: ui.value
									}, () => {
										if (isSelectItem(item) && item.icon) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$5, {
											name: item.icon,
											"data-slot": "itemLeadingIcon",
											class: ui.value.itemLeadingIcon({ class: [(0, vue_exports.unref)(props).ui?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
										}, null, _parent, _scopeId));
										else if (isSelectItem(item) && item.avatar) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$3, (0, vue_exports.mergeProps)({ size: item.ui?.itemLeadingAvatarSize || (0, vue_exports.unref)(props).ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize() }, item.avatar, {
											"data-slot": "itemLeadingAvatar",
											class: ui.value.itemLeadingAvatar({ class: [(0, vue_exports.unref)(props).ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
										}), null, _parent, _scopeId));
										else if (isSelectItem(item) && item.chip) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$4, (0, vue_exports.mergeProps)({
											size: item.ui?.itemLeadingChipSize || (0, vue_exports.unref)(props).ui?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
											inset: "",
											standalone: ""
										}, item.chip, {
											"data-slot": "itemLeadingChip",
											class: ui.value.itemLeadingChip({ class: [(0, vue_exports.unref)(props).ui?.itemLeadingChip, item.ui?.itemLeadingChip] })
										}), null, _parent, _scopeId));
										else _push(`<!---->`);
									}, _push, _parent, _scopeId);
									_push(`<span data-slot="itemWrapper" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.itemWrapper({ class: [(0, vue_exports.unref)(props).ui?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] }))}"${_scopeId}><span data-slot="itemLabel" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.itemLabel({ class: [(0, vue_exports.unref)(props).ui?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] }))}"${_scopeId}>`);
									(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "item-label", {
										item,
										index
									}, () => {
										_push(`${(0, server_renderer_exports.ssrInterpolate)(isSelectItem(item) ? (0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).labelKey) : item)}`);
									}, _push, _parent, _scopeId);
									_push(`</span>`);
									if (isSelectItem(item) && ((0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).descriptionKey) || !!slots["item-description"])) {
										_push(`<span data-slot="itemDescription" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.itemDescription({ class: [(0, vue_exports.unref)(props).ui?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] }))}"${_scopeId}>`);
										(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "item-description", {
											item,
											index
										}, () => {
											_push(`${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).descriptionKey))}`);
										}, _push, _parent, _scopeId);
										_push(`</span>`);
									} else _push(`<!---->`);
									_push(`</span><span data-slot="itemTrailing" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.itemTrailing({ class: [(0, vue_exports.unref)(props).ui?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] }))}"${_scopeId}>`);
									(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "item-trailing", {
										item,
										index,
										ui: ui.value
									}, null, _push, _parent, _scopeId);
									_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxItemIndicator_default), { "as-child": "" }, {
										default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
											if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$5, {
												name: (0, vue_exports.unref)(props).selectedIcon || (0, vue_exports.unref)(appConfig).ui.icons.check,
												"data-slot": "itemTrailingIcon",
												class: ui.value.itemTrailingIcon({ class: [(0, vue_exports.unref)(props).ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
											}, null, _parent, _scopeId));
											else return [(0, vue_exports.createVNode)(_sfc_main$5, {
												name: (0, vue_exports.unref)(props).selectedIcon || (0, vue_exports.unref)(appConfig).ui.icons.check,
												"data-slot": "itemTrailingIcon",
												class: ui.value.itemTrailingIcon({ class: [(0, vue_exports.unref)(props).ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
											}, null, 8, ["name", "class"])];
										}),
										_: 2
									}, _parent, _scopeId));
									_push(`</span>`);
								}, _push, _parent, _scopeId);
								else return [(0, vue_exports.renderSlot)(_ctx.$slots, "item", {
									item,
									index,
									ui: ui.value
								}, () => [
									(0, vue_exports.renderSlot)(_ctx.$slots, "item-leading", {
										item,
										index,
										ui: ui.value
									}, () => [isSelectItem(item) && item.icon ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$5, {
										key: 0,
										name: item.icon,
										"data-slot": "itemLeadingIcon",
										class: ui.value.itemLeadingIcon({ class: [(0, vue_exports.unref)(props).ui?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
									}, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$3, (0, vue_exports.mergeProps)({
										key: 1,
										size: item.ui?.itemLeadingAvatarSize || (0, vue_exports.unref)(props).ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
									}, item.avatar, {
										"data-slot": "itemLeadingAvatar",
										class: ui.value.itemLeadingAvatar({ class: [(0, vue_exports.unref)(props).ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
									}), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$4, (0, vue_exports.mergeProps)({
										key: 2,
										size: item.ui?.itemLeadingChipSize || (0, vue_exports.unref)(props).ui?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
										inset: "",
										standalone: ""
									}, item.chip, {
										"data-slot": "itemLeadingChip",
										class: ui.value.itemLeadingChip({ class: [(0, vue_exports.unref)(props).ui?.itemLeadingChip, item.ui?.itemLeadingChip] })
									}), null, 16, ["size", "class"])) : (0, vue_exports.createCommentVNode)("", true)]),
									(0, vue_exports.createVNode)("span", {
										"data-slot": "itemWrapper",
										class: ui.value.itemWrapper({ class: [(0, vue_exports.unref)(props).ui?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })
									}, [(0, vue_exports.createVNode)("span", {
										"data-slot": "itemLabel",
										class: ui.value.itemLabel({ class: [(0, vue_exports.unref)(props).ui?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })
									}, [(0, vue_exports.renderSlot)(_ctx.$slots, "item-label", {
										item,
										index
									}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(isSelectItem(item) ? (0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).labelKey) : item), 1)])], 2), isSelectItem(item) && ((0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).descriptionKey) || !!slots["item-description"]) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
										key: 0,
										"data-slot": "itemDescription",
										class: ui.value.itemDescription({ class: [(0, vue_exports.unref)(props).ui?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] })
									}, [(0, vue_exports.renderSlot)(_ctx.$slots, "item-description", {
										item,
										index
									}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).descriptionKey)), 1)])], 2)) : (0, vue_exports.createCommentVNode)("", true)], 2),
									(0, vue_exports.createVNode)("span", {
										"data-slot": "itemTrailing",
										class: ui.value.itemTrailing({ class: [(0, vue_exports.unref)(props).ui?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })
									}, [(0, vue_exports.renderSlot)(_ctx.$slots, "item-trailing", {
										item,
										index,
										ui: ui.value
									}), (0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxItemIndicator_default), { "as-child": "" }, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_sfc_main$5, {
											name: (0, vue_exports.unref)(props).selectedIcon || (0, vue_exports.unref)(appConfig).ui.icons.check,
											"data-slot": "itemTrailingIcon",
											class: ui.value.itemTrailingIcon({ class: [(0, vue_exports.unref)(props).ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
										}, null, 8, ["name", "class"])]),
										_: 2
									}, 1024)], 2)
								])];
							}),
							_: 2
						}, _parent, _scopeId));
					} else return [isSelectItem(item) && item.type === "label" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxLabel_default), {
						key: 0,
						"data-slot": "label",
						class: ui.value.label({ class: [
							(0, vue_exports.unref)(props).ui?.label,
							item.ui?.label,
							item.class
						] })
					}, {
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).labelKey)), 1)]),
						_: 2
					}, 1032, ["class"])) : isSelectItem(item) && item.type === "separator" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxSeparator_default), {
						key: 1,
						"data-slot": "separator",
						class: ui.value.separator({ class: [
							(0, vue_exports.unref)(props).ui?.separator,
							item.ui?.separator,
							item.class
						] })
					}, null, 8, ["class"])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxItem_default), {
						key: 2,
						"data-slot": "item",
						class: ui.value.item({ class: [
							(0, vue_exports.unref)(props).ui?.item,
							isSelectItem(item) && item.ui?.item,
							isSelectItem(item) && item.class
						] }),
						disabled: isSelectItem(item) && item.disabled,
						value: (0, vue_exports.unref)(props).valueKey && isSelectItem(item) ? (0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).valueKey) : item,
						onSelect: ($event) => onSelect($event, item)
					}, {
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "item", {
							item,
							index,
							ui: ui.value
						}, () => [
							(0, vue_exports.renderSlot)(_ctx.$slots, "item-leading", {
								item,
								index,
								ui: ui.value
							}, () => [isSelectItem(item) && item.icon ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$5, {
								key: 0,
								name: item.icon,
								"data-slot": "itemLeadingIcon",
								class: ui.value.itemLeadingIcon({ class: [(0, vue_exports.unref)(props).ui?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
							}, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$3, (0, vue_exports.mergeProps)({
								key: 1,
								size: item.ui?.itemLeadingAvatarSize || (0, vue_exports.unref)(props).ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
							}, item.avatar, {
								"data-slot": "itemLeadingAvatar",
								class: ui.value.itemLeadingAvatar({ class: [(0, vue_exports.unref)(props).ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
							}), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$4, (0, vue_exports.mergeProps)({
								key: 2,
								size: item.ui?.itemLeadingChipSize || (0, vue_exports.unref)(props).ui?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
								inset: "",
								standalone: ""
							}, item.chip, {
								"data-slot": "itemLeadingChip",
								class: ui.value.itemLeadingChip({ class: [(0, vue_exports.unref)(props).ui?.itemLeadingChip, item.ui?.itemLeadingChip] })
							}), null, 16, ["size", "class"])) : (0, vue_exports.createCommentVNode)("", true)]),
							(0, vue_exports.createVNode)("span", {
								"data-slot": "itemWrapper",
								class: ui.value.itemWrapper({ class: [(0, vue_exports.unref)(props).ui?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })
							}, [(0, vue_exports.createVNode)("span", {
								"data-slot": "itemLabel",
								class: ui.value.itemLabel({ class: [(0, vue_exports.unref)(props).ui?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })
							}, [(0, vue_exports.renderSlot)(_ctx.$slots, "item-label", {
								item,
								index
							}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(isSelectItem(item) ? (0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).labelKey) : item), 1)])], 2), isSelectItem(item) && ((0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).descriptionKey) || !!slots["item-description"]) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
								key: 0,
								"data-slot": "itemDescription",
								class: ui.value.itemDescription({ class: [(0, vue_exports.unref)(props).ui?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] })
							}, [(0, vue_exports.renderSlot)(_ctx.$slots, "item-description", {
								item,
								index
							}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).descriptionKey)), 1)])], 2)) : (0, vue_exports.createCommentVNode)("", true)], 2),
							(0, vue_exports.createVNode)("span", {
								"data-slot": "itemTrailing",
								class: ui.value.itemTrailing({ class: [(0, vue_exports.unref)(props).ui?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })
							}, [(0, vue_exports.renderSlot)(_ctx.$slots, "item-trailing", {
								item,
								index,
								ui: ui.value
							}), (0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxItemIndicator_default), { "as-child": "" }, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_sfc_main$5, {
									name: (0, vue_exports.unref)(props).selectedIcon || (0, vue_exports.unref)(appConfig).ui.icons.check,
									"data-slot": "itemTrailingIcon",
									class: ui.value.itemTrailingIcon({ class: [(0, vue_exports.unref)(props).ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
								}, null, 8, ["name", "class"])]),
								_: 2
							}, 1024)], 2)
						])]),
						_: 2
					}, 1032, [
						"class",
						"disabled",
						"value",
						"onSelect"
					]))];
				}),
				_: 3
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxRoot_default), (0, vue_exports.mergeProps)({
				ref_key: "comboboxRootRef",
				ref: comboboxRootRef
			}, (0, vue_exports.unref)(rootProps), {
				"ignore-filter": "",
				"as-child": "",
				name: (0, vue_exports.unref)(name),
				disabled: disabled.value,
				"onUpdate:modelValue": onUpdate,
				"onUpdate:open": onUpdateOpen
			}), {
				default: (0, vue_exports.withCtx)(({ modelValue, open }, _push, _parent, _scopeId) => {
					if (_push) {
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxAnchor_default), { "as-child": "" }, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxTrigger_default), (0, vue_exports.mergeProps)({
									id: (0, vue_exports.unref)(id),
									ref_key: "triggerRef",
									ref: triggerRef,
									"data-slot": "base",
									class: ui.value.base({ class: [(0, vue_exports.unref)(props).ui?.base, (0, vue_exports.unref)(props).class] }),
									tabindex: "0"
								}, {
									..._ctx.$attrs,
									...(0, vue_exports.unref)(ariaAttrs)
								}), {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) {
											if ((0, vue_exports.unref)(isLeading) || !!(0, vue_exports.unref)(props).avatar || !!slots.leading) {
												_push(`<span data-slot="leading" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.leading({ class: (0, vue_exports.unref)(props).ui?.leading }))}"${_scopeId}>`);
												(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "leading", {
													modelValue,
													open,
													ui: ui.value
												}, () => {
													if ((0, vue_exports.unref)(isLeading) && (0, vue_exports.unref)(leadingIconName)) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$5, {
														name: (0, vue_exports.unref)(leadingIconName),
														"data-slot": "leadingIcon",
														class: ui.value.leadingIcon({ class: (0, vue_exports.unref)(props).ui?.leadingIcon })
													}, null, _parent, _scopeId));
													else if (!!(0, vue_exports.unref)(props).avatar) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$3, (0, vue_exports.mergeProps)({ size: (0, vue_exports.unref)(props).ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize() }, (0, vue_exports.unref)(props).avatar, {
														"data-slot": "itemLeadingAvatar",
														class: ui.value.itemLeadingAvatar({ class: (0, vue_exports.unref)(props).ui?.itemLeadingAvatar })
													}), null, _parent, _scopeId));
													else _push(`<!---->`);
												}, _push, _parent, _scopeId);
												_push(`</span>`);
											} else _push(`<!---->`);
											(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "default", {
												modelValue,
												open,
												ui: ui.value
											}, () => {
												_push(`<!--[-->`);
												(0, server_renderer_exports.ssrRenderList)([displayValue(modelValue)], (displayedModelValue) => {
													_push(`<!--[-->`);
													if (displayedModelValue !== void 0 && displayedModelValue !== null) _push(`<span data-slot="value" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.value({ class: (0, vue_exports.unref)(props).ui?.value }))}"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(displayedModelValue)}</span>`);
													else _push(`<span data-slot="placeholder" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.placeholder({ class: (0, vue_exports.unref)(props).ui?.placeholder }))}"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(props).placeholder ?? "\xA0")}</span>`);
													_push(`<!--]-->`);
												});
												_push(`<!--]-->`);
											}, _push, _parent, _scopeId);
											if ((0, vue_exports.unref)(isTrailing) || !!slots.trailing || !!(0, vue_exports.unref)(props).clear) {
												_push(`<span data-slot="trailing" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.trailing({ class: (0, vue_exports.unref)(props).ui?.trailing }))}"${_scopeId}>`);
												(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "trailing", {
													modelValue,
													open,
													ui: ui.value
												}, () => {
													if (!!(0, vue_exports.unref)(props).clear && !isModelValueEmpty(modelValue)) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxCancel_default), { "as-child": "" }, {
														default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
															if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$6, (0, vue_exports.mergeProps)({
																as: "span",
																icon: (0, vue_exports.unref)(props).clearIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
																size: size.value,
																variant: "link",
																color: "neutral",
																tabindex: "-1"
															}, clearProps.value, {
																"data-slot": "trailingClear",
																class: ui.value.trailingClear({ class: (0, vue_exports.unref)(props).ui?.trailingClear }),
																onClick: onClear
															}), null, _parent, _scopeId));
															else return [(0, vue_exports.createVNode)(_sfc_main$6, (0, vue_exports.mergeProps)({
																as: "span",
																icon: (0, vue_exports.unref)(props).clearIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
																size: size.value,
																variant: "link",
																color: "neutral",
																tabindex: "-1"
															}, clearProps.value, {
																"data-slot": "trailingClear",
																class: ui.value.trailingClear({ class: (0, vue_exports.unref)(props).ui?.trailingClear }),
																onClick: (0, vue_exports.withModifiers)(onClear, ["stop"])
															}), null, 16, [
																"icon",
																"size",
																"class"
															])];
														}),
														_: 2
													}, _parent, _scopeId));
													else if ((0, vue_exports.unref)(trailingIconName)) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$5, {
														name: (0, vue_exports.unref)(trailingIconName),
														"data-slot": "trailingIcon",
														class: ui.value.trailingIcon({ class: (0, vue_exports.unref)(props).ui?.trailingIcon })
													}, null, _parent, _scopeId));
													else _push(`<!---->`);
												}, _push, _parent, _scopeId);
												_push(`</span>`);
											} else _push(`<!---->`);
										} else return [
											(0, vue_exports.unref)(isLeading) || !!(0, vue_exports.unref)(props).avatar || !!slots.leading ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
												key: 0,
												"data-slot": "leading",
												class: ui.value.leading({ class: (0, vue_exports.unref)(props).ui?.leading })
											}, [(0, vue_exports.renderSlot)(_ctx.$slots, "leading", {
												modelValue,
												open,
												ui: ui.value
											}, () => [(0, vue_exports.unref)(isLeading) && (0, vue_exports.unref)(leadingIconName) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$5, {
												key: 0,
												name: (0, vue_exports.unref)(leadingIconName),
												"data-slot": "leadingIcon",
												class: ui.value.leadingIcon({ class: (0, vue_exports.unref)(props).ui?.leadingIcon })
											}, null, 8, ["name", "class"])) : !!(0, vue_exports.unref)(props).avatar ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$3, (0, vue_exports.mergeProps)({
												key: 1,
												size: (0, vue_exports.unref)(props).ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
											}, (0, vue_exports.unref)(props).avatar, {
												"data-slot": "itemLeadingAvatar",
												class: ui.value.itemLeadingAvatar({ class: (0, vue_exports.unref)(props).ui?.itemLeadingAvatar })
											}), null, 16, ["size", "class"])) : (0, vue_exports.createCommentVNode)("", true)])], 2)) : (0, vue_exports.createCommentVNode)("", true),
											(0, vue_exports.renderSlot)(_ctx.$slots, "default", {
												modelValue,
												open,
												ui: ui.value
											}, () => [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)([displayValue(modelValue)], (displayedModelValue) => {
												return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: displayedModelValue }, [displayedModelValue !== void 0 && displayedModelValue !== null ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
													key: 0,
													"data-slot": "value",
													class: ui.value.value({ class: (0, vue_exports.unref)(props).ui?.value })
												}, (0, vue_exports.toDisplayString)(displayedModelValue), 3)) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
													key: 1,
													"data-slot": "placeholder",
													class: ui.value.placeholder({ class: (0, vue_exports.unref)(props).ui?.placeholder })
												}, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).placeholder ?? "\xA0"), 3))], 64);
											}), 128))]),
											(0, vue_exports.unref)(isTrailing) || !!slots.trailing || !!(0, vue_exports.unref)(props).clear ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
												key: 1,
												"data-slot": "trailing",
												class: ui.value.trailing({ class: (0, vue_exports.unref)(props).ui?.trailing })
											}, [(0, vue_exports.renderSlot)(_ctx.$slots, "trailing", {
												modelValue,
												open,
												ui: ui.value
											}, () => [!!(0, vue_exports.unref)(props).clear && !isModelValueEmpty(modelValue) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxCancel_default), {
												key: 0,
												"as-child": ""
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_sfc_main$6, (0, vue_exports.mergeProps)({
													as: "span",
													icon: (0, vue_exports.unref)(props).clearIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
													size: size.value,
													variant: "link",
													color: "neutral",
													tabindex: "-1"
												}, clearProps.value, {
													"data-slot": "trailingClear",
													class: ui.value.trailingClear({ class: (0, vue_exports.unref)(props).ui?.trailingClear }),
													onClick: (0, vue_exports.withModifiers)(onClear, ["stop"])
												}), null, 16, [
													"icon",
													"size",
													"class"
												])]),
												_: 1
											})) : (0, vue_exports.unref)(trailingIconName) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$5, {
												key: 1,
												name: (0, vue_exports.unref)(trailingIconName),
												"data-slot": "trailingIcon",
												class: ui.value.trailingIcon({ class: (0, vue_exports.unref)(props).ui?.trailingIcon })
											}, null, 8, ["name", "class"])) : (0, vue_exports.createCommentVNode)("", true)])], 2)) : (0, vue_exports.createCommentVNode)("", true)
										];
									}),
									_: 2
								}, _parent, _scopeId));
								else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxTrigger_default), (0, vue_exports.mergeProps)({
									id: (0, vue_exports.unref)(id),
									ref_key: "triggerRef",
									ref: triggerRef,
									"data-slot": "base",
									class: ui.value.base({ class: [(0, vue_exports.unref)(props).ui?.base, (0, vue_exports.unref)(props).class] }),
									tabindex: "0"
								}, {
									..._ctx.$attrs,
									...(0, vue_exports.unref)(ariaAttrs)
								}), {
									default: (0, vue_exports.withCtx)(() => [
										(0, vue_exports.unref)(isLeading) || !!(0, vue_exports.unref)(props).avatar || !!slots.leading ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
											key: 0,
											"data-slot": "leading",
											class: ui.value.leading({ class: (0, vue_exports.unref)(props).ui?.leading })
										}, [(0, vue_exports.renderSlot)(_ctx.$slots, "leading", {
											modelValue,
											open,
											ui: ui.value
										}, () => [(0, vue_exports.unref)(isLeading) && (0, vue_exports.unref)(leadingIconName) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$5, {
											key: 0,
											name: (0, vue_exports.unref)(leadingIconName),
											"data-slot": "leadingIcon",
											class: ui.value.leadingIcon({ class: (0, vue_exports.unref)(props).ui?.leadingIcon })
										}, null, 8, ["name", "class"])) : !!(0, vue_exports.unref)(props).avatar ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$3, (0, vue_exports.mergeProps)({
											key: 1,
											size: (0, vue_exports.unref)(props).ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
										}, (0, vue_exports.unref)(props).avatar, {
											"data-slot": "itemLeadingAvatar",
											class: ui.value.itemLeadingAvatar({ class: (0, vue_exports.unref)(props).ui?.itemLeadingAvatar })
										}), null, 16, ["size", "class"])) : (0, vue_exports.createCommentVNode)("", true)])], 2)) : (0, vue_exports.createCommentVNode)("", true),
										(0, vue_exports.renderSlot)(_ctx.$slots, "default", {
											modelValue,
											open,
											ui: ui.value
										}, () => [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)([displayValue(modelValue)], (displayedModelValue) => {
											return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: displayedModelValue }, [displayedModelValue !== void 0 && displayedModelValue !== null ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
												key: 0,
												"data-slot": "value",
												class: ui.value.value({ class: (0, vue_exports.unref)(props).ui?.value })
											}, (0, vue_exports.toDisplayString)(displayedModelValue), 3)) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
												key: 1,
												"data-slot": "placeholder",
												class: ui.value.placeholder({ class: (0, vue_exports.unref)(props).ui?.placeholder })
											}, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).placeholder ?? "\xA0"), 3))], 64);
										}), 128))]),
										(0, vue_exports.unref)(isTrailing) || !!slots.trailing || !!(0, vue_exports.unref)(props).clear ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
											key: 1,
											"data-slot": "trailing",
											class: ui.value.trailing({ class: (0, vue_exports.unref)(props).ui?.trailing })
										}, [(0, vue_exports.renderSlot)(_ctx.$slots, "trailing", {
											modelValue,
											open,
											ui: ui.value
										}, () => [!!(0, vue_exports.unref)(props).clear && !isModelValueEmpty(modelValue) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxCancel_default), {
											key: 0,
											"as-child": ""
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_sfc_main$6, (0, vue_exports.mergeProps)({
												as: "span",
												icon: (0, vue_exports.unref)(props).clearIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
												size: size.value,
												variant: "link",
												color: "neutral",
												tabindex: "-1"
											}, clearProps.value, {
												"data-slot": "trailingClear",
												class: ui.value.trailingClear({ class: (0, vue_exports.unref)(props).ui?.trailingClear }),
												onClick: (0, vue_exports.withModifiers)(onClear, ["stop"])
											}), null, 16, [
												"icon",
												"size",
												"class"
											])]),
											_: 1
										})) : (0, vue_exports.unref)(trailingIconName) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$5, {
											key: 1,
											name: (0, vue_exports.unref)(trailingIconName),
											"data-slot": "trailingIcon",
											class: ui.value.trailingIcon({ class: (0, vue_exports.unref)(props).ui?.trailingIcon })
										}, null, 8, ["name", "class"])) : (0, vue_exports.createCommentVNode)("", true)])], 2)) : (0, vue_exports.createCommentVNode)("", true)
									]),
									_: 2
								}, 1040, ["id", "class"])];
							}),
							_: 2
						}, _parent, _scopeId));
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxPortal_default), (0, vue_exports.unref)(portalProps), {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(FieldGroupReset), null, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxContent_default), (0, vue_exports.mergeProps)({
											"data-slot": "content",
											class: ui.value.content({ class: (0, vue_exports.unref)(props).ui?.content })
										}, contentProps.value), {
											default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
												if (_push) {
													_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(FocusScope_default), {
														trapped: "",
														"data-slot": "focusScope",
														class: ui.value.focusScope({ class: (0, vue_exports.unref)(props).ui?.focusScope }),
														onMountAutoFocus
													}, {
														default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
															if (_push) {
																(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "content-top", {}, null, _push, _parent, _scopeId);
																if (!!(0, vue_exports.unref)(props).searchInput) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxInput_default), {
																	modelValue: searchTerm.value,
																	"onUpdate:modelValue": ($event) => searchTerm.value = $event,
																	"display-value": () => searchTerm.value,
																	"as-child": ""
																}, {
																	default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
																		if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, (0, vue_exports.mergeProps)({
																			autofocus: "",
																			autocomplete: "off",
																			size: size.value
																		}, searchInputProps.value, {
																			"model-modifiers": { trim: (0, vue_exports.unref)(props).modelModifiers?.trim },
																			"data-slot": "input",
																			class: ui.value.input({ class: (0, vue_exports.unref)(props).ui?.input }),
																			onChange: () => {}
																		}), null, _parent, _scopeId));
																		else return [(0, vue_exports.createVNode)(_sfc_main$1, (0, vue_exports.mergeProps)({
																			autofocus: "",
																			autocomplete: "off",
																			size: size.value
																		}, searchInputProps.value, {
																			"model-modifiers": { trim: (0, vue_exports.unref)(props).modelModifiers?.trim },
																			"data-slot": "input",
																			class: ui.value.input({ class: (0, vue_exports.unref)(props).ui?.input }),
																			onChange: (0, vue_exports.withModifiers)(() => {}, ["stop"])
																		}), null, 16, [
																			"size",
																			"model-modifiers",
																			"class",
																			"onChange"
																		])];
																	}),
																	_: 2
																}, _parent, _scopeId));
																else _push(`<!---->`);
																_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxEmpty_default), {
																	"data-slot": "empty",
																	class: ui.value.empty({ class: (0, vue_exports.unref)(props).ui?.empty })
																}, {
																	default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
																		if (_push) (0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => {
																			_push(`${(0, server_renderer_exports.ssrInterpolate)(searchTerm.value ? (0, vue_exports.unref)(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : (0, vue_exports.unref)(t)("selectMenu.noData"))}`);
																		}, _push, _parent, _scopeId);
																		else return [(0, vue_exports.renderSlot)(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(searchTerm.value ? (0, vue_exports.unref)(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : (0, vue_exports.unref)(t)("selectMenu.noData")), 1)])];
																	}),
																	_: 2
																}, _parent, _scopeId));
																_push(`<div role="presentation" data-slot="viewport" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.viewport({ class: (0, vue_exports.unref)(props).ui?.viewport }))}"${_scopeId}>`);
																if (!!(0, vue_exports.unref)(props).virtualize) {
																	_push(`<!--[-->`);
																	if (createItem.value && createItemPosition.value === "top") _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ReuseCreateItemTemplate), null, null, _parent, _scopeId));
																	else _push(`<!---->`);
																	_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxVirtualizer_default), (0, vue_exports.mergeProps)({
																		options: filteredItems.value,
																		"text-content": (item2) => isSelectItem(item2) ? (0, vue_exports.unref)(get)(item2, (0, vue_exports.unref)(props).labelKey) : String(item2)
																	}, virtualizerProps.value), {
																		default: (0, vue_exports.withCtx)(({ option: item, virtualItem }, _push, _parent, _scopeId) => {
																			if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ReuseItemTemplate), {
																				item,
																				index: virtualItem.index
																			}, null, _parent, _scopeId));
																			else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseItemTemplate), {
																				item,
																				index: virtualItem.index
																			}, null, 8, ["item", "index"])];
																		}),
																		_: 2
																	}, _parent, _scopeId));
																	if (createItem.value && createItemPosition.value === "bottom") _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ReuseCreateItemTemplate), null, null, _parent, _scopeId));
																	else _push(`<!---->`);
																	_push(`<!--]-->`);
																} else {
																	_push(`<!--[-->`);
																	if (createItem.value && createItemPosition.value === "top") _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxGroup_default), {
																		"data-slot": "group",
																		class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
																	}, {
																		default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
																			if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ReuseCreateItemTemplate), null, null, _parent, _scopeId));
																			else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseCreateItemTemplate))];
																		}),
																		_: 2
																	}, _parent, _scopeId));
																	else _push(`<!---->`);
																	_push(`<!--[-->`);
																	(0, server_renderer_exports.ssrRenderList)(filteredGroups.value, (group, groupIndex) => {
																		_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxGroup_default), {
																			key: `group-${groupIndex}`,
																			"data-slot": "group",
																			class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
																		}, {
																			default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
																				if (_push) {
																					_push(`<!--[-->`);
																					(0, server_renderer_exports.ssrRenderList)(group, (item, index) => {
																						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ReuseItemTemplate), {
																							key: `group-${groupIndex}-${index}`,
																							item,
																							index
																						}, null, _parent, _scopeId));
																					});
																					_push(`<!--]-->`);
																				} else return [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(group, (item, index) => {
																					return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseItemTemplate), {
																						key: `group-${groupIndex}-${index}`,
																						item,
																						index
																					}, null, 8, ["item", "index"]);
																				}), 128))];
																			}),
																			_: 2
																		}, _parent, _scopeId));
																	});
																	_push(`<!--]-->`);
																	if (createItem.value && createItemPosition.value === "bottom") _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxGroup_default), {
																		"data-slot": "group",
																		class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
																	}, {
																		default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
																			if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ReuseCreateItemTemplate), null, null, _parent, _scopeId));
																			else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseCreateItemTemplate))];
																		}),
																		_: 2
																	}, _parent, _scopeId));
																	else _push(`<!---->`);
																	_push(`<!--]-->`);
																}
																_push(`</div>`);
																(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "content-bottom", {}, null, _push, _parent, _scopeId);
															} else return [
																(0, vue_exports.renderSlot)(_ctx.$slots, "content-top"),
																!!(0, vue_exports.unref)(props).searchInput ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxInput_default), {
																	key: 0,
																	modelValue: searchTerm.value,
																	"onUpdate:modelValue": ($event) => searchTerm.value = $event,
																	"display-value": () => searchTerm.value,
																	"as-child": ""
																}, {
																	default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_sfc_main$1, (0, vue_exports.mergeProps)({
																		autofocus: "",
																		autocomplete: "off",
																		size: size.value
																	}, searchInputProps.value, {
																		"model-modifiers": { trim: (0, vue_exports.unref)(props).modelModifiers?.trim },
																		"data-slot": "input",
																		class: ui.value.input({ class: (0, vue_exports.unref)(props).ui?.input }),
																		onChange: (0, vue_exports.withModifiers)(() => {}, ["stop"])
																	}), null, 16, [
																		"size",
																		"model-modifiers",
																		"class",
																		"onChange"
																	])]),
																	_: 1
																}, 8, [
																	"modelValue",
																	"onUpdate:modelValue",
																	"display-value"
																])) : (0, vue_exports.createCommentVNode)("", true),
																(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxEmpty_default), {
																	"data-slot": "empty",
																	class: ui.value.empty({ class: (0, vue_exports.unref)(props).ui?.empty })
																}, {
																	default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(searchTerm.value ? (0, vue_exports.unref)(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : (0, vue_exports.unref)(t)("selectMenu.noData")), 1)])]),
																	_: 3
																}, 8, ["class"]),
																(0, vue_exports.createVNode)("div", {
																	ref_key: "viewportRef",
																	ref: viewportRef,
																	role: "presentation",
																	"data-slot": "viewport",
																	class: ui.value.viewport({ class: (0, vue_exports.unref)(props).ui?.viewport })
																}, [!!(0, vue_exports.unref)(props).virtualize ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 0 }, [
																	createItem.value && createItemPosition.value === "top" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseCreateItemTemplate), { key: 0 })) : (0, vue_exports.createCommentVNode)("", true),
																	(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxVirtualizer_default), (0, vue_exports.mergeProps)({
																		options: filteredItems.value,
																		"text-content": (item2) => isSelectItem(item2) ? (0, vue_exports.unref)(get)(item2, (0, vue_exports.unref)(props).labelKey) : String(item2)
																	}, virtualizerProps.value), {
																		default: (0, vue_exports.withCtx)(({ option: item, virtualItem }) => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseItemTemplate), {
																			item,
																			index: virtualItem.index
																		}, null, 8, ["item", "index"])]),
																		_: 1
																	}, 16, ["options", "text-content"]),
																	createItem.value && createItemPosition.value === "bottom" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseCreateItemTemplate), { key: 1 })) : (0, vue_exports.createCommentVNode)("", true)
																], 64)) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 1 }, [
																	createItem.value && createItemPosition.value === "top" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
																		key: 0,
																		"data-slot": "group",
																		class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
																	}, {
																		default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseCreateItemTemplate))]),
																		_: 1
																	}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true),
																	((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(filteredGroups.value, (group, groupIndex) => {
																		return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
																			key: `group-${groupIndex}`,
																			"data-slot": "group",
																			class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
																		}, {
																			default: (0, vue_exports.withCtx)(() => [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(group, (item, index) => {
																				return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseItemTemplate), {
																					key: `group-${groupIndex}-${index}`,
																					item,
																					index
																				}, null, 8, ["item", "index"]);
																			}), 128))]),
																			_: 2
																		}, 1032, ["class"]);
																	}), 128)),
																	createItem.value && createItemPosition.value === "bottom" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
																		key: 1,
																		"data-slot": "group",
																		class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
																	}, {
																		default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseCreateItemTemplate))]),
																		_: 1
																	}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true)
																], 64))], 2),
																(0, vue_exports.renderSlot)(_ctx.$slots, "content-bottom")
															];
														}),
														_: 2
													}, _parent, _scopeId));
													if (!!(0, vue_exports.unref)(props).arrow) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxArrow_default), (0, vue_exports.mergeProps)(arrowProps.value, {
														"data-slot": "arrow",
														class: ui.value.arrow({ class: (0, vue_exports.unref)(props).ui?.arrow })
													}), null, _parent, _scopeId));
													else _push(`<!---->`);
												} else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(FocusScope_default), {
													trapped: "",
													"data-slot": "focusScope",
													class: ui.value.focusScope({ class: (0, vue_exports.unref)(props).ui?.focusScope }),
													onMountAutoFocus
												}, {
													default: (0, vue_exports.withCtx)(() => [
														(0, vue_exports.renderSlot)(_ctx.$slots, "content-top"),
														!!(0, vue_exports.unref)(props).searchInput ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxInput_default), {
															key: 0,
															modelValue: searchTerm.value,
															"onUpdate:modelValue": ($event) => searchTerm.value = $event,
															"display-value": () => searchTerm.value,
															"as-child": ""
														}, {
															default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_sfc_main$1, (0, vue_exports.mergeProps)({
																autofocus: "",
																autocomplete: "off",
																size: size.value
															}, searchInputProps.value, {
																"model-modifiers": { trim: (0, vue_exports.unref)(props).modelModifiers?.trim },
																"data-slot": "input",
																class: ui.value.input({ class: (0, vue_exports.unref)(props).ui?.input }),
																onChange: (0, vue_exports.withModifiers)(() => {}, ["stop"])
															}), null, 16, [
																"size",
																"model-modifiers",
																"class",
																"onChange"
															])]),
															_: 1
														}, 8, [
															"modelValue",
															"onUpdate:modelValue",
															"display-value"
														])) : (0, vue_exports.createCommentVNode)("", true),
														(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxEmpty_default), {
															"data-slot": "empty",
															class: ui.value.empty({ class: (0, vue_exports.unref)(props).ui?.empty })
														}, {
															default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(searchTerm.value ? (0, vue_exports.unref)(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : (0, vue_exports.unref)(t)("selectMenu.noData")), 1)])]),
															_: 3
														}, 8, ["class"]),
														(0, vue_exports.createVNode)("div", {
															ref_key: "viewportRef",
															ref: viewportRef,
															role: "presentation",
															"data-slot": "viewport",
															class: ui.value.viewport({ class: (0, vue_exports.unref)(props).ui?.viewport })
														}, [!!(0, vue_exports.unref)(props).virtualize ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 0 }, [
															createItem.value && createItemPosition.value === "top" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseCreateItemTemplate), { key: 0 })) : (0, vue_exports.createCommentVNode)("", true),
															(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxVirtualizer_default), (0, vue_exports.mergeProps)({
																options: filteredItems.value,
																"text-content": (item2) => isSelectItem(item2) ? (0, vue_exports.unref)(get)(item2, (0, vue_exports.unref)(props).labelKey) : String(item2)
															}, virtualizerProps.value), {
																default: (0, vue_exports.withCtx)(({ option: item, virtualItem }) => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseItemTemplate), {
																	item,
																	index: virtualItem.index
																}, null, 8, ["item", "index"])]),
																_: 1
															}, 16, ["options", "text-content"]),
															createItem.value && createItemPosition.value === "bottom" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseCreateItemTemplate), { key: 1 })) : (0, vue_exports.createCommentVNode)("", true)
														], 64)) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 1 }, [
															createItem.value && createItemPosition.value === "top" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
																key: 0,
																"data-slot": "group",
																class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
															}, {
																default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseCreateItemTemplate))]),
																_: 1
															}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true),
															((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(filteredGroups.value, (group, groupIndex) => {
																return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
																	key: `group-${groupIndex}`,
																	"data-slot": "group",
																	class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
																}, {
																	default: (0, vue_exports.withCtx)(() => [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(group, (item, index) => {
																		return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseItemTemplate), {
																			key: `group-${groupIndex}-${index}`,
																			item,
																			index
																		}, null, 8, ["item", "index"]);
																	}), 128))]),
																	_: 2
																}, 1032, ["class"]);
															}), 128)),
															createItem.value && createItemPosition.value === "bottom" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
																key: 1,
																"data-slot": "group",
																class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
															}, {
																default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseCreateItemTemplate))]),
																_: 1
															}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true)
														], 64))], 2),
														(0, vue_exports.renderSlot)(_ctx.$slots, "content-bottom")
													]),
													_: 3
												}, 8, ["class"]), !!(0, vue_exports.unref)(props).arrow ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxArrow_default), (0, vue_exports.mergeProps)({ key: 0 }, arrowProps.value, {
													"data-slot": "arrow",
													class: ui.value.arrow({ class: (0, vue_exports.unref)(props).ui?.arrow })
												}), null, 16, ["class"])) : (0, vue_exports.createCommentVNode)("", true)];
											}),
											_: 2
										}, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxContent_default), (0, vue_exports.mergeProps)({
											"data-slot": "content",
											class: ui.value.content({ class: (0, vue_exports.unref)(props).ui?.content })
										}, contentProps.value), {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(FocusScope_default), {
												trapped: "",
												"data-slot": "focusScope",
												class: ui.value.focusScope({ class: (0, vue_exports.unref)(props).ui?.focusScope }),
												onMountAutoFocus
											}, {
												default: (0, vue_exports.withCtx)(() => [
													(0, vue_exports.renderSlot)(_ctx.$slots, "content-top"),
													!!(0, vue_exports.unref)(props).searchInput ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxInput_default), {
														key: 0,
														modelValue: searchTerm.value,
														"onUpdate:modelValue": ($event) => searchTerm.value = $event,
														"display-value": () => searchTerm.value,
														"as-child": ""
													}, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_sfc_main$1, (0, vue_exports.mergeProps)({
															autofocus: "",
															autocomplete: "off",
															size: size.value
														}, searchInputProps.value, {
															"model-modifiers": { trim: (0, vue_exports.unref)(props).modelModifiers?.trim },
															"data-slot": "input",
															class: ui.value.input({ class: (0, vue_exports.unref)(props).ui?.input }),
															onChange: (0, vue_exports.withModifiers)(() => {}, ["stop"])
														}), null, 16, [
															"size",
															"model-modifiers",
															"class",
															"onChange"
														])]),
														_: 1
													}, 8, [
														"modelValue",
														"onUpdate:modelValue",
														"display-value"
													])) : (0, vue_exports.createCommentVNode)("", true),
													(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxEmpty_default), {
														"data-slot": "empty",
														class: ui.value.empty({ class: (0, vue_exports.unref)(props).ui?.empty })
													}, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(searchTerm.value ? (0, vue_exports.unref)(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : (0, vue_exports.unref)(t)("selectMenu.noData")), 1)])]),
														_: 3
													}, 8, ["class"]),
													(0, vue_exports.createVNode)("div", {
														ref_key: "viewportRef",
														ref: viewportRef,
														role: "presentation",
														"data-slot": "viewport",
														class: ui.value.viewport({ class: (0, vue_exports.unref)(props).ui?.viewport })
													}, [!!(0, vue_exports.unref)(props).virtualize ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 0 }, [
														createItem.value && createItemPosition.value === "top" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseCreateItemTemplate), { key: 0 })) : (0, vue_exports.createCommentVNode)("", true),
														(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxVirtualizer_default), (0, vue_exports.mergeProps)({
															options: filteredItems.value,
															"text-content": (item2) => isSelectItem(item2) ? (0, vue_exports.unref)(get)(item2, (0, vue_exports.unref)(props).labelKey) : String(item2)
														}, virtualizerProps.value), {
															default: (0, vue_exports.withCtx)(({ option: item, virtualItem }) => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseItemTemplate), {
																item,
																index: virtualItem.index
															}, null, 8, ["item", "index"])]),
															_: 1
														}, 16, ["options", "text-content"]),
														createItem.value && createItemPosition.value === "bottom" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseCreateItemTemplate), { key: 1 })) : (0, vue_exports.createCommentVNode)("", true)
													], 64)) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 1 }, [
														createItem.value && createItemPosition.value === "top" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
															key: 0,
															"data-slot": "group",
															class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
														}, {
															default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseCreateItemTemplate))]),
															_: 1
														}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true),
														((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(filteredGroups.value, (group, groupIndex) => {
															return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
																key: `group-${groupIndex}`,
																"data-slot": "group",
																class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
															}, {
																default: (0, vue_exports.withCtx)(() => [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(group, (item, index) => {
																	return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseItemTemplate), {
																		key: `group-${groupIndex}-${index}`,
																		item,
																		index
																	}, null, 8, ["item", "index"]);
																}), 128))]),
																_: 2
															}, 1032, ["class"]);
														}), 128)),
														createItem.value && createItemPosition.value === "bottom" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
															key: 1,
															"data-slot": "group",
															class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
														}, {
															default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseCreateItemTemplate))]),
															_: 1
														}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true)
													], 64))], 2),
													(0, vue_exports.renderSlot)(_ctx.$slots, "content-bottom")
												]),
												_: 3
											}, 8, ["class"]), !!(0, vue_exports.unref)(props).arrow ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxArrow_default), (0, vue_exports.mergeProps)({ key: 0 }, arrowProps.value, {
												"data-slot": "arrow",
												class: ui.value.arrow({ class: (0, vue_exports.unref)(props).ui?.arrow })
											}), null, 16, ["class"])) : (0, vue_exports.createCommentVNode)("", true)]),
											_: 3
										}, 16, ["class"])];
									}),
									_: 2
								}, _parent, _scopeId));
								else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(FieldGroupReset), null, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxContent_default), (0, vue_exports.mergeProps)({
										"data-slot": "content",
										class: ui.value.content({ class: (0, vue_exports.unref)(props).ui?.content })
									}, contentProps.value), {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(FocusScope_default), {
											trapped: "",
											"data-slot": "focusScope",
											class: ui.value.focusScope({ class: (0, vue_exports.unref)(props).ui?.focusScope }),
											onMountAutoFocus
										}, {
											default: (0, vue_exports.withCtx)(() => [
												(0, vue_exports.renderSlot)(_ctx.$slots, "content-top"),
												!!(0, vue_exports.unref)(props).searchInput ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxInput_default), {
													key: 0,
													modelValue: searchTerm.value,
													"onUpdate:modelValue": ($event) => searchTerm.value = $event,
													"display-value": () => searchTerm.value,
													"as-child": ""
												}, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_sfc_main$1, (0, vue_exports.mergeProps)({
														autofocus: "",
														autocomplete: "off",
														size: size.value
													}, searchInputProps.value, {
														"model-modifiers": { trim: (0, vue_exports.unref)(props).modelModifiers?.trim },
														"data-slot": "input",
														class: ui.value.input({ class: (0, vue_exports.unref)(props).ui?.input }),
														onChange: (0, vue_exports.withModifiers)(() => {}, ["stop"])
													}), null, 16, [
														"size",
														"model-modifiers",
														"class",
														"onChange"
													])]),
													_: 1
												}, 8, [
													"modelValue",
													"onUpdate:modelValue",
													"display-value"
												])) : (0, vue_exports.createCommentVNode)("", true),
												(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxEmpty_default), {
													"data-slot": "empty",
													class: ui.value.empty({ class: (0, vue_exports.unref)(props).ui?.empty })
												}, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(searchTerm.value ? (0, vue_exports.unref)(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : (0, vue_exports.unref)(t)("selectMenu.noData")), 1)])]),
													_: 3
												}, 8, ["class"]),
												(0, vue_exports.createVNode)("div", {
													ref_key: "viewportRef",
													ref: viewportRef,
													role: "presentation",
													"data-slot": "viewport",
													class: ui.value.viewport({ class: (0, vue_exports.unref)(props).ui?.viewport })
												}, [!!(0, vue_exports.unref)(props).virtualize ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 0 }, [
													createItem.value && createItemPosition.value === "top" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseCreateItemTemplate), { key: 0 })) : (0, vue_exports.createCommentVNode)("", true),
													(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxVirtualizer_default), (0, vue_exports.mergeProps)({
														options: filteredItems.value,
														"text-content": (item2) => isSelectItem(item2) ? (0, vue_exports.unref)(get)(item2, (0, vue_exports.unref)(props).labelKey) : String(item2)
													}, virtualizerProps.value), {
														default: (0, vue_exports.withCtx)(({ option: item, virtualItem }) => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseItemTemplate), {
															item,
															index: virtualItem.index
														}, null, 8, ["item", "index"])]),
														_: 1
													}, 16, ["options", "text-content"]),
													createItem.value && createItemPosition.value === "bottom" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseCreateItemTemplate), { key: 1 })) : (0, vue_exports.createCommentVNode)("", true)
												], 64)) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 1 }, [
													createItem.value && createItemPosition.value === "top" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
														key: 0,
														"data-slot": "group",
														class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
													}, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseCreateItemTemplate))]),
														_: 1
													}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true),
													((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(filteredGroups.value, (group, groupIndex) => {
														return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
															key: `group-${groupIndex}`,
															"data-slot": "group",
															class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
														}, {
															default: (0, vue_exports.withCtx)(() => [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(group, (item, index) => {
																return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseItemTemplate), {
																	key: `group-${groupIndex}-${index}`,
																	item,
																	index
																}, null, 8, ["item", "index"]);
															}), 128))]),
															_: 2
														}, 1032, ["class"]);
													}), 128)),
													createItem.value && createItemPosition.value === "bottom" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
														key: 1,
														"data-slot": "group",
														class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
													}, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseCreateItemTemplate))]),
														_: 1
													}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true)
												], 64))], 2),
												(0, vue_exports.renderSlot)(_ctx.$slots, "content-bottom")
											]),
											_: 3
										}, 8, ["class"]), !!(0, vue_exports.unref)(props).arrow ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxArrow_default), (0, vue_exports.mergeProps)({ key: 0 }, arrowProps.value, {
											"data-slot": "arrow",
											class: ui.value.arrow({ class: (0, vue_exports.unref)(props).ui?.arrow })
										}), null, 16, ["class"])) : (0, vue_exports.createCommentVNode)("", true)]),
										_: 3
									}, 16, ["class"])]),
									_: 3
								})];
							}),
							_: 2
						}, _parent, _scopeId));
					} else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxAnchor_default), { "as-child": "" }, {
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxTrigger_default), (0, vue_exports.mergeProps)({
							id: (0, vue_exports.unref)(id),
							ref_key: "triggerRef",
							ref: triggerRef,
							"data-slot": "base",
							class: ui.value.base({ class: [(0, vue_exports.unref)(props).ui?.base, (0, vue_exports.unref)(props).class] }),
							tabindex: "0"
						}, {
							..._ctx.$attrs,
							...(0, vue_exports.unref)(ariaAttrs)
						}), {
							default: (0, vue_exports.withCtx)(() => [
								(0, vue_exports.unref)(isLeading) || !!(0, vue_exports.unref)(props).avatar || !!slots.leading ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
									key: 0,
									"data-slot": "leading",
									class: ui.value.leading({ class: (0, vue_exports.unref)(props).ui?.leading })
								}, [(0, vue_exports.renderSlot)(_ctx.$slots, "leading", {
									modelValue,
									open,
									ui: ui.value
								}, () => [(0, vue_exports.unref)(isLeading) && (0, vue_exports.unref)(leadingIconName) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$5, {
									key: 0,
									name: (0, vue_exports.unref)(leadingIconName),
									"data-slot": "leadingIcon",
									class: ui.value.leadingIcon({ class: (0, vue_exports.unref)(props).ui?.leadingIcon })
								}, null, 8, ["name", "class"])) : !!(0, vue_exports.unref)(props).avatar ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$3, (0, vue_exports.mergeProps)({
									key: 1,
									size: (0, vue_exports.unref)(props).ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
								}, (0, vue_exports.unref)(props).avatar, {
									"data-slot": "itemLeadingAvatar",
									class: ui.value.itemLeadingAvatar({ class: (0, vue_exports.unref)(props).ui?.itemLeadingAvatar })
								}), null, 16, ["size", "class"])) : (0, vue_exports.createCommentVNode)("", true)])], 2)) : (0, vue_exports.createCommentVNode)("", true),
								(0, vue_exports.renderSlot)(_ctx.$slots, "default", {
									modelValue,
									open,
									ui: ui.value
								}, () => [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)([displayValue(modelValue)], (displayedModelValue) => {
									return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: displayedModelValue }, [displayedModelValue !== void 0 && displayedModelValue !== null ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
										key: 0,
										"data-slot": "value",
										class: ui.value.value({ class: (0, vue_exports.unref)(props).ui?.value })
									}, (0, vue_exports.toDisplayString)(displayedModelValue), 3)) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
										key: 1,
										"data-slot": "placeholder",
										class: ui.value.placeholder({ class: (0, vue_exports.unref)(props).ui?.placeholder })
									}, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).placeholder ?? "\xA0"), 3))], 64);
								}), 128))]),
								(0, vue_exports.unref)(isTrailing) || !!slots.trailing || !!(0, vue_exports.unref)(props).clear ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
									key: 1,
									"data-slot": "trailing",
									class: ui.value.trailing({ class: (0, vue_exports.unref)(props).ui?.trailing })
								}, [(0, vue_exports.renderSlot)(_ctx.$slots, "trailing", {
									modelValue,
									open,
									ui: ui.value
								}, () => [!!(0, vue_exports.unref)(props).clear && !isModelValueEmpty(modelValue) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxCancel_default), {
									key: 0,
									"as-child": ""
								}, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_sfc_main$6, (0, vue_exports.mergeProps)({
										as: "span",
										icon: (0, vue_exports.unref)(props).clearIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
										size: size.value,
										variant: "link",
										color: "neutral",
										tabindex: "-1"
									}, clearProps.value, {
										"data-slot": "trailingClear",
										class: ui.value.trailingClear({ class: (0, vue_exports.unref)(props).ui?.trailingClear }),
										onClick: (0, vue_exports.withModifiers)(onClear, ["stop"])
									}), null, 16, [
										"icon",
										"size",
										"class"
									])]),
									_: 1
								})) : (0, vue_exports.unref)(trailingIconName) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$5, {
									key: 1,
									name: (0, vue_exports.unref)(trailingIconName),
									"data-slot": "trailingIcon",
									class: ui.value.trailingIcon({ class: (0, vue_exports.unref)(props).ui?.trailingIcon })
								}, null, 8, ["name", "class"])) : (0, vue_exports.createCommentVNode)("", true)])], 2)) : (0, vue_exports.createCommentVNode)("", true)
							]),
							_: 2
						}, 1040, ["id", "class"])]),
						_: 2
					}, 1024), (0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxPortal_default), (0, vue_exports.unref)(portalProps), {
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(FieldGroupReset), null, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxContent_default), (0, vue_exports.mergeProps)({
								"data-slot": "content",
								class: ui.value.content({ class: (0, vue_exports.unref)(props).ui?.content })
							}, contentProps.value), {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(FocusScope_default), {
									trapped: "",
									"data-slot": "focusScope",
									class: ui.value.focusScope({ class: (0, vue_exports.unref)(props).ui?.focusScope }),
									onMountAutoFocus
								}, {
									default: (0, vue_exports.withCtx)(() => [
										(0, vue_exports.renderSlot)(_ctx.$slots, "content-top"),
										!!(0, vue_exports.unref)(props).searchInput ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxInput_default), {
											key: 0,
											modelValue: searchTerm.value,
											"onUpdate:modelValue": ($event) => searchTerm.value = $event,
											"display-value": () => searchTerm.value,
											"as-child": ""
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_sfc_main$1, (0, vue_exports.mergeProps)({
												autofocus: "",
												autocomplete: "off",
												size: size.value
											}, searchInputProps.value, {
												"model-modifiers": { trim: (0, vue_exports.unref)(props).modelModifiers?.trim },
												"data-slot": "input",
												class: ui.value.input({ class: (0, vue_exports.unref)(props).ui?.input }),
												onChange: (0, vue_exports.withModifiers)(() => {}, ["stop"])
											}), null, 16, [
												"size",
												"model-modifiers",
												"class",
												"onChange"
											])]),
											_: 1
										}, 8, [
											"modelValue",
											"onUpdate:modelValue",
											"display-value"
										])) : (0, vue_exports.createCommentVNode)("", true),
										(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxEmpty_default), {
											"data-slot": "empty",
											class: ui.value.empty({ class: (0, vue_exports.unref)(props).ui?.empty })
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(searchTerm.value ? (0, vue_exports.unref)(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : (0, vue_exports.unref)(t)("selectMenu.noData")), 1)])]),
											_: 3
										}, 8, ["class"]),
										(0, vue_exports.createVNode)("div", {
											ref_key: "viewportRef",
											ref: viewportRef,
											role: "presentation",
											"data-slot": "viewport",
											class: ui.value.viewport({ class: (0, vue_exports.unref)(props).ui?.viewport })
										}, [!!(0, vue_exports.unref)(props).virtualize ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 0 }, [
											createItem.value && createItemPosition.value === "top" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseCreateItemTemplate), { key: 0 })) : (0, vue_exports.createCommentVNode)("", true),
											(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxVirtualizer_default), (0, vue_exports.mergeProps)({
												options: filteredItems.value,
												"text-content": (item2) => isSelectItem(item2) ? (0, vue_exports.unref)(get)(item2, (0, vue_exports.unref)(props).labelKey) : String(item2)
											}, virtualizerProps.value), {
												default: (0, vue_exports.withCtx)(({ option: item, virtualItem }) => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseItemTemplate), {
													item,
													index: virtualItem.index
												}, null, 8, ["item", "index"])]),
												_: 1
											}, 16, ["options", "text-content"]),
											createItem.value && createItemPosition.value === "bottom" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseCreateItemTemplate), { key: 1 })) : (0, vue_exports.createCommentVNode)("", true)
										], 64)) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 1 }, [
											createItem.value && createItemPosition.value === "top" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
												key: 0,
												"data-slot": "group",
												class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseCreateItemTemplate))]),
												_: 1
											}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true),
											((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(filteredGroups.value, (group, groupIndex) => {
												return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
													key: `group-${groupIndex}`,
													"data-slot": "group",
													class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
												}, {
													default: (0, vue_exports.withCtx)(() => [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(group, (item, index) => {
														return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseItemTemplate), {
															key: `group-${groupIndex}-${index}`,
															item,
															index
														}, null, 8, ["item", "index"]);
													}), 128))]),
													_: 2
												}, 1032, ["class"]);
											}), 128)),
											createItem.value && createItemPosition.value === "bottom" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
												key: 1,
												"data-slot": "group",
												class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseCreateItemTemplate))]),
												_: 1
											}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true)
										], 64))], 2),
										(0, vue_exports.renderSlot)(_ctx.$slots, "content-bottom")
									]),
									_: 3
								}, 8, ["class"]), !!(0, vue_exports.unref)(props).arrow ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxArrow_default), (0, vue_exports.mergeProps)({ key: 0 }, arrowProps.value, {
									"data-slot": "arrow",
									class: ui.value.arrow({ class: (0, vue_exports.unref)(props).ui?.arrow })
								}), null, 16, ["class"])) : (0, vue_exports.createCommentVNode)("", true)]),
								_: 3
							}, 16, ["class"])]),
							_: 3
						})]),
						_: 3
					}, 16)];
				}),
				_: 3
			}, _parent));
			_push(`<!--]-->`);
		};
	}
});
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.11.1_20f0f97e47fbe0f2c628c90cb9c9b79b/node_modules/@nuxt/ui/dist/runtime/components/SelectMenu.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { AppNavbar_default as A, DismissableLayer_default as D, FocusScope_default as F, PopperRoot_default as P, _sfc_main$2 as _, _sfc_main$1 as a, _sfc_main as b, useId as c, useHideOthers as d, useBodyScrollLock as e, PopperAnchor_default as f, useForwardPropsEmits as g, PopperArrow_default as h, PopperContent_default as i, useFetch as u };
//# sourceMappingURL=SelectMenu-DTgPC44F.mjs.map
